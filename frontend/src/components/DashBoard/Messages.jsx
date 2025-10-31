import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Styles/Messages.css";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const isMobile = window.innerWidth < 650;


  // Load logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages/conversations", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch conversations");

        const data = await res.json();
        setConversations(data);

        if (chatId) {
          const conv = data.find((c) => c.id === parseInt(chatId));
          if (conv) setSelected(conv);
        } else if (data.length > 0) {
          setSelected(data[0]);
          navigate(`/dashboard/messages/${data[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    fetchConversations();
  }, [chatId, navigate]);

  // Load messages when selected conversation changes
  useEffect(() => {
    if (!selected) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${selected.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [selected]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selected) return;

    try {
      const res = await fetch(`http://localhost:5000/api/messages/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: newMessage }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to get product image URL
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
      : "/fallback.jpg"; // fallback
  };

  return (
    <div className={`messages-container ${isMobile && selected ? "chat-active" : ""}`}>
      {/* Sidebar */}
      <div className="conversations-list">
        <h3>Chats</h3>
        {conversations.length === 0 && <p>No conversations</p>}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item ${selected?.id === conv.id ? "active" : ""}`}
            onClick={() => navigate(`/dashboard/messages/${conv.id}`)}
          >
            <h4>{conv.shop_name} - {conv.product_name}</h4>
            <p>{conv.last_message || "No messages yet"}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="chat-header" onClick={() => isMobile && setSelected(null)}>
              <h4>{selected.shop_name}</h4>
              {selected.product_name && (
                <div className="chat-product-header">
                  <img
                    src={getProductImage(selected.product_image)}
                    alt={selected.product_name}
                  />
                  <div className="chat-product-info">
                    <h4>{selected.product_name}</h4>
                    <span>From: {selected.shop_name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Body */}
            <div className="chat-body">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.sender_id === currentUser?.id ? "buyer" : "seller"
                  }`}
                >
                  {/* Optional: show product thumbnail on first message */}
                  {idx === 0 && selected.product_name && (
                    <img
                      src={getProductImage(selected.product_image)}
                      alt={selected.product_name}
                      className="chat-message-product"
                    />
                  )}
                  <p>{msg.message_text}</p>
                  <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
