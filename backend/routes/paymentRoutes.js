import express from "express";
import {
  initializePayment,
  verifyPayment,
  convertCurrencyController,
  getBankList,
  verifyBankAccount,
  withdrawToBank,
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

// Bank-related Routes
router.get("/banks", getBankList); // ✅ Get all supported banks
router.post("/verify-bank", verifyBankAccount); // ✅ Verify account name/number
router.post("/withdraw", withdrawToBank); // ✅ Withdraw seller balance to bank


export default router;