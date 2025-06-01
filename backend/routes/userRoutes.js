import express from "express";
import { signupUser, signinUser, getMe, logoutUser } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/me", authenticateToken, getMe); // ✅ Protected route
router.post("/logout", logoutUser); 

export default router;
