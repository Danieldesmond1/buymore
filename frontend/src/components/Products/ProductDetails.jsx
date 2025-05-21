import { useState } from "react";
import {
  FaPalette,
  FaBoxOpen,
  FaWarehouse,
  FaCertificate,
  FaTruck,
  FaUndo,
  FaUserShield,
  FaGlobe,
} from "react-icons/fa";
import "./Styles/ProductDetails.css";

const ProductDetails = () => {
  const [showMore, setShowMore] = useState(false);

  const color = "Space Black";
  const stock = 5;
  const size = "256GB";
  const isNew = true;

  return (
    <div className="product-details-container">
      <div className="details-card">
        <h2 className="details-title">Product Details</h2>
        <div className="details-wrapper">
          <div className="detail-row">
            <span className="detail-label">
              <FaPalette className="icon" /> Color:
            </span>
            <span className="detail-value">{color}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">
              <FaBoxOpen className="icon" /> Size:
            </span>
            <span className="detail-value">{size}</span>
          </div>
          <div className="detail-row stock">
            <span className="detail-label">
              <FaWarehouse className="icon" /> Stock:
            </span>
            <span
              className={`stock-status ${
                stock > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {stock > 0 ? `${stock} units available` : "Out of stock"}
              {stock > 0 && (
                <div className="stock-bar">
                  <div
                    className="stock-bar-fill"
                    style={{ width: `${Math.min(stock * 20, 100)}%` }}
                  />
                </div>
              )}
            </span>
          </div>

          {isNew && <div className="new-badge">New</div>}
        </div>

        <div className="more-details">
          <p>
            <FaCertificate className="icon" /> Warranty: 1 Year
          </p>
          <p>
            <FaTruck className="icon" /> Free Shipping
          </p>
        </div>

        <button
          onClick={() => setShowMore(!showMore)}
          className="toggle-btn"
        >
          {showMore ? "Hide Details ▲" : "More Details ▼"}
        </button>

        {showMore && (
          <div className="extra-info">
            <p>
              <FaUndo className="icon" /> Return Policy: 7 Days
            </p>
            <p>
              <FaUserShield className="icon" /> Sold by: Verified Vendor
            </p>
            <p>
              <FaGlobe className="icon" /> Imported
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
