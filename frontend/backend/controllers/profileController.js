import pool from "../utils/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Middleware to fetch user profile
export const viewProfile = async (req, res) => {
  const userId = req.user?.userId;  // Assuming `req.user` is set after verifying 
  
  console.log("Decoded Token:", req.user); // Debugging
  console.log("Extracted userId:", userId); // Debugging

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing from token" });
  }

  try {
    const result = await pool.query("SELECT id, username, email, location FROM users WHERE id = $1", [userId]);

    console.log("Query result:", result.rows); // Debugging line

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// _________Update Profile_________

export const updateProfile = async (req, res) => {
  const userId = req.user?.userId; // or req.user.id, depending on your middleware
  const { username, location, password } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing from token" });
  }

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Removed updated_at from this query
    const queryText = `
      UPDATE users
      SET 
        username = COALESCE($1, username),
        location = COALESCE($2, location),
        password = COALESCE($3, password)
      WHERE id = $4
      RETURNING id, username, email, location;
    `;
    const values = [username || null, location || null, hashedPassword || null, userId];

    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// _______Logout_________
export const logout = (req, res) => {
  try {
    req.session = null; // If you're using cookie-session
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ______Authentication Middleware______
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to the request object
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};