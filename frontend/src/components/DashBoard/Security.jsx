import { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/Security.css';

const SecuritySettings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAForm, setShow2FAForm] = useState(false);

  // ✅ Use live/local backend dynamically
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/security/2fa-status`, {
          withCredentials: true,
        });
        setIs2FAEnabled(res.data.enabled);
      } catch {
        // fail silently
      }
    };
    fetch2FAStatus();
  }, [API_BASE]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await axios.put(
        `${API_BASE}/api/security/change-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      setStatus(res.data.message);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error changing password.');
    }
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      disable2FA();
    } else {
      setShow2FAForm(true);
    }
  };

  const enable2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/security/enable-2fa`,
        { email },
        { withCredentials: true }
      );
      setStatus('✅ Verification code sent! Please check your email.');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error enabling 2FA.');
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/security/verify-2fa`,
        { code },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIs2FAEnabled(true);
        setShow2FAForm(false);
        setStatus('🎉 2FA enabled successfully! Your account is now more secure.');

        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
      } else {
        setStatus(res.data.message || 'Invalid code.');
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error verifying code.');
    }
  };

  const disable2FA = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/security/disable-2fa`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIs2FAEnabled(false);
        setShow2FAForm(false);
        setStatus('⚠️ Two-Factor Authentication has been disabled.');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStatus(res.data.message || 'Error disabling 2FA.');
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error disabling 2FA.');
    }
  };

  return (
    <div className="security-section">
      <h2>Security Settings</h2>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="password-form">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>

      {/* Two-Factor Authentication */}
      <div className="twofa-section">
        <div className="toggle-label">
          <label>Two-Factor Authentication (2FA)</label>
          <label className="switch">
            <input type="checkbox" checked={is2FAEnabled} onChange={handleToggle2FA} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* 2FA Forms */}
        {show2FAForm && !is2FAEnabled && (
          <div className={`twofa-form-container ${show2FAForm ? 'open' : 'closed'}`}>
            <form onSubmit={enable2FA} className="twofa-form">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Send Verification Code</button>
            </form>

            <form onSubmit={verify2FA} className="twofa-form">
              <input
                type="text"
                placeholder="Enter 2FA Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="submit">Verify</button>
            </form>
          </div>
        )}
      </div>

      {/* Status Message */}
      {status && <div className="animated-alert">{status}</div>}
    </div>
  );
};

export default SecuritySettings;
