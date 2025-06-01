import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../utils/dbConnect.js"; // Correct import

// User Sign-up
export const signupUser = async (req, res) => {
  const { username, email, password, location, role  } = req.body;

  try {
    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const checkEmailQuery = "SELECT * FROM users WHERE email = $1";
    const { rows: existingUser } = await pool.query(checkEmailQuery, [normalizedEmail]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const createUserQuery =
      "INSERT INTO users (username, email, password, location, role) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const { rows: newUser } = await pool.query(createUserQuery, [
      username,
      normalizedEmail,
      hashedPassword,
      location,
      role,
    ]);

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser[0] });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// User Sign-in
// User Sign-in
export const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    // Find the user by email
    const findUserQuery = "SELECT * FROM users WHERE email = $1";
    const { rows: user } = await pool.query(findUserQuery, [normalizedEmail]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user[0].id,
        email: user[0].email,
        username: user[0].username,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
        location: user[0].location,
      },
    });

  } catch (error) {
    console.error("Error signing in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get logged-in user
export const getMe = async (req, res) => {
  try {
    const { userId } = req.user;
    const query = "SELECT id, username, email, location, role FROM users WHERE id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
