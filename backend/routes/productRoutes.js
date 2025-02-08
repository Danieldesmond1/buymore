import express from "express";
import { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get a single product by ID

// Admin-Only Routes
router.post("/", authenticateAdmin, addProduct); // Add a product
router.put("/:id", authenticateAdmin, updateProduct); // Update a product
router.delete("/:id", authenticateAdmin, deleteProduct); // Delete a product

export default router;
