import express from "express";
import { adminSignup, getAllUsers, adminLogout, adminSignin } from "../controllers/adminController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// Admin authentication routes
router.post("/signup", adminSignup);
router.post("/signin", adminSignin);
router.post("/logout", adminLogout);

// Protected admin routes (only admins can access)
router.get("/users", authenticateAdmin, getAllUsers);

export default router;
