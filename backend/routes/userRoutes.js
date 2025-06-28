import express from "express";
import { signupUser, signinUser, getMe, logoutUser, updateBuyerProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { multerUpload } from "../middlewares/uploadMiddleware.js";
import pool from "../utils/dbConnect.js"; // Correct import

const router = express.Router();

router.post(
  "/signup",
  multerUpload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
    { name: "logo_image", maxCount: 1 },
  ]),
  signupUser
);

router.post("/signin", signinUser);
router.get("/me", authenticateToken, getMe);
router.post("/logout", logoutUser);

router.get("/check-handle", async (req, res) => {
  const { handle } = req.query;

  try {
    const checkQuery = "SELECT id FROM sellers_shop WHERE shop_handle = $1";
    const { rows } = await pool.query(checkQuery, [handle]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "Shop handle already taken" });
    }

    res.status(200).json({ message: "Shop handle available" });
  } catch (error) {
    console.error("Handle check error:", error);
    res.status(500).json({ message: "Error checking shop handle" });
  }
});


// Use multer middleware 'upload.single("profile_image")' to parse single file upload with key 'profile_image'
router.post("/buyerProfile", authenticateToken, multerUpload.single("profile_image"), updateBuyerProfile);

export default router;
