import pool from "../utils/dbConnect.js";

// 1. Place an Order
export const placeOrder = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch cart items
    const cartItems = await pool.query(
      `SELECT c.product_id, c.quantity, p.price 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [user_id]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    const totalPrice = cartItems.rows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Insert into orders table
    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id",
      [user_id, totalPrice]
    );
    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of cartItems.rows) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear user's cart
    await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Get User's Orders
export const getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    res.status(200).json({ orders: orders.rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Get Order Details
export const getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [
      order_id,
    ]);

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItems = await pool.query(
      `SELECT oi.quantity, oi.price, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [order_id]
    );

    res.status(200).json({ order: order.rows[0], items: orderItems.rows });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await pool.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, order_id]
    );

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
