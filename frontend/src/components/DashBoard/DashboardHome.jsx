import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Styles/DashboardHome.css";

const DashboardHome = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setUsername(res.data.username);
        setUserId(res.data.id); // Get user ID to fetch orders
      } catch (error) {
        console.error("Failed to fetch user:", error);
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
        setOrdersCount(res.data.orders.length);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/wishlist/user/${userId}`
        );
        setWishlistCount(res.data.wishlist.length);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  return (
    <div className="dashboard-home">
      <h2>Welcome back, {username ? username : "Buyer"} 👋</h2>

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
          <p>1 new message from a seller.</p>
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
