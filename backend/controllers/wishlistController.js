import pool from "../utils/dbConnect.js"; // Correct import

// Get all wishlist items for a user
export const getUserWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT w.id, w.product_id, p.name, p.price, p.image_url, w.created_at
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.status(200).json({ wishlist: result.rows });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const check = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const result = await pool.query(
      `INSERT INTO wishlist (user_id, product_id, created_at)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [user_id, product_id]
    );

    res.status(201).json({ wishlistItem: result.rows[0] });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  const { wishlistId } = req.params;

  try {
    await pool.query("DELETE FROM wishlist WHERE id = $1", [wishlistId]);
    res.status(200).json({ message: "Wishlist item removed" });
  } catch (err) {
    console.error("Error removing wishlist item:", err);
    res.status(500).json({ error: "Server error" });
  }
};
