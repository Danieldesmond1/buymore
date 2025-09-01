import { useState } from "react";
import Sidebar from "../components/SellersDashboard/Sidebar";
import Topbar from "../components/SellersDashboard/Topbar";
import Overview from "../components/SellersDashboard/Overview";
import ProductsTable from "../components/SellersDashboard/ProductsTable";
import OrdersTable from "../components/SellersDashboard/OrdersTable";
import MessagesPanel from "../components/SellersDashboard/MessagesPanel";
import Payments from "../components/SellersDashboard/Payments";
import "./styles/SellersDashboard.css";

export default function SellersDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "products":
        return <ProductsTable />;
      case "orders":
        return <OrdersTable />;
      case "customers":
        return <MessagesPanel />;
      case "payments":
        return <Payments />;
      default:
        return <div className="p-6">Coming soon...</div>;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="dashboard-main">
        <Topbar />
        <main className="dashboard-content">{renderSection()}</main>
      </div>
    </div>
  );
}
