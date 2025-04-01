import pool from "../utils/dbConnect.js";

export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    // Check if the product is already in the cart
    const existingItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity if item exists
      const updatedQuantity = existingItem.rows[0].quantity + (quantity || 1);
      await pool.query(
        "UPDATE cart SET quantity = $1, updated_at = NOW() WHERE user_id = $2 AND product_id = $3",
        [updatedQuantity, user_id, product_id]
      );
    } else {
      // Insert new cart item
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [user_id, product_id, quantity || 1]
      );
    }

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    console.log("Received params:", req.params); // Debugging line
    const { user_id } = req.params; 

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await pool.query(
      `SELECT c.id AS cart_id, c.quantity, p.id AS product_id, p.name, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );

    res.status(200).json({ cart: result.rows });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    await pool.query(
      "UPDATE cart SET quantity = $1, updated_at = NOW() WHERE id = $2",
      [quantity, cart_id]
    );

    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { cart_id } = req.params;

    await pool.query("DELETE FROM cart WHERE id = $1", [cart_id]);

    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
