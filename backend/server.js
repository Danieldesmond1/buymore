import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware
app.use(express.json()); // Parse incoming JSON payloads

// Routes
app.use("/api/users", userRoutes); // User authentication routes
app.use("/profile", authenticateToken, profileRoutes);
app.use("/admin", adminRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes); // Mount Product Routes
app.use("/api/shipping", shippingRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/locations", locationRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
