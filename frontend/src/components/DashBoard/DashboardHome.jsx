import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Styles/DashboardHome.css";

const DashboardHome = () => {
  const { user } = useAuth(); // ✅ Get user from context
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`${API_BASE}/api/orders/user/${user.id}`, {
          withCredentials: true,
        });
        setOrdersCount(Array.isArray(res.data.orders) ? res.data.orders.length : 0);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, [user?.id, API_BASE]);

  // Fetch user wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`${API_BASE}/api/wishlist/user/${user.id}`, {
          withCredentials: true,
        });
        setWishlistCount(Array.isArray(res.data.wishlist) ? res.data.wishlist.length : 0);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, [user?.id, API_BASE]);

  return (
    <div className="dashboard-home">
      <h2>Welcome back, {user?.username || "Buyer"} 👋</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Orders</h3>
          <p>
            {ordersCount > 0
              ? `You have ${ordersCount} order${ordersCount > 1 ? "s" : ""} in progress.`
              : "You haven’t placed any orders yet."}
          </p>
          <Link to="/dashboard/orders">View Orders</Link>
        </div>

        <div className="dashboard-card">
          <h3>Wishlist</h3>
          <p>
            {wishlistCount > 0
              ? `${wishlistCount} item${wishlistCount > 1 ? "s" : ""} saved for later.`
              : "No items in your wishlist yet."}
          </p>
          <Link to="/dashboard/wishlist">View Wishlist</Link>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>Check your latest messages from sellers.</p>
          <Link to="/dashboard/messages">Go to Inbox</Link>
        </div>

        <div className="dashboard-card">
          <h3>Need Help?</h3>
          <p>Check your disputes or message support.</p>
          <Link to="/dashboard/disputes">Dispute Center</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
