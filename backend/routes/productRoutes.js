import express from "express";
import { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  getRelatedProducts,
  getAllCategories,
  getProductsByCategory,
  searchProducts,
  // getFilteredProducts,
  likeProduct,
  getMostLikedProducts,
  toggleProductLike,
  getProductLikes,
  addProductReview,
  getProductReviews,
  toggleWishlist,
  getWishlist
} from "../controllers/productController.js";
import { authenticateAdmin, authenticateToken } from "../middlewares/authMiddleware.js";
import { multerUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Products Likes
router.post("/:id/like", likeProduct); // Like or unlike a product
router.get("/most-liked", getMostLikedProducts); // Get most liked products
router.post("/like", toggleProductLike);
router.get("/:product_id/likes", getProductLikes);

// Products Reviews
router.post("/reviews", addProductReview); // ✅ Add or Update Review
router.get("/reviews/:product_id", getProductReviews); // ✅ Get Reviews for a Product

// Wishlist
router.post("/wishlist", toggleWishlist); // ✅ Add/Remove from Wishlist
router.get("/wishlist/:user_id", getWishlist); // ✅ Get User's Wishlist

// Users Search Routes
router.get("/search", searchProducts); // Search products by name
// router.get("/", getFilteredProducts); // Update existing route for filtering

// Category Routes
router.get("/categories", getAllCategories); // Get all categories
router.get("/category/:category", getProductsByCategory); // Get products by category


// Public Routes
router.get("/:id/related", getRelatedProducts);
router.get("/", getAllProducts); // Get all products
router.get("/my-products", authenticateToken, getAllProducts); // Get products for the authenticated seller
router.get("/:id", getProductById); // Get a single product by ID

// Admin-Only Routes
router.post(
  "/", 
  authenticateToken, 
  multerUpload.array("images", 4), // Accept up to 4 images
  addProduct
); // Add a product

router.put(
  "/:id",
  authenticateToken,  // ✅ Allow sellers & admins
  multerUpload.array("images", 4),
  updateProduct
);

router.delete("/:id", authenticateToken, deleteProduct); // Delete a product

export default router;