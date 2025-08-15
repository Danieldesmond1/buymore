import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../utils/dbConnect.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// GET /api/security/2fa-status
router.get('/2fa-status', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT is_2fa_enabled FROM users WHERE id = $1`,
      [req.user.userId]
    );

    const isEnabled = result.rows[0]?.is_2fa_enabled || false;
    res.status(200).json({ enabled: isEnabled });
  } catch (err) {
    console.error('2FA Status error:', err);
    res.status(500).json({ message: 'Server error while checking 2FA status.' });
  }
});

// PUT /api/security/change-password
router.put('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const userRes = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.userId]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.userId]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/security/enable-2fa
router.post('/enable-2fa', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await pool.query(
      `UPDATE users SET twofa_code = $1, twofa_code_expires = $2 WHERE id = $3`,
      [code, expires, userId]
    );

    const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    const email = result.rows[0]?.email;

    if (!email) return res.status(404).json({ message: 'Email not found.' });

    await sendEmail(
      email,
      "Your 2FA Verification Code",
      `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`
    );

    res.status(200).json({ message: '2FA code sent to your email.' });
  } catch (err) {
    console.error('Enable 2FA error:', err);
    res.status(500).json({ message: 'Server error while enabling 2FA.' });
  }
});

// POST /api/security/verify-2fa
router.post('/verify-2fa', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { code } = req.body;

  try {
    const result = await pool.query(
      `SELECT twofa_code, twofa_code_expires FROM users WHERE id = $1`,
      [userId]
    );

    const { twofa_code, twofa_code_expires } = result.rows[0];

    if (!twofa_code || !twofa_code_expires) {
      return res.status(400).json({ message: 'No 2FA code requested.' });
    }

    if (new Date() > twofa_code_expires) {
      return res.status(400).json({ message: '2FA code has expired.' });
    }

    if (code !== twofa_code) {
      return res.status(400).json({ message: 'Invalid 2FA code.' });
    }

    await pool.query(
      `UPDATE users SET is_2fa_enabled = true, twofa_code = null, twofa_code_expires = null WHERE id = $1`,
      [userId]
    );

    res.status(200).json({ message: '2FA successfully enabled.' });
  } catch (err) {
    console.error('Verify 2FA error:', err);
    res.status(500).json({ message: 'Server error verifying 2FA.' });
  }
});

// POST /api/security/confirm-login-2fa
router.post('/confirm-login-2fa', async (req, res) => {
  const { userId, code } = req.body;

  try {
    const result = await pool.query(
      `SELECT twofa_code, twofa_code_expires FROM users WHERE id = $1`,
      [userId]
    );

    const { twofa_code, twofa_code_expires } = result.rows[0];

    if (!twofa_code || !twofa_code_expires) {
      return res.status(400).json({ message: 'No 2FA code available.' });
    }

    if (code !== twofa_code || new Date() > twofa_code_expires) {
      return res.status(400).json({ message: 'Invalid or expired code.' });
    }

    await pool.query(
      `UPDATE users SET twofa_code = null, twofa_code_expires = null WHERE id = $1`,
      [userId]
    );

    const token = generateToken(userId);
    res.status(200).json({ token });
  } catch (err) {
    console.error('2FA confirm login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/security/disable-2fa
router.post('/disable-2fa', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      `UPDATE users SET is_2fa_enabled = false WHERE id = $1`,
      [req.user.userId]
    );
    res.status(200).json({ message: '2FA disabled.' });
  } catch (err) {
    console.error('Disable 2FA error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;