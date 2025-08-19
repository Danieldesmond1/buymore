import { useState, useEffect } from "react";
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

  // 0. Load logged in user
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

  // 1. Load conversations
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

  // 2. Load messages when selected conversation changes
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

  // 3. Send message
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

  return (
    <div className="messages-container">
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
            <h4>{conv.shop_name}</h4>
            <p>{conv.last_message || "No messages yet"}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selected ? (
          <>
            <div className="chat-header">
              <h4>{selected.shop_name}</h4>
              {selected.product_name && (
                <div className="chat-product">
                  <img
                    src={`http://localhost:5000/uploads/${selected.product_image}`}
                    alt={selected.product_name}
                  />
                  <span>{selected.product_name}</span>
                </div>
              )}
            </div>
            <div className="chat-body">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.sender_id === currentUser?.id ? "me" : "other"
                  }`}
                >
                  <p>{msg.message_text}</p>
                  <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
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
