import axios from "axios";
import pool from "../utils/dbConnect.js";
import dotenv from "dotenv";
dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY; // ExchangeRate-API key

// ✅ Convert USD → NGN
export const convertUSDToNGN = async (usdAmount) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`
    );
    const rate = response.data.conversion_rates.NGN;
    const ngnAmount = usdAmount * rate;
    return Math.round(ngnAmount);
  } catch (error) {
    console.error("❌ Currency conversion failed:", error.message);
    throw new Error("Failed to convert currency");
  }
};

// ✅ Standalone API endpoint for frontend conversion test
export const convertCurrencyController = async (req, res) => {
  try {
    const usd = Number(req.params.usd);
    if (isNaN(usd)) return res.status(400).json({ message: "Invalid USD amount" });

    const ngn = await convertUSDToNGN(usd);
    res.json({ usd, ngn });
  } catch (err) {
    console.error("❌ Conversion route error:", err.message);
    res.status(500).json({ message: "Conversion error", error: err.message });
  }
};

// 🟢 Initialize Payment (Buyer → Paystack)
export const initializePayment = async (req, res) => {
  try {
    const { user_id, email, order_id } = req.body;

    if (!user_id || !email || !order_id) {
      return res.status(400).json({ message: "user_id, email, and order_id are required" });
    }

    // Get total order amount (in USD)
    const result = await pool.query(
      `SELECT total_price FROM orders WHERE id = $1 AND user_id = $2`,
      [order_id, user_id]
    );

    const totalAmountUSD = result.rows[0]?.total_price;
    if (!totalAmountUSD) return res.status(404).json({ message: "Order not found" });

    // ✅ Convert USD → NGN
    const totalAmountNGN = await convertUSDToNGN(totalAmountUSD);

    const paymentData = {
      email,
      amount: totalAmountNGN * 100, // Paystack expects kobo
      currency: "NGN",
      callback_url: "http://localhost:5173/payment-success",
    };

    const response = await axios.post("https://api.paystack.co/transaction/initialize", paymentData, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    res.json({
      ...response.data,
      rate_used: totalAmountNGN / totalAmountUSD,
      totalAmountNGN,
    });
  } catch (error) {
    console.error("❌ Payment initialization error:", error);
    res.status(500).json({ message: "Error initializing payment" });
  }
};

// 🔥 VERIFY PAYSTACK PAYMENT
export const verifyPayment = async (req, res) => {
  const { reference, order_id } = req.query;

  if (!reference) {
    return res.status(400).json({ message: "Missing payment reference" });
  }

  try {
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const { data } = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentData = data.data;

    if (paymentData.status === "success") {
      const {
        amount,
        channel,
        id: transactionId,
        fees,
        customer: { email },
      } = paymentData;

      // 🟢 Save to DB
      const insertQuery = `
        INSERT INTO payments (user_id, order_id, amount, fee, payment_method, status, transaction_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *;
      `;

      const values = [
        1, // temporary user_id (replace with real auth later)
        order_id,
        amount / 100, // convert from kobo to Naira
        fees || 0,
        channel || "Paystack",
        "success",
        transactionId.toString(),
      ];

      const result = await pool.query(insertQuery, values);

      return res.json({
        message: "Payment verified and saved successfully",
        payment: result.rows[0],
      });
    } else {
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Paystack verify error:", err.message);
    return res.status(500).json({
      message: "Error verifying payment",
      error: err.message,
    });
  }
};