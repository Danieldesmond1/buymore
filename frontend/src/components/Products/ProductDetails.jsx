import { FaPalette, FaBoxOpen, FaWarehouse, FaCertificate, FaTruck } from "react-icons/fa";
import "./Styles/ProductDetails.css";

const ProductDetails = () => {
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
            <span className="detail-label"><FaPalette className="icon" /> Color:</span>
            <span className="detail-value">{color}</span>
          </div>
         <div className="detail-row">
            <span className="detail-label"><FaBoxOpen className="icon" /> Size:</span>
            <span className="detail-value">{size}</span>
          </div>
          <div className="detail-row stock">
            <span className="detail-label">Stock:</span>
            <span className={`stock-status ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {stock > 0 ? `${stock} units available` : 'Out of stock'}
            </span>
          </div>

          {isNew && <div className="new-badge">New</div>}
        </div>
        <div className="more-details">
          <p>Warranty: 1 Year</p>
          <p>Free Shipping</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
