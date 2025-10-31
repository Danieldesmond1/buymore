// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {
  FaHome, FaBoxOpen, FaHeart, FaEnvelope, FaUser, FaMapMarkerAlt,
  FaMoneyCheckAlt, FaShieldAlt, FaGavel
} from "react-icons/fa";

import "./Styles/Sidebar.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Orders", icon: <FaBoxOpen />, path: "/dashboard/orders" },
    { name: "Wishlist", icon: <FaHeart />, path: "/dashboard/wishlist" },
    { name: "Messages", icon: <FaEnvelope />, path: "/dashboard/messages" },
    { name: "Profile", icon: <FaUser />, path: "/dashboard/profile" },
    { name: "Addresses", icon: <FaMapMarkerAlt />, path: "/dashboard/addresses" },
    { name: "Disputes", icon: <FaGavel />, path: "/dashboard/disputes" },
    { name: "Payments", icon: <FaMoneyCheckAlt />, path: "/dashboard/payments" },
    { name: "Security", icon: <FaShieldAlt />, path: "/dashboard/security" },
  ];

  return (
    <aside className={`buyer-sidebar ${isOpen ? "open" : ""}`}>
      {/* ✅ Close button for mobile */}
      <FaTimes className="sidebar-close-icon" onClick={closeSidebar} />

      <h2 className="sidebar-title">My Dashboard</h2>
      <nav>
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
