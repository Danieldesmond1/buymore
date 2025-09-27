import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StatsCard from "./StatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./styles/Overview.css";

const API_BASE_URL = "http://localhost:5000";

export default function Overview() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [todaySales, setTodaySales] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/user/${user.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        const fetchedOrders = data.orders || [];
        setOrders(fetchedOrders);

        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        let todaySalesSum = 0;
        let todayOrdersCount = 0;
        let monthRevenueSum = 0;
        let pendingCount = 0;

        // 🔥 Group orders by actual date
        const dateMap = {}; // { '2025-09-24': { sales: 2000, orders: 3 } }

        fetchedOrders.forEach((order) => {
          const createdAt = new Date(order.created_at);
          const dateKey = createdAt.toISOString().split("T")[0]; // YYYY-MM-DD

          if (!dateMap[dateKey]) {
            dateMap[dateKey] = { sales: 0, orders: 0 };
          }

          dateMap[dateKey].sales += Number(order.total_price);
          dateMap[dateKey].orders += 1;

          // Calculate daily & monthly stats
          const isToday =
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === thisMonth &&
            createdAt.getFullYear() === thisYear;

          if (isToday) {
            todaySalesSum += Number(order.total_price);
            todayOrdersCount++;
          }

          if (
            createdAt.getMonth() === thisMonth &&
            createdAt.getFullYear() === thisYear
          ) {
            monthRevenueSum += Number(order.total_price);
          }

          if (order.status === "pending") {
            pendingCount++;
          }
        });

        // Convert dateMap → sorted array
        const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));
        const salesArr = sortedDates.map((date) => ({
          date,
          sales: dateMap[date].sales,
        }));
        const ordersArr = sortedDates.map((date) => ({
          date,
          orders: dateMap[date].orders,
        }));

        setSalesData(salesArr);
        setOrdersData(ordersArr);

        setTodaySales(todaySalesSum);
        setTodayOrders(todayOrdersCount);
        setMonthlyRevenue(monthRevenueSum);
        setPendingOrders(pendingCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p>Loading Dashboard...</p>;

  return (
    <div className="overview-container">
      <h2 className="overview-title">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard title="Today’s Sales" value={`₦${todaySales.toLocaleString()}`} trend="+8%" type="sales" />
        <StatsCard title="Orders (Today)" value={todayOrders} trend="+12%" type="orders" />
        <StatsCard title="Revenue (This Month)" value={`₦${monthlyRevenue.toLocaleString()}`} trend="+5%" type="revenue" />
        <StatsCard title="Pending Orders" value={pendingOrders} trend="-2%" type="pending" />
      </div>

      {/* Sales & Orders Graph */}
      <div className="charts-section">
        {/* Sales Performance */}
        <div className="chart-card dark-chart">
          <h3 className="chart-title">Sales Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#111827", border: "none", color: "#fff" }} />
              <Line type="monotone" dataKey="sales" stroke="url(#salesGradient)" strokeWidth={3} dot={false} activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Overview */}
        <div className="chart-card dark-chart">
          <h3 className="chart-title">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ordersData}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#111827", border: "none", color: "#fff" }} />
              <Line type="monotone" dataKey="orders" stroke="url(#ordersGradient)" strokeWidth={3} dot={false} activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders">
        <h3 className="section-title">Recent Orders</h3>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td><span className={`status ${order.status}`}>{order.status}</span></td>
                <td>₦{Number(order.total_price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
