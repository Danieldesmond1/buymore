import express from "express";
import { signupUser, signinUser, getMe } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/me", authenticateToken, getMe); // ✅ Protected route

export default router;
