import { useState, useEffect } from "react";
import axios from "axios";
import { BsBank } from "react-icons/bs";
import "./styles/StoreSettings.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const StoreSettings = () => {
  const sellerId = localStorage.getItem("sellerId");

  const [banks, setBanks] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    storeName: "",
    storeBio: "",
    contactEmail: "",
    contactPhone: "",
    businessType: "Individual",
    taxId: "",
    address: "",
    bankName: "",
    bankCode: "",
    accountNumber: "",
    accountHolder: "",
    shippingRegions: "",
    handlingTime: "",
    freeShippingThreshold: "",
  });

  // ✅ Fetch list of banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/payment/banks`);
        setBanks(data);
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    };
    fetchBanks();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle bank selection
  const handleBankChange = (e) => {
    const bankCode = e.target.value;
    const bankName = banks.find((b) => b.code === bankCode)?.name || "";
    setForm({ ...form, bankCode, bankName });
    setVerifiedAccount("");
  };

  // Verify bank account
  const verifyAccount = async () => {
    if (!form.accountNumber || !form.bankCode)
      return alert("Enter account number and select bank.");

    setVerifying(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/payment/verify-bank`, {
        account_number: form.accountNumber,
        bank_code: form.bankCode,
      });

      setVerifiedAccount(data.account_name);
      setForm({ ...form, accountHolder: data.account_name });
    } catch (err) {
      console.error("Verification failed:", err);
      alert("❌ Account verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  // Save store settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/shops/update-settings`, {
        seller_id: sellerId,
        ...form,
      });
      alert("✅ Store settings saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save settings.");
    } finally {
      setLoading(false);
    }
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

        {/* Bank Settings */}
        <div className="settings-section">
          <h3>Payout Settings</h3>

          <div className="form-group">
            <label>Bank Name</label>
            <select name="bankCode" value={form.bankCode} onChange={handleBankChange}>
              <option value="">Select Bank</option>
              {banks.map((bank, idx) => (
                <option key={`${bank.code}-${idx}`} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                name="accountNumber"
                maxLength="10"
                value={form.accountNumber}
                onChange={handleChange}
              />
              <button
                type="button"
                className="verify-btn"
                onClick={verifyAccount}
                disabled={verifying}
              >
                {verifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>

          {verifiedAccount && (
            <p className="verified-account">
              <BsBank /> {verifiedAccount}
            </p>
          )}

          <div className="form-group">
            <label>Account Holder</label>
            <input
              type="text"
              name="accountHolder"
              value={form.accountHolder}
              readOnly
            />
          </div>
        </div>

        {/* Shipping */}
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
            <label>Free Shipping Threshold ($)</label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={form.freeShippingThreshold}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default StoreSettings;
