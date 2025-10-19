import pool from "../utils/dbConnect.js";

// 1️⃣ Place an Order (create orders + order_items)
export const placeOrder = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Get cart items (now using p.shop_id as seller_id)
    const cartItems = await pool.query(
      `SELECT c.product_id, c.quantity, p.price, p.shop_id AS seller_id
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [user_id]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Calculate total price
    const totalPrice = cartItems.rows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Seller/shop ID from first product in cart
    const sellerId = cartItems.rows[0].seller_id || null;

    // ✅ Insert into orders table
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_price, status, created_at, updated_at, seller_id)
       VALUES ($1, $2, 'pending', NOW(), NOW(), $3)
       RETURNING id`,
      [user_id, totalPrice, sellerId]
    );

    const orderId = orderResult.rows[0].id;

    // ✅ Insert order items
    for (const item of cartItems.rows) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // ✅ Clear user's cart
    await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

    // ✅ Response
    res.status(201).json({
      message: "Order placed successfully",
      order_id: orderId,
      total_price: totalPrice,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
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

// ✅ Get orders for a seller (using shop_id)
export const getSellerOrders = async (req, res) => {
  try {
    const { seller_id } = req.params;

    if (!seller_id) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Get orders where this seller's (shop's) products were purchased
    const sellerOrders = await pool.query(
      `
      SELECT 
        o.id AS order_id,
        o.user_id AS buyer_id,
        u.username AS buyer_name,
        o.total_price,
        o.status,
        o.created_at
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      JOIN users u ON u.id = o.user_id
      WHERE p.shop_id = $1
      GROUP BY o.id, u.username, o.total_price, o.status, o.created_at, o.user_id
      ORDER BY o.created_at DESC
      `,
      [seller_id]
    );

    res.status(200).json({ orders: sellerOrders.rows });
  } catch (error) {
    console.error("❌ Error fetching seller orders:", error);
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
