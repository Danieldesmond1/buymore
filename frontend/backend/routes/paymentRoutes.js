import express from "express";
import { initializePayment, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/paystack/initiate", initializePayment);
router.get("/paystack/verify", verifyPayment);

export default router;
