import { useEffect, useState } from "react";
import axios from "axios";
import "./Styles/AddressesBook.css";

const Addresses = () => {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [originalAddress, setOriginalAddress] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Use same API_BASE logic as Messages.jsx & Profile.jsx
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const user = res.data.user;

        const fetched = {
          name: user.username || "",
          phone: user.phone || "",
          location: user.location || "",
        };

        setAddress(fetched);
        setOriginalAddress(fetched);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setLoading(false);
      }
    };

    fetchAddress();
  }, [API_BASE]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setAddress(originalAddress);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE}/api/profile`,
        {
          username: address.name,
          phone: address.phone,
          location: address.location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOriginalAddress(address);
      setEditing(false);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update address:", err);
    }
  };

  if (loading) return <p className="loading">Loading your address...</p>;

  return (
    <div className="address-container">
      <h2>Shipping Address</h2>

      <div className="address-card">
        {showSuccess && <div className="success-toast">✔ Address Updated</div>}

        {!editing ? (
          <div className="address-info">
            <p><strong>Name:</strong> {address.name}</p>
            <p><strong>Phone:</strong> {address.phone || "Not provided"}</p>
            <p><strong>Location:</strong> {address.location || "No address saved"}</p>
            <button onClick={handleEdit} className="edit-btn">Edit Address</button>
          </div>
        ) : (
          <div className="address-form">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={address.name}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <label>Location</label>
            <textarea
              name="location"
              value={address.location}
              onChange={handleChange}
              placeholder="Enter your full delivery address"
            ></textarea>

            <div className="actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
