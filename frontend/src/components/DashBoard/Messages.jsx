// Messages.jsx
import React, { useState } from "react";
import "./Styles/Messages.css";

const dummyConversations = [
  {
    id: 1,
    sellerName: "GadgetHub NG",
    lastMessage: "Your order has been shipped.",
    date: "2025-07-16",
    messages: [
      { from: "seller", text: "Thanks for your order!", time: "10:00 AM" },
      { from: "buyer", text: "When will it be delivered?", time: "10:02 AM" },
      { from: "seller", text: "It has been shipped today.", time: "10:05 AM" },
    ],
  },
  {
    id: 2,
    sellerName: "StyleWave",
    lastMessage: "Sure, we can restock it.",
    date: "2025-07-15",
    messages: [
      { from: "buyer", text: "Will you restock size M?", time: "9:00 AM" },
      { from: "seller", text: "Sure, we can restock it.", time: "9:03 AM" },
    ],
  },
];

const Messages = () => {
  const [selected, setSelected] = useState(dummyConversations[0]);

  return (
    <div className="messages-container">
      {/* Left side - conversation list */}
      <div className="conversations-list">
        <h3>Chats</h3>
        {dummyConversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item ${selected.id === conv.id ? "active" : ""}`}
            onClick={() => setSelected(conv)}
          >
            <h4>{conv.sellerName}</h4>
            <p>{conv.lastMessage}</p>
            <span>{conv.date}</span>
          </div>
        ))}
      </div>

      {/* Right side - messages */}
      <div className="chat-window">
        <div className="chat-header">
          <h4>{selected.sellerName}</h4>
          <span>{selected.date}</span>
        </div>
        <div className="chat-body">
          {selected.messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.from}`}>
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
