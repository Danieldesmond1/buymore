import express from "express";
import multer from "multer";
import path from "path";
import { viewProfile, updateProfile, logout } from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/", authenticateToken, viewProfile);
router.put("/", authenticateToken, upload.single("profile_image"), updateProfile);
router.post("/logout", logout);

export default router;
