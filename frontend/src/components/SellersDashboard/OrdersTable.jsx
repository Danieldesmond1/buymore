import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/OrdersTable.css";

const OrdersTable = ({ sellerId }) => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchOrders = async () => {
    try {
      if (!sellerId) return; // avoid undefined
      const res = await axios.get(`/api/orders/seller/${sellerId}`);
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [sellerId]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.buyer_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
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
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>${order.total_price}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
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
      </div>
    </div>
  );
};

export default OrdersTable;
