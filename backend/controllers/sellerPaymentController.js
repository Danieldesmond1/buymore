import pool from "../utils/dbConnect.js";

// 🟢 Seller balance
export const getSellerBalance = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await pool.query(`SELECT * FROM seller_balances WHERE seller_id = $1`, [sellerId]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching seller balance" });
  }
};

// 🟢 Seller transaction history
export const getSellerTransactions = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await pool.query(
      `SELECT p.*, o.id AS order_id 
       FROM payments p 
       JOIN orders o ON p.order_id = o.id
       WHERE o.seller_id = $1
       ORDER BY p.created_at DESC`,
      [sellerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};
