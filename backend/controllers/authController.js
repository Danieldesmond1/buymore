import pool from "../utils/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login User (Admin & Regular)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Get user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 2️⃣ Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let shop = null;

    // 3️⃣ If user is a seller, fetch their shop info
    if (user.role === "seller") {
      const shopResult = await pool.query(
        "SELECT id, shop_name, shop_handle, logo_image FROM sellers_shop WHERE user_id = $1",
        [user.id]
      );
      if (shopResult.rows.length > 0) {
        shop = shopResult.rows[0];
      }
    }

    // 4️⃣ Generate JWT with shop info included
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        shop, // 👈 add shop data to payload
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      shop, // 👈 return shop info to frontend too (optional, useful for UI)
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
