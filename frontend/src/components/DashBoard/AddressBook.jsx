// Addresses.jsx
import { useState } from "react";
import "./Styles/AddressesBook.css";

const Addresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Ebuka Daniel",
      phone: "+234 801 234 5678",
      location: "No. 14 Freedom Street, Lekki Phase 1, Lagos, Nigeria",
      isDefault: true,
    },
    {
      id: 2,
      name: "Daniel E.",
      phone: "+234 705 678 1234",
      location: "12 Tech City Road, Abuja, Nigeria",
      isDefault: false,
    },
  ]);

  const handleDelete = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updated);
  };

  return (
    <div className="address-container">
      <h2>My Addresses</h2>
      <div className="address-list">
        {addresses.map((address) => (
          <div key={address.id} className="address-card">
            <div className="address-info">
              <p className="name">{address.name}</p>
              <p className="phone">{address.phone}</p>
              <p className="location">{address.location}</p>
              {address.isDefault && <span className="default-badge">Default</span>}
            </div>
            <div className="address-actions">
              <button onClick={() => handleSetDefault(address.id)}>Set as Default</button>
              <button className="delete-btn" onClick={() => handleDelete(address.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button className="add-btn">+ Add New Address</button>
    </div>
  );
};

export default Addresses;
