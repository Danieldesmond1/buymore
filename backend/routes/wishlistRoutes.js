import express from "express";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/user/:userId", getUserWishlist);
router.post("/add", addToWishlist);
router.delete("/remove/:wishlistId", removeFromWishlist);

export default router;
