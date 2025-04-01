import axios from "axios";
import pool from "../utils/dbConnect.js";
import dotenv from "dotenv";

dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// 🟢 Initialize Payment
export const initializePayment = async (req, res) => {
  try {
    const { user_id } = req.body; // Only receive user_id, no amount from user!

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // 🔹 Step 1: Calculate total cart amount for the user
    const cartQuery = `
      SELECT SUM(products.price * cart.quantity) AS total_amount
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = $1;
    `;
    const cartResult = await pool.query(cartQuery, [user_id]);

    const totalAmount = cartResult.rows[0]?.total_amount || 0;

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Cart is empty or total is invalid" });
    }

    // 🔹 Step 2: Initialize Paystack payment with calculated total
    const paymentData = {
      email: req.body.email, // User's email
      amount: totalAmount * 100, // Convert to kobo
      currency: "NGN",
      callback_url: "http://localhost:5000/api/payment/verify",
    };

    const response = await axios.post("https://api.paystack.co/transaction/initialize", paymentData, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Payment initialization failed", error: error.response?.data || error });
  }
};

// 🟢 Verify Payment & Save to DB
export const verifyPayment = async (req, res) => {
  try {
    const { reference, user_id, order_id } = req.body; // Receive user_id and order_id

    if (!reference || !user_id || !order_id) {
      return res.status(400).json({ message: "Reference, user_id, and order_id are required" });
    }

    // Verify the payment with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });

    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const amount = paymentData.amount / 100; // Convert from kobo to naira
      const payment_method = paymentData.channel;
      const status = paymentData.status;
      const transaction_id = paymentData.id;

      // Insert payment into database
      const query = `
        INSERT INTO payments (user_id, order_id, amount, payment_method, status, transaction_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *;
      `;
      const values = [user_id, order_id, amount, payment_method, status, transaction_id];

      const result = await pool.query(query, values);
      const savedPayment = result.rows[0];

      // Optional: Update order status to "paid"
      await pool.query(`UPDATE orders SET status = 'paid' WHERE id = $1`, [order_id]);

      return res.status(200).json({ message: "Payment verified and saved", payment: savedPayment });
    } else {
      return res.status(400).json({ message: "Payment verification failed", error: paymentData });
    }
  } catch (error) {
    res.status(500).json({ message: "Payment verification error", error: error.response?.data || error });
  }
};
