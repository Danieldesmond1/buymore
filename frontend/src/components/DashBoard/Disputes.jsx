// Disputes.jsx
import React from "react";
import "./Styles/Disputes.css";

const dummyDisputes = [
  {
    id: "DPT-001122",
    product: "Wireless Bluetooth Headphones",
    seller: "GadgetHub NG",
    reason: "Item not delivered",
    status: "Pending",
    date: "2025-07-15",
  },
  {
    id: "DPT-001123",
    product: "Smart LED Lamp",
    seller: "LightBay NG",
    reason: "Wrong item delivered",
    status: "Resolved",
    date: "2025-06-22",
  },
];

const Disputes = () => {
  return (
    <div className="disputes-wrapper">
      <div className="disputes-header">
        <h2>Dispute Center</h2>
        <p className="subheading">Track and manage your product disputes</p>
      </div>

      <div className="dispute-cards">
        {dummyDisputes.map((d) => (
          <div className="dispute-card" key={d.id}>
            <div className="dispute-left">
              <h3 className="product-name">{d.product}</h3>
              <p><strong>Seller:</strong> {d.seller}</p>
              <p><strong>Reason:</strong> {d.reason}</p>
              <p className="dispute-date">Date Opened: {d.date}</p>
              <span className={`status-badge ${d.status.toLowerCase()}`}>{d.status}</span>
            </div>

            <div className="dispute-actions">
              <p className="dispute-id">Case ID: {d.id}</p>
              <button className="view-case-btn">
                {d.status === "Pending" ? "Continue Resolution" : "View Case"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disputes;
