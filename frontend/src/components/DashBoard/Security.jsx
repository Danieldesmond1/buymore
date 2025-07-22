// Security.jsx
import { useState } from "react";
import "./Styles/Security.css";

const Security = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Perform validation and backend call
    alert("Password change submitted!");
  };

  const handleLogoutAll = () => {
    alert("Logged out from all devices.");
  };

  return (
    <div className="security-container">
      <h2>Security Settings</h2>
      <p className="subtext">Manage your account security and privacy</p>

      <form className="password-section" onSubmit={handlePasswordChange}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>

      <div className="twofa-section">
        <h3>Two-Factor Authentication</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />
          <span className="slider round"></span>
        </label>
        <p className="tip">
          {twoFactor
            ? "2FA is enabled for your account."
            : "Enable 2FA to add extra protection to your account."}
        </p>
      </div>

      <div className="activity-section">
        <h3>Recent Login Activity</h3>
        <ul>
          <li>
            <span>📱 iPhone - Lagos, NG</span>
            <span>July 17, 2025 • 11:05am</span>
          </li>
          <li>
            <span>💻 Chrome - Abuja, NG</span>
            <span>July 16, 2025 • 8:44pm</span>
          </li>
        </ul>
        <button onClick={handleLogoutAll} className="logout-all-btn">
          Logout from All Devices
        </button>
      </div>
    </div>
  );
};

export default Security;
