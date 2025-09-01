import "./styles/OrdersTable.css";

const OrdersTable = () => {
  const orders = [
    {
      id: "ORD12345",
      customer: "John Doe",
      date: "2025-08-25",
      total: "$250",
      status: "Pending",
    },
    {
      id: "ORD12346",
      customer: "Jane Smith",
      date: "2025-08-26",
      total: "$120",
      status: "Shipped",
    },
    {
      id: "ORD12347",
      customer: "Michael Lee",
      date: "2025-08-28",
      total: "$500",
      status: "Delivered",
    },
    {
      id: "ORD12348",
      customer: "Sarah Johnson",
      date: "2025-08-29",
      total: "$90",
      status: "Cancelled",
    },
  ];

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <h2>Orders</h2>
        <div className="orders-actions">
          <input type="text" placeholder="Search orders..." />
          <select>
            <option>All Status</option>
            <option>Pending</option>
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.total}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
