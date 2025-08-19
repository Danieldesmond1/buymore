import jwt from "jsonwebtoken";

// Middleware for authenticated users
export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token; // ✅ read token from cookies

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(403).json({ message: "User ID is missing from token" });
    }

    // Attach user info to request, using consistent keys
    req.user = { id: decoded.userId, username: decoded.username, role: decoded.role };
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
