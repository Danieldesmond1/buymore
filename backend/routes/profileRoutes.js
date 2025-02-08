import express from "express";
import { viewProfile, updateProfile, logout } from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js"; // Correct import

const router = express.Router();

// Route to fetch user profile (Authenticated users only)
router.get("/", authenticateToken, viewProfile);

// Route to update user profile (Authenticated users only)
router.put("/", authenticateToken, updateProfile);

// Route to log out the user
router.post("/logout", logout);

export default router;
