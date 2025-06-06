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
  FaTag,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaIndustry,
  FaListAlt,
} from "react-icons/fa";
import "./Styles/ProductDetails.css";

const ProductDetailsInfo = ({ product }) => {
  const [showMore, setShowMore] = useState(false);

  const {
    name,
    description,
    price,
    discount_price,
    stock,
    category,
    brand,
    rating,
    color,
    size,
    isNew,
  } = product;

  // ⭐ Generate star icons based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star-icon filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-icon half" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star-icon empty" />);
    }

    return stars;
  };

  const renderRating = () => {
    if (typeof rating === "number" && rating >= 0) {
      return (
        <span className="detail-value rating-stars">
          {renderStars(rating)}
          <span className="rating-score">{rating.toFixed(1)} / 5</span>
        </span>
      );
    } else {
      // Show 5 empty stars with "Not rated"
      return (
        <span className="detail-value rating-stars">
          {[...Array(5)].map((_, i) => (
            <FaRegStar key={i} className="star-icon empty" />
          ))}
          <span className="rating-score">Not rated</span>
        </span>
      );
    }
  };


  return (
    <div className="product-details-container">
      <div className="details-card">
        <h2 className="details-title">{name || "Product Details"}</h2>

        <p className="product-description">{description}</p>

        <div className="details-wrapper">
          <div className="detail-row">
            <span className="detail-label">
              <FaTag className="icon" /> Price:
            </span>
            <span className="detail-value">
              {discount_price ? (
                <>
                  <span className="discount-price">
                    ${Number(discount_price).toFixed(2)}
                  </span>{" "}
                  <span className="original-price">
                    ${Number(price).toFixed(2)}
                  </span>
                </>
              ) : (
                <>${Number(price).toFixed(2)}</>
              )}
            </span>
          </div>

          {color && (
            <div className="detail-row">
              <span className="detail-label">
                <FaPalette className="icon" /> Color:
              </span>
              <span className="detail-value">{color}</span>
            </div>
          )}

          {size && (
            <div className="detail-row">
              <span className="detail-label">
                <FaBoxOpen className="icon" /> Size:
              </span>
              <span className="detail-value">{size}</span>
            </div>
          )}

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

          {category && (
            <div className="detail-row">
              <span className="detail-label">
                <FaListAlt className="icon" /> Category:
              </span>
              <span className="detail-value">{category}</span>
            </div>
          )}

          {brand && (
            <div className="detail-row">
              <span className="detail-label">
                <FaIndustry className="icon" /> Brand:
              </span>
              <span className="detail-value">{brand}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">
              <FaStar className="icon" /> Rating:
            </span>
            {renderRating()}
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

        <button onClick={() => setShowMore(!showMore)} className="toggle-btn">
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

export default ProductDetailsInfo;
