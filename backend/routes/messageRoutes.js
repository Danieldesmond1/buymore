import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  getSellerConversations,
} from "../controllers/messageController.js";

const router = express.Router();

// Start a new conversation
router.post("/conversations", authenticateToken, createConversation);

// Get all conversations for a user
router.get("/conversations", authenticateToken, getConversations);

// Get all conversations for seller
router.get("/seller", authenticateToken, getSellerConversations);


// Get messages in a conversation
router.get("/:conversationId", authenticateToken, getMessages);

// Send a message
router.post("/:conversationId", authenticateToken, sendMessage);

export default router;
