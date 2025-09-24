import { useState } from "react";
import "./styles/StoreSettings.css";

const StoreSettings = () => {
  const [form, setForm] = useState({
    storeName: "My Awesome Store",
    storeBio: "We sell high-quality products at affordable prices.",
    contactEmail: "store@email.com",
    contactPhone: "+234 800 000 0000",
    businessType: "Individual",
    taxId: "",
    address: "Owerri, Imo State, Nigeria",
    bankName: "GTBank",
    accountNumber: "1234567890",
    accountHolder: "John Doe",
    shippingRegions: "Nationwide",
    handlingTime: "1-3 days",
    freeShippingThreshold: "50000",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Store settings saved (UI only for now).");
  };

  return (
    <div className="store-settings-container">
      <h2 className="settings-title">Store Settings</h2>
      <p className="settings-subtitle">
        Manage your store information, payment details, and shipping preferences.
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Store Info */}
        <div className="settings-section">
          <h3>Store Information</h3>
          <div className="form-group">
            <label>Store Logo</label>
            <input type="file" />
          </div>
          <div className="form-group">
            <label>Store Banner</label>
            <input type="file" />
          </div>
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Store Bio</label>
            <textarea
              name="storeBio"
              value={form.storeBio}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="settings-section">
          <h3>Business Details</h3>
          <div className="form-group">
            <label>Business Type</label>
            <select
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
            >
              <option>Individual</option>
              <option>Company</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tax ID (optional)</label>
            <input
              type="text"
              name="taxId"
              value={form.taxId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="2"
            ></textarea>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="settings-section">
          <h3>Payout Settings</h3>
          <div className="form-group">
            <label>Bank Name</label>
            <select
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
            >
              <option>GTBank</option>
              <option>Access Bank</option>
              <option>Zenith Bank</option>
              <option>UBA</option>
              <option>First Bank</option>
            </select>
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Account Holder Name</label>
            <input
              type="text"
              name="accountHolder"
              value={form.accountHolder}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="settings-section">
          <h3>Shipping & Fulfillment</h3>
          <div className="form-group">
            <label>Shipping Regions</label>
            <input
              type="text"
              name="shippingRegions"
              value={form.shippingRegions}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Handling Time</label>
            <input
              type="text"
              name="handlingTime"
              value={form.handlingTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Free Shipping Threshold (₦)</label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={form.freeShippingThreshold}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default StoreSettings;
