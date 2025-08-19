import pool from "../utils/dbConnect.js";

// Start new conversation (buyer <-> shop)
export const createConversation = async (req, res) => {
  try {
    const buyerId = req.user.id; // ✅ now matches middleware
    const { shopId, productId } = req.body;

    if (!buyerId) return res.status(401).json({ message: "User not logged in" });
    if (!shopId || !productId) return res.status(400).json({ message: "Missing shopId or productId" });

    // Check if conversation already exists
    const existing = await pool.query(
      "SELECT * FROM conversations WHERE buyer_id=$1 AND shop_id=$2 AND product_id=$3",
      [buyerId, shopId, productId]
    );
    if (existing.rows.length > 0) return res.json(existing.rows[0]);

    // Create new conversation
    const result = await pool.query(
      "INSERT INTO conversations (buyer_id, shop_id, product_id) VALUES ($1, $2, $3) RETURNING *",
      [buyerId, shopId, productId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT c.*, 
              s.shop_name AS shop_name,
              p.name AS product_name,
              p.image_url AS product_image,
              (
                SELECT m.message_text
                FROM messages m
                WHERE m.conversation_id = c.id
                ORDER BY m.created_at DESC
                LIMIT 1
              ) AS last_message
       FROM conversations c
       JOIN sellers_shop s ON c.shop_id = s.id
       JOIN products p ON c.product_id = p.id
       WHERE c.buyer_id=$1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get messages inside a conversation
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.*, u.username, u.profile_image 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id=$1 
       ORDER BY m.created_at ASC`,
      [conversationId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: err.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  const senderId = req.user.id;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (conversation_id, sender_id, message_text) VALUES ($1, $2, $3) RETURNING *",
      [conversationId, senderId, text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: err.message });
  }
};
