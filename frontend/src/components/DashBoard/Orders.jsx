import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // ✅ get user from context
import "./Styles/Orders.css";

const Orders = () => {
  const { user } = useAuth(); // ✅ get logged-in user
  const [orders, setOrders] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`${API_BASE}/api/orders/user/${user.id}`, {
          withCredentials: true,
        });
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [user?.id, API_BASE]);

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
                src={order.product_image || "https://via.placeholder.com/60"}
                alt={order.product_name || "Product"}
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
              <p>${Number(order.total_price ?? 0).toFixed(2)}</p>
              <p className={`order-status ${order.status?.toLowerCase()}`}>
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
