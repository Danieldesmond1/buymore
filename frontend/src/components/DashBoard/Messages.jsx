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

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token) {
      console.warn("No token found. Redirecting to login...");
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.message === "Unauthorized") navigate("/login");
      }
    };
    fetchUser();
  }, [API_BASE, token, navigate]);

  // ✅ Fetch conversations
  useEffect(() => {
    if (!currentUser?.id || !token) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [currentUser?.id, chatId, navigate, API_BASE, token]);

  // ✅ Fetch messages (initial + periodic refresh)
  useEffect(() => {
    if (!selected || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/${selected.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    // Fetch immediately
    fetchMessages();

    // Auto-refresh every 7 seconds
    const interval = setInterval(fetchMessages, 7000);

    // Cleanup on unmount / change
    return () => clearInterval(interval);
  }, [selected, API_BASE, token]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selected || !token) return;
    try {
      const res = await fetch(`${API_BASE}/api/messages/${selected.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Helper to get product image
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
        : `${API_BASE}${parsedImages[0]}`
      : "/fallback.jpg";
  };

  return (
    <div className={`messages-container ${isMobile && selected ? "chat-active" : ""}`}>
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

      <div className="chat-window">
        {selected ? (
          <>
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

            <div className="chat-body">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.sender_id === currentUser?.id ? "buyer" : "seller"}`}
                >
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
