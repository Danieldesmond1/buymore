import { Link } from "react-router-dom";
import "./Styles/DashboardHome.css";

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <h2>Hello 👋, welcome to your dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Orders</h3>
          <p>You have 2 orders in progress.</p>
          <Link to="/dashboard/orders">View Orders</Link>
        </div>

        <div className="dashboard-card">
          <h3>Wishlist</h3>
          <p>5 items saved for later.</p>
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
