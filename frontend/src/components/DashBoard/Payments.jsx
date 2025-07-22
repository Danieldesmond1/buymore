// Payments.jsx
import React from "react";
import "./Styles/Payments.css";

const dummyPayments = [
  {
    id: "ORD-44329",
    date: "2025-07-13",
    amount: "₦42,000",
    status: "Paid",
    method: "Card",
  },
  {
    id: "ORD-44318",
    date: "2025-06-29",
    amount: "₦18,500",
    status: "Refunded",
    method: "Bank Transfer",
  },
  {
    id: "ORD-44278",
    date: "2025-06-15",
    amount: "₦35,200",
    status: "Failed",
    method: "Crypto",
  },
];

const Payments = () => {
  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>Payments History</h2>
        <p className="subtext">View your previous transactions and payment status</p>
      </div>

      <div className="payments-table">
        <div className="payments-row header">
          <span>Order ID</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Method</span>
          <span>Action</span>
        </div>

        {dummyPayments.map((payment) => (
          <div className="payments-row" key={payment.id}>
            <span>{payment.id}</span>
            <span>{payment.date}</span>
            <span>{payment.amount}</span>
            <span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span>
            <span>{payment.method}</span>
            <span>
              <button className="receipt-btn">Download</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;
