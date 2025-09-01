import "./styles/Payments.css";

const Payments = () => {
  return (
    <div className="payments-container">
      <h2 className="payments-title">Payments & Earnings</h2>
      <p className="payments-subtitle">
        Track your earnings, withdrawals, and manage payout settings.
      </p>

      {/* Balance Overview */}
      <div className="balance-cards">
        <div className="balance-card">
          <h3>Total Earnings</h3>
          <p className="amount">$12,540.00</p>
          <span className="desc">All-time sales revenue</span>
        </div>
        <div className="balance-card">
          <h3>Pending Balance</h3>
          <p className="amount">$3,200.00</p>
          <span className="desc">Funds on hold (not yet available)</span>
        </div>
        <div className="balance-card">
          <h3>Available Balance</h3>
          <p className="amount">$1,850.00</p>
          <span className="desc">Ready for payout</span>
          <button className="withdraw-btn">Request Withdrawal</button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-section">
        <h3>Transaction History</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Payout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aug 28, 2025</td>
              <td>#ORD-1023</td>
              <td>$150.00</td>
              <td>$5.00</td>
              <td className="status success">Completed</td>
              <td>Paid</td>
            </tr>
            <tr>
              <td>Aug 27, 2025</td>
              <td>#ORD-1022</td>
              <td>$200.00</td>
              <td>$8.00</td>
              <td className="status pending">Pending</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Aug 25, 2025</td>
              <td>#ORD-1018</td>
              <td>$75.00</td>
              <td>$3.00</td>
              <td className="status failed">Failed</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payout Settings */}
      <div className="payout-settings">
        <h3>Payout Settings</h3>

        <div className="payout-method">
          <p><strong>Bank Account:</strong> GTBank •••• 4321</p>
          <button className="edit-btn">Edit</button>
        </div>

        <div className="payout-method">
          <p><strong>PayPal:</strong> seller@example.com</p>
          <button className="edit-btn">Edit</button>
        </div>

        <div className="payout-method">
          <p><strong>Mobile Money:</strong> MTN •••• 9987</p>
          <button className="edit-btn">Edit</button>
        </div>

        <div className="payout-method">
          <p><strong>Crypto Wallet:</strong> 0x8f...a92E</p>
          <button className="edit-btn">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
