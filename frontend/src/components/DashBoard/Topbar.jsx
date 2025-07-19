// Topbar.jsx
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./Styles/Topbar.css";

const Topbar = ({ username = "Buyer" }) => {
  return (
    <header className="buyer-topbar">
      <div className="topbar-left">
        <h2>Welcome back, {username} 👋</h2>
      </div>
      <div className="topbar-right">
        <FaBell className="topbar-icon" title="Notifications" />
        <FaUserCircle className="topbar-icon" title="Account" />
        <button className="Topbar-logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default Topbar;
