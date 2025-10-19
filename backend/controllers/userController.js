import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../utils/dbConnect.js"; // Correct import

// User Sign-up
export const signupUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      location,
      role,
      bio,
      // Seller-specific
      shop_name,
      shop_handle,
      tagline,
      shop_description,
      store_type,
      banner_image,
      logo_image,
      business_address,
      estimated_shipping_time,
      return_policy,
      chat_enabled,
      social_links,
      verification_docs,
      preferred_language,
      seo_keywords,
      welcome_message,
      auto_reply
    } = req.body;

    const profileImageFile = req.files?.profile_image?.[0];
    const bannerImageFile = req.files?.banner_image?.[0];
    const logoImageFile = req.files?.logo_image?.[0];

    const normalizedEmail = email.toLowerCase();

    const checkEmailQuery = "SELECT * FROM users WHERE email = $1";
    const { rows: existingUser } = await pool.query(checkEmailQuery, [normalizedEmail]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserQuery = `
      INSERT INTO users (username, email, password, location, role, bio, profile_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, email, location, role
    `;
    const { rows: newUser } = await pool.query(createUserQuery, [
      username,
      normalizedEmail,
      hashedPassword,
      location,
      role,
      bio,
      profileImageFile ? profileImageFile.filename : null,
    ]);

    const userId = newUser[0].id;

    if (role === "seller") {
      // 🔍 Check if shop_handle exists
      const checkHandleQuery = "SELECT * FROM sellers_shop WHERE shop_handle = $1";
      const { rows: existingHandle } = await pool.query(checkHandleQuery, [shop_handle]);

      if (existingHandle.length > 0) {
        return res.status(400).json({ message: "Shop handle already exists. Please choose another." });
      }

      // ✅ Safe to insert now
      const createShopQuery = `
        INSERT INTO sellers_shop (
          user_id, shop_name, shop_handle, tagline, shop_description,
          store_type, banner_image, logo_image, business_address,
          estimated_shipping_time, return_policy, chat_enabled,
          social_links, verification_docs, preferred_language,
          seo_keywords, welcome_message, auto_reply
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18
        )
      `;

      await pool.query(createShopQuery, [
        userId,
        shop_name,
        shop_handle,
        tagline,
        shop_description,
        store_type,
        bannerImageFile ? bannerImageFile.filename : null,
        logoImageFile ? logoImageFile.filename : null,
        business_address,
        estimated_shipping_time,
        return_policy,
        chat_enabled ?? true,
        social_links ? JSON.parse(social_links) : null,
        verification_docs,
        preferred_language,
        seo_keywords,
        welcome_message,
        auto_reply
      ]);
    }

    return res.status(201).json({ message: "User created successfully", user: newUser[0] });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// updateBuyerProfile
export const updateBuyerProfile = async (req, res) => {
  try {
    const bio = req.body.bio;
    const profileImageFile = req.file;

    if (!bio || !profileImageFile) {
      return res.status(400).json({ message: "Bio and profile image are required." });
    }

    const profileImagePath = `/uploads/${profileImageFile.filename}`;
    const userId = req.user.userId;

    const updateQuery = `
      UPDATE users
      SET bio = $1, profile_image = $2
      WHERE id = $3
      RETURNING id, username, email, role, location, bio, profile_image
    `;

    const { rows: updatedUser } = await pool.query(updateQuery, [bio, profileImagePath, userId]);

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error in updateBuyerProfile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



// User Sign-in
// User Sign-in
export const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    const findUserQuery = "SELECT * FROM users WHERE email = $1";
    const { rows: user } = await pool.query(findUserQuery, [normalizedEmail]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔑 If seller, get their shop details
    let shop = null;
    if (user[0].role === "seller") {
      const shopQuery = "SELECT id, shop_name, shop_handle FROM sellers_shop WHERE user_id = $1 LIMIT 1";
      const { rows: shopRows } = await pool.query(shopQuery, [user[0].id]);
      if (shopRows.length > 0) shop = shopRows[0];
    }

    const token = jwt.sign(
      {
        userId: user[0].id,
        email: user[0].email,
        username: user[0].username,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
        shop, // ✅ Include shop info for sellers
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

    const user = rows[0];

    // ✅ Fetch shop info if seller
    if (user.role === "seller") {
      const shopQuery = `
        SELECT id, shop_name, shop_handle, banner_image, logo_image
        FROM sellers_shop
        WHERE user_id = $1
      `;
      const { rows: shopRows } = await pool.query(shopQuery, [userId]);
      const shop = shopRows[0] || null;
      user.shop = shop;
      user.shop_id = shop ? shop.id : null; // ✅ Add this line
    } else {
      user.shop = null;
      user.shop_id = null;
    }

    res.status(200).json(user);
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
