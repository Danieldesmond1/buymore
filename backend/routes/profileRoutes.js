import express from "express";
import multer from "multer";
import path from "path";
import { viewProfile, updateProfile, logout } from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 28398392.png
  },
});

const upload = multer({ storage });

// Routes
router.get("/", authenticateToken, viewProfile);

// 👇 Use 'upload.single("profile_image")' to handle the image field
router.put("/", authenticateToken, upload.single("profile_image"), updateProfile);

router.post("/logout", logout);

export default router;
