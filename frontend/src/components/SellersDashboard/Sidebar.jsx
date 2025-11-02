import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { LuPackageOpen, LuBadgeDollarSign } from "react-icons/lu";
import { GiShoppingCart } from "react-icons/gi";
import { RiUserStarLine } from "react-icons/ri";
import { IoSettingsOutline, IoStarOutline, IoMegaphoneOutline, IoHelpCircleOutline, IoClose } from "react-icons/io5";
import "./styles/Sidebar.css";

export default function Sidebar({ setActiveSection, sidebarOpen, setSidebarOpen }) {
  const [active, setActive] = useState("overview");

  const navItems = [
    { name: "Overview", icon: <FaHome size={18} />, section: "overview" },
    { name: "Products", icon: <LuPackageOpen size={18} />, section: "products" },
    { name: "Orders", icon: <GiShoppingCart size={18} />, section: "orders" },
    { name: "Customers", icon: <RiUserStarLine size={18} />, section: "customers" },
    { name: "Payments", icon: <LuBadgeDollarSign size={18} />, section: "payments" },
    { name: "Store Settings", icon: <IoSettingsOutline size={18} />, section: "storeSettings" },
    { name: "Reviews", icon: <IoStarOutline size={18} />, section: "reviews" },
    { name: "Marketing", icon: <IoMegaphoneOutline size={18} />, section: "marketing" },
    { name: "Help", icon: <IoHelpCircleOutline size={18} />, section: "help" },
  ];

  const handleClick = (section) => {
    setActive(section);
    setActiveSection(section);
    setSidebarOpen(false); // ✅ closes sidebar after selecting menu on mobile
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">Seller Dashboard</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item.section)}
            className={`sidebar-item ${active === item.section ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
