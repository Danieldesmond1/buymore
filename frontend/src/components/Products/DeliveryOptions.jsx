import { useState } from "react";
import { FaTruck  , FaStore, FaGlobeAmericas, FaMapMarkerAlt } from "react-icons/fa";
import "./Styles/DeliveryOptions.css";

const DeliveryOptions = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  // Simulated delivery date ranges
  const today = new Date();
  const expressFrom = new Date(today);
  const expressTo = new Date(today);
  expressFrom.setDate(today.getDate() + 1);
  expressTo.setDate(today.getDate() + 2);

  const pickupFrom = new Date(today);
  const pickupTo = new Date(today);
  pickupFrom.setDate(today.getDate() + 2);
  pickupTo.setDate(today.getDate() + 5);

  const formatDate = (date) =>
    date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
    });

  return (
    <div className="delivery-options">
      <h2 className="delivery-title">Delivery Options</h2>

      <div className="option">
        <FaTruck className="icon" />
        <div>
          <h4>Express Delivery</h4>
          <p>
            Delivered between {formatDate(expressFrom)} – {formatDate(expressTo)} (₦2,000 - ₦3,000)
          </p>
        </div>
      </div>

      <div className="option">
        <FaStore className="icon" />
        <div>
          <h4>Pick-up Station</h4>
          <p>
            Ready between {formatDate(pickupFrom)} – {formatDate(pickupTo)} at your selected location
          </p>
        </div>
      </div>

      <div className="option">
        <FaGlobeAmericas className="icon" />
        <div>
          <h4>Nationwide Delivery</h4>
          <p>We deliver to all 36 states across Nigeria</p>
        </div>
      </div>

      <button className="address-btn">
        <FaMapMarkerAlt className="btn-icon" /> Change Delivery Address
      </button>

      <button className="faq-toggle" onClick={() => setShowFAQ(!showFAQ)}>
        {showFAQ ? "Hide Shipping FAQs ▲" : "Show Shipping FAQs ▼"}
      </button>

      {showFAQ && (
        <div className="faq-section">
          <p>✅ We ship from verified warehouses across Nigeria.</p>
          <p>📦 Orders before 4PM are processed same day.</p>
          <p>🔁 Return available within 7 days after delivery.</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptions;
