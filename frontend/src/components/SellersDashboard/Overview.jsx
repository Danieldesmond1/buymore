import StatsCard from "./StatsCard";
import "./styles/Overview.css";

export default function Overview() {
  return (
    <div className="overview-container">
      <h2 className="overview-title">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard title="Today’s Sales" value="$1,200" trend="+8%" type="sales" />
        <StatsCard title="Orders (Today)" value="45" trend="+12%" type="orders" />
        <StatsCard title="Revenue (This Month)" value="$12,340" trend="+5%" type="revenue" />
        <StatsCard title="Pending Orders" value="8" trend="-2%" type="pending" />
      </div>

      {/* Sales & Orders Graph */}
      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">Sales Performance</h3>
          <div className="chart-placeholder">📈 Chart here</div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Orders Overview</h3>
          <div className="chart-placeholder">📊 Chart here</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders">
        <h3 className="section-title">Recent Orders</h3>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#10234</td>
              <td>John Doe</td>
              <td>Sep 1, 2025</td>
              <td><span className="status success">Completed</span></td>
              <td>$250</td>
            </tr>
            <tr>
              <td>#10233</td>
              <td>Jane Smith</td>
              <td>Sep 1, 2025</td>
              <td><span className="status pending">Pending</span></td>
              <td>$180</td>
            </tr>
            <tr>
              <td>#10232</td>
              <td>Michael Lee</td>
              <td>Aug 31, 2025</td>
              <td><span className="status cancelled">Cancelled</span></td>
              <td>$75</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
