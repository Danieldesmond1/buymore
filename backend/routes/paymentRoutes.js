import express from "express";
import {
  initializePayment,
  verifyPayment,
  convertCurrencyController,
} from "../controllers/paymentController.js";
import {
  getSellerBalance,
  getSellerTransactions,
} from "../controllers/sellerPaymentController.js";

const router = express.Router();

// Paystack Routes
router.post("/paystack/initiate", initializePayment);
router.get("/paystack/verify", verifyPayment);

// ✅ USD → NGN conversion route
router.get("/convert/:usd", convertCurrencyController);

// Seller Routes
router.get("/seller/:sellerId", getSellerBalance);
router.get("/transactions/:sellerId", getSellerTransactions);

export default router;