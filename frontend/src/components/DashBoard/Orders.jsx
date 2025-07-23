import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}`
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="orders-wrapper">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-left">
              <img
                src="https://via.placeholder.com/60"
                alt="Product"
                className="order-img"
              />
              <div className="order-info">
                <p>Order ID: {order.id}</p>
                <p className="shop">Shop ID: {order.shop_id || "Unknown"}</p>
                <p className="date">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="order-right">
              <p>Qty: {order.quantity || 1}</p>
              <p>${order.total_price}</p>
              <p className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </p>
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
