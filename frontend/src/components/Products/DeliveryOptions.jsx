import { useState } from "react";
import {
  FaTruck,
  FaStore,
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaWarehouse,
  FaUndo,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import "./Styles/DeliveryOptions.css";

const DeliveryOptions = () => {
  const [showFAQ, setShowFAQ] = useState(false);

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
            Delivered between <strong>{formatDate(expressFrom)}</strong> –{" "}
            <strong>{formatDate(expressTo)}</strong> (₦2,000 - ₦3,000)
          </p>
          <p className="sub-info">
            <FaClock className="mini-icon" /> Orders placed before 4PM ship same day
          </p>
        </div>
      </div>

      <div className="option">
        <FaStore className="icon" />
        <div>
          <h4>Pick-up Station</h4>
          <p>
            Ready between <strong>{formatDate(pickupFrom)}</strong> –{" "}
            <strong>{formatDate(pickupTo)}</strong> at your preferred station
          </p>
          <p className="sub-info">
            <FaMapMarkerAlt className="mini-icon" /> Choose from 500+ stations nationwide
          </p>
        </div>
      </div>

      <div className="option">
        <FaGlobeAmericas className="icon" />
        <div>
          <h4>Nationwide Delivery</h4>
          <p>We deliver to all 36 states across Nigeria</p>
          <p className="sub-info">
            <FaCheckCircle className="mini-icon" /> Trusted logistics partners & coverage
          </p>
        </div>
      </div>

      <div className="option">
        <FaWarehouse className="icon" />
        <div>
          <h4>Fulfilled by BuyMore</h4>
          <p>Backed by our secure warehouse & delivery infrastructure</p>
          <p className="sub-info">
            <FaCheckCircle className="mini-icon" /> Verified sellers & 24/7 monitoring
          </p>
        </div>
      </div>

      <div className="option">
        <FaUndo className="icon" />
        <div>
          <h4>Easy Return</h4>
          <p>Return items within 7 days of delivery</p>
          <p className="sub-info">
            <FaCheckCircle className="mini-icon" /> Free returns for eligible items
          </p>
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
          <p>🌍 Nationwide delivery to all 36 states.</p>
          <p>🚚 Tracking number provided after dispatch.</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptions;
