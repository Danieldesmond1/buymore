import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import locationRoutes from './routes/locationRoutes.js';
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import { authenticateToken } from "./middlewares/authMiddleware.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js"; // Import Product Routes
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shopRoutes from "./routes/shopRoutes.js"; // 👈 Add this
import wishlistRoutes from "./routes/wishlistRoutes.js";
import securityRoutes from "./routes/security.js";
import messageRoutes from "./routes/messageRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://buymore-1.onrender.com"
  ],
  credentials: true
}));

// Serve uploads folder with NO CACHE (fixes Render 304 blank image issue)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cache-Control", "no-store"); // prevent any caching
    next();
  },
  express.static(path.join(path.resolve(), "uploads"), {
    etag: false,
    lastModified: false,
    cacheControl: false,
    maxAge: 0
  })
);

app.use(cookieParser());

// Middleware
app.use(express.json()); // Parse incoming JSON payloads

// Routes
app.use("/api/users", userRoutes); // User authentication routes
app.use("/api/profile", authenticateToken, profileRoutes);
app.use("/admin", adminRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes); // Mount Product Routes
app.use("/api/shipping", shippingRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/locations", locationRoutes);
app.use("/api/shops", shopRoutes); // 👈 This exposes /api/shops
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/security', securityRoutes);
app.use("/api/messages", messageRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
