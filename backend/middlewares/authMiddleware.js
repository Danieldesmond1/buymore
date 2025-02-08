import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded); // 🔴 Debugging log

    // ✅ Ensure `userId` exists
    if (!decoded.userId) {
      return res.status(403).json({ message: "User ID is missing from token" });
    }

    req.user = decoded; // Attach user details to request
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};



// ✅ Updated Admin Middleware (Checks Role Instead of `adminId`)
export const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Invalid admin token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};