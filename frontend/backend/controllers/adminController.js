import pool from "../utils/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminSignup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const result = await pool.query(
      "INSERT INTO admin (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username, email, hashedPassword, "admin"]
    );    

    res.status(201).json({ message: "Admin registered successfully", admin: result.rows[0] });
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// __________________________________________

export const adminSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

    if (admin.rows.length === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Include `role: "admin"` in the token
    const token = jwt.sign(
      { adminId: admin.rows[0].id, email: admin.rows[0].email, role: admin.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Admin login successful", token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ____________________________________

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, location FROM users");

    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// _______________________________________

export const adminLogout = (req, res) => {
  try {
    req.session = null; // Clearing session if using `cookie-session`
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
