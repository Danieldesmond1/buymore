import express from "express";
import { signupUser, signinUser, getMe, logoutUser, updateBuyerProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";  // <-- import multer upload

const router = express.Router();

router.post("/signup", upload.single("profile_image"), signupUser);
router.post("/signin", signinUser);
router.get("/me", authenticateToken, getMe);
router.post("/logout", logoutUser);

// Use multer middleware 'upload.single("profile_image")' to parse single file upload with key 'profile_image'
router.post("/buyerProfile", authenticateToken, upload.single("profile_image"), updateBuyerProfile);

export default router;
