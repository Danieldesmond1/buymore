import { useState } from "react";
import "./styles/Marketing.css";

const Marketing = () => {
  const [form, setForm] = useState({
    announcement: "",
    discountCode: "",
    discountValue: "",
    campaignName: "",
    campaignBudget: "",
    campaignPlatform: "Email",
    campaignStatus: "Draft",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Marketing campaign saved (UI only for now).");
  };

  return (
    <div className="marketing-container">
      <h2 className="marketing-title">Marketing Center</h2>
      <p className="marketing-subtitle">
        Create announcements, offer discounts, and launch campaigns to reach more customers.
      </p>

      <form onSubmit={handleSubmit} className="marketing-form">
        {/* Announcements */}
        <div className="marketing-section">
          <h3>Store Announcement</h3>
          <textarea
            name="announcement"
            placeholder="Write a short announcement for your store..."
            value={form.announcement}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        {/* Discount Code */}
        <div className="marketing-section">
          <h3>Discount / Promo Code</h3>
          <div className="form-group">
            <label>Code</label>
            <input
              type="text"
              name="discountCode"
              placeholder="e.g. SUMMER24"
              value={form.discountCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              name="discountValue"
              placeholder="e.g. 10"
              value={form.discountValue}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Campaign Setup */}
        <div className="marketing-section">
          <h3>Marketing Campaign</h3>
          <div className="form-group">
            <label>Campaign Name</label>
            <input
              type="text"
              name="campaignName"
              placeholder="e.g. Black Friday Sale"
              value={form.campaignName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Budget (₦)</label>
            <input
              type="number"
              name="campaignBudget"
              placeholder="e.g. 50000"
              value={form.campaignBudget}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Platform</label>
            <select
              name="campaignPlatform"
              value={form.campaignPlatform}
              onChange={handleChange}
            >
              <option>Email</option>
              <option>SMS</option>
              <option>Social Media</option>
              <option>Push Notifications</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="campaignStatus"
              value={form.campaignStatus}
              onChange={handleChange}
            >
              <option>Draft</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <button type="submit" className="launch-btn">
          Save & Launch Campaign
        </button>
      </form>
    </div>
  );
};

export default Marketing;
