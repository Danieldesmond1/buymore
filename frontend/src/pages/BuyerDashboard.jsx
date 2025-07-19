// BuyerDashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/DashBoard/Sidebar";
import Topbar from "../components/DashBoard/Topbar";

const BuyerDashboard = () => {
  return (
    <div className="dashboard-wrapper" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: "1.5rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;