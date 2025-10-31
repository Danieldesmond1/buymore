// BuyerDashboard.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";   // ✅ import useState
import Sidebar from "../components/DashBoard/Sidebar";
import Topbar from "../components/DashBoard/Topbar";
import "./styles/BuyerDashboard.css";

const BuyerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ move useState inside component

  return (
    <div className="dashboard-wrapper" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div style={{ flex: 1 }}>
        <Topbar toggleSidebar={() => setSidebarOpen(true)} />
        
        <main style={{ padding: "1.5rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;
