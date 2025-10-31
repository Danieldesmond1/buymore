// Topbar.jsx
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import "./Styles/Topbar.css";

const Topbar = ({ username = "Buyer", toggleSidebar }) => {
  return (
    <header className="buyer-topbar">
      <div className="topbar-left">
        {/* ✅ Mobile Menu Button */}
        <FaBars className="mobile-menu-icon" onClick={toggleSidebar} />

        <h2>Welcome back, {username} 👋</h2>
      </div>

      <div className="topbar-right">
        <FaBell className="topbar-icon" />
        <FaUserCircle className="topbar-icon" />
        <button className="Topbar-logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default Topbar;
