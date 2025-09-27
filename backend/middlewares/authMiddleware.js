import jwt from "jsonwebtoken";
import pool from "../utils/dbConnect.js"; // ✅ Import DB to fetch shop

// Middleware for authenticated users
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(403).json({ message: "User ID is missing from token" });
    }

    // Attach base user info
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      shop: null, // ✅ Initialize
    };

    // ✅ If user is a seller, fetch their shop_id from DB
    if (decoded.role === "seller") {
      const result = await pool.query(
        "SELECT id FROM sellers_shop WHERE user_id = $1 LIMIT 1",
        [decoded.userId]
      );
      if (result.rows.length > 0) {
        req.user.shop = { id: result.rows[0].id };
      }
    }

    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Admin auth
export const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Admins only." });

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Invalid admin token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
