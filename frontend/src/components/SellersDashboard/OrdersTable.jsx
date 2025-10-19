import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // <- use auth context
import "./styles/OrdersTable.css";

const OrdersTable = () => {
  const { user } = useAuth(); // get current user from context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // safe seller id
      const sellerId = user?.role === "seller" ? user?.shop?.id : null;
      if (!sellerId) {
        setOrders([]);
        return;
      }

      const res = await axios.get(`/api/orders/seller/${sellerId}`, {
        withCredentials: true,
      });

      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // only run when user is available (and will re-run if user changes)
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const buyerName = (order.buyer_name || order.buyer_name === 0) ? String(order.buyer_name) : "";
    const status = order.status ? String(order.status) : "";

    const matchesSearch = buyerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <h2>Orders</h2>
        <div className="orders-actions">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-wrapper">
        {loading ? (
          <p style={{ padding: 16 }}>Loading orders...</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    You haven’t received any orders yet.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.buyer_name}</td>
                    <td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{typeof order.total_price === "number" ? `₦${order.total_price.toLocaleString()}` : `₦${order.total_price}`}</td>
                    <td>
                      <span className={`status ${String(order.status || "").toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-view">View</button>
                      <button className="btn-update">Update</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
