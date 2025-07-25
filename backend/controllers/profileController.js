import pool from "../utils/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// _________ View Profile _________
export const viewProfile = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing from token" });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, email, location, bio, profile_image FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// _________ Update Profile (with image and optional password) _________
export const updateProfile = async (req, res) => {
  const userId = req.user?.userId;
  const { username, location, password, bio } = req.body;
  const profileImage = req.file?.filename; // filename only (e.g. "abc.jpg")

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    // Get current image to delete if a new one is uploaded
    const oldResult = await pool.query("SELECT profile_image FROM users WHERE id = $1", [userId]);
    const oldImage = oldResult.rows[0]?.profile_image;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateQuery = `
      UPDATE users
      SET
        username = COALESCE($1, username),
        location = COALESCE($2, location),
        password = COALESCE($3, password),
        bio = COALESCE($4, bio),
        profile_image = COALESCE($5, profile_image)
      WHERE id = $6
      RETURNING id, username, email, location, bio, profile_image;
    `;

    const values = [
      username || null,
      location || null,
      hashedPassword || null,
      bio || null,
      profileImage || null,
      userId,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old image file if a new one was uploaded
    if (profileImage && oldImage && oldImage !== profileImage) {
      const oldPath = path.join("uploads", oldImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ______ Logout ______
export const logout = (req, res) => {
  try {
    req.session = null; // If using cookie-session
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ______ Authentication Middleware ______
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded token info to req
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
