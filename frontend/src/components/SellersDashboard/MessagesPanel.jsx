import { useState } from "react";
import "./styles/MessagesPanel.css";

const sampleConversations = [
  { id: 1, name: "John Doe", preview: "Hi, I need help with my order...", time: "10:24 AM", unread: true },
  { id: 2, name: "Sarah Smith", preview: "When will my package arrive?", time: "Yesterday", unread: false },
  { id: 3, name: "Michael Lee", preview: "Thanks for the quick support!", time: "2 days ago", unread: false },
];

const sampleMessages = [
  { id: 1, sender: "customer", text: "Hello, I have a question about my order." },
  { id: 2, sender: "seller", text: "Sure, could you share your order ID?" },
  { id: 3, sender: "customer", text: "It’s #12345, placed yesterday." },
];

const MessagesPanel = () => {
  const [selectedConversation, setSelectedConversation] = useState(sampleConversations[0]);
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { id: Date.now(), sender: "seller", text: newMessage }]);
    setNewMessage("");
  };

  const filteredConversations = sampleConversations.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unread) ||
      (filter === "resolved" && !conv.unread);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="messages-container">
      {/* Sidebar */}
      <div className="messages-sidebar">
        <h3>Conversations</h3>

        {/* Search + Filter */}
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
          {filteredConversations.map((conv) => (
            <li
              key={conv.id}
              className={`conversation-item ${selectedConversation.id === conv.id ? "active" : ""}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="conv-header">
                <div className="conv-name">{conv.name}</div>
                {conv.unread && <span className="unread-badge">•</span>}
              </div>
              <div className="conv-preview">{conv.preview}</div>
              <div className="conv-time">{conv.time}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-header">
          <h3>{selectedConversation.name}</h3>
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.sender === "seller" ? "sent" : "received"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
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
      </div>
    </div>
  );
};

export default MessagesPanel;
