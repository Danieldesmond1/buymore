import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./styles/Payments.css";

const API_BASE_URL = "http://localhost:5000";

export default function Payments() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState({
    total_earnings: 0,
    pending_balance: 0,
    available_balance: 0,
  });

  useEffect(() => {
    if (!user?.shop?.id) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/seller/${user.shop.id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        const fetchedOrders = data.orders || [];
        setOrders(fetchedOrders);

        // 💰 Compute balances
        let totalEarnings = 0;
        let pendingBalance = 0;
        let availableBalance = 0;

        fetchedOrders.forEach((order) => {
          const amount = Number(order.total_price) || 0;

          totalEarnings += amount;

          if (order.status === "completed") {
            availableBalance += amount;
          } else if (order.status === "pending") {
            pendingBalance += amount;
          }
        });

        setBalance({
          total_earnings: totalEarnings,
          pending_balance: pendingBalance,
          available_balance: availableBalance,
        });
      } catch (error) {
        console.error("❌ Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  if (loading) return <p>Loading payment details...</p>;

  return (
    <div className="payments-container">
      <h2 className="payments-title">Payments & Earnings</h2>
      <p className="payments-subtitle">
        Track your earnings, withdrawals, and manage payout settings.
      </p>

      {/* 💰 Balance Overview */}
      <div className="balance-cards">
        <div className="balance-card">
          <h3>Total Earnings</h3>
          <p className="amount">${balance.total_earnings.toLocaleString()}</p>
          <span className="desc">All-time sales revenue</span>
        </div>

        <div className="balance-card">
          <h3>Pending Balance</h3>
          <p className="amount">${balance.pending_balance.toLocaleString()}</p>
          <span className="desc">Funds on hold (not yet available)</span>
        </div>

        <div className="balance-card">
          <h3>Available Balance</h3>
          <p className="amount">${balance.available_balance.toLocaleString()}</p>
          <span className="desc">Ready for payout</span>
          <button className="withdraw-btn">Request Withdrawal</button>
        </div>
      </div>

      {/* 📊 Transaction History */}
      <div className="transactions-section">
        <h3 className="section-title">Transaction History</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payout</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5">No transactions yet</td>
              </tr>
            ) : (
              orders.slice(0, 10).map((order, index) => (
                <tr key={order.id || index}>
                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>#{order.id || `ORD${index + 1}`}</td>
                  <td>${Number(order.total_price || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status ${order.status?.toLowerCase()}`}>
                      {order.status || "Unknown"}
                    </span>
                  </td>
                  <td>
                    {order.status === "completed" ? (
                      <span className="payout paid">Paid</span>
                    ) : order.status === "pending" ? (
                      <span className="payout pending">Pending</span>
                    ) : (
                      <span className="payout none">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ⚙️ Payout Settings */}
      <div className="payout-settings">
        <h3 className="section-title">Payout Settings</h3>

        <div className="payout-method">
          <p>
            <strong>Bank Account:</strong> GTBank •••• 4321
          </p>
          <button className="edit-btn">Edit</button>
        </div>

        <div className="payout-method">
          <p>
            <strong>Crypto Wallet:</strong> 0x8f...a92E
          </p>
          <button className="edit-btn">Edit</button>
        </div>
      </div>
    </div>
  );
}
