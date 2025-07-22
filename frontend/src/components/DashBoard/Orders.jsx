import React from "react";
import "./Styles/Orders.css";

const dummyOrders = [
  {
    id: "ORD-548732",
    product: {
      name: "Wireless Bluetooth Headphones",
      image: "https://via.placeholder.com/60",
      shop: "GadgetHub NG",
    },
    status: "Delivered",
    price: "$89.99",
    quantity: 1,
    date: "2025-07-14",
  },
  // Add more orders...
];

const Orders = () => {
  return (
    <div className="orders-wrapper">
      <h2 className="orders-title">My Orders</h2>
      {dummyOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-left">
            <img
              src={order.product.image}
              alt={order.product.name}
              className="order-img"
            />
            <div className="order-info">
              <p>{order.product.name}</p>
              <p className="shop">{order.product.shop}</p>
              <p className="date">{order.date}</p>
            </div>
          </div>
          <div className="order-right">
            <p>Qty: {order.quantity}</p>
            <p>{order.price}</p>
            <p className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </p>
            <button className="view-btn">View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
