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

// ✅ Get Supported Bank List
export const getBankList = async (req, res) => {
  try {
    const { data } = await axios.get("https://api.paystack.co/bank", {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    res.json(data.data);
  } catch (error) {
    console.error("❌ Error fetching banks:", error.message);
    res.status(500).json({ message: "Failed to fetch bank list" });
  }
};

// ✅ 2. Verify bank account number
export const verifyBankAccount = async (req, res) => {
  const { account_number, bank_code } = req.body;
  if (!account_number || !bank_code)
    return res.status(400).json({ message: "account_number and bank_code are required" });

  try {
    const { data } = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    res.json(data.data);
  } catch (error) {
    console.error("❌ Bank verification error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to verify account", error: error.message });
  }
};

// ✅ 3. Withdraw seller balance to bank
export const withdrawToBank = async (req, res) => {
  const { seller_id, account_number, bank_code, amount } = req.body;

  if (!seller_id || !account_number || !bank_code || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Optional: Check if seller has enough balance
    const balanceRes = await pool.query(
      "SELECT balance FROM seller_balances WHERE seller_id = $1",
      [seller_id]
    );
    const currentBalance = balanceRes.rows[0]?.balance || 0;
    if (currentBalance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Create transfer recipient
    const recipientRes = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: "Seller Payout",
        account_number,
        bank_code,
        currency: "NGN",
      },
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );

    const recipientCode = recipientRes.data.data.recipient_code;

    // Initialize transfer
    const transferRes = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100,
        recipient: recipientCode,
        reason: "Seller payout from Crypstil",
      },
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );

    // Update balance
    await pool.query(
      "UPDATE seller_balances SET balance = balance - $1 WHERE seller_id = $2",
      [amount, seller_id]
    );

    res.json({
      message: "Withdrawal successful",
      transfer: transferRes.data.data,
    });
  } catch (error) {
    console.error("❌ Withdrawal error:", error.response?.data || error.message);
    res.status(500).json({ message: "Withdrawal failed", error: error.message });
  }
};