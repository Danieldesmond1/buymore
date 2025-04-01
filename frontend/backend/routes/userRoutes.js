import express from "express";
import { signupUser, signinUser } from "../controllers/userController.js"; // Import functions

const router = express.Router();

// User signup route
router.post("/signup", signupUser);

// User signin route
router.post("/signin", signinUser);

export default router;
