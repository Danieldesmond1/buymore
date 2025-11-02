import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./styles/MessagesPanel.css";

const MessagesPanel = () => {
  const [conversations, setConversations] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const messagesEndRef = useRef(null);

  // Logged-in seller
  const sellerId = JSON.parse(localStorage.getItem("user"))?.id;

  // Fetch all conversations for seller
  const fetchConversations = async () => {
    try {
      const res = await axios.get("/api/messages/seller", { withCredentials: true });
      setConversations(res.data);
      if (res.data.length > 0) setSelectedConversation(res.data[0]);
    } catch (err) {
      console.error("Error fetching seller conversations:", err);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(`/api/messages/${conversationId}`, { withCredentials: true });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const res = await axios.post(
        `/api/messages/${selectedConversation.id}`,
        { text: newMessage },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation.id);
  }, [selectedConversation]);

  // Helper to parse product image
  const getProductImage = (productImage) => {
    let parsedImages = [];
    try {
      parsedImages = JSON.parse(productImage || "[]");
    } catch {
      parsedImages = [];
    }
    return parsedImages.length > 0
      ? parsedImages[0].startsWith("http")
        ? parsedImages[0]
        : `http://localhost:5000${parsedImages[0]}`
      : "/fallback.jpg";
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.last_message && conv.last_message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unread) ||
      (filter === "resolved" && !conv.unread);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="messages-container">
      {/* Sidebar */}
      <div className={`messages-sidebar ${isMobileView ? "hide-sidebar" : ""}`}>
        <h3>Conversations</h3>
        <div className="sidebar-controls">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <ul>
          {filteredConversations.length === 0 && (
            <li style={{ textAlign: "center" }}>No conversations yet.</li>
          )}
          {filteredConversations.map((conv) => (
            <li
              key={conv.id}
              className={`conversation-item ${
                selectedConversation?.id === conv.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedConversation(conv);
                if (window.innerWidth < 768) setIsMobileView(true);
              }}
            >
              <div className="conv-header">
                <div className="conv-name">
                  {conv.shop_name} - {conv.product_name}
                </div>
                {conv.unread && <span className="unread-badge">•</span>}
              </div>
              <div className="conv-preview">{conv.last_message}</div>
              <div className="conv-time">{new Date(conv.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className={`chat-panel ${isMobileView ? "show-chat" : ""}`}>
      {selectedConversation ? (
        <>
          <div className="chat-header">
            {isMobileView && (
              <button className="back-btn" onClick={() => setIsMobileView(false)}>
                ←
              </button>
            )}
            <div className="chat-product-header">
              <img
                src={getProductImage(selectedConversation.product_image)}
                alt={selectedConversation.product_name}
              />
              <div className="chat-product-info">
                <h4>{selectedConversation.product_name}</h4>
                <span>From: {selectedConversation.shop_name}</span>
              </div>
            </div>
          </div>

            {/* Chat Body */}
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.sender_id === sellerId ? "sent" : "received"
                  }`}
                >
                  {/* Show product thumbnail only on first message */}
                  {idx === 0 && (
                    <img
                      src={getProductImage(selectedConversation.product_image)}
                      alt={selectedConversation.product_name}
                      className="chat-message-product"
                    />
                  )}
                  <p>{msg.message_text}</p>
                  <span className="chat-time">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPanel;
