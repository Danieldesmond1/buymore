import { Link } from "react-router-dom";
import "./Styles/StoreCard.css";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const StoreCard = ({ shop }) => {
  const {
    id,
    shop_name,
    owner_name,
    description,
    category,
    location,
    rating,
    logo_url,
    banner_url,
    topProducts = [],
  } = shop;

  return (
    <div className="store-card">
      {/* Banner */}
      {banner_url && (
        <img src={`${API_BASE}/images/${banner_url}`} alt={`${shop_name} banner`} className="store-banner" />
      )}

      {/* Logo and Basic Info */}
      <div className="store-card-header">
        {logo_url && (
          <img
            src={`${API_BASE}/images/${logo_url}`}
            alt={`${shop_name} logo`}
            className="store-logo"
          />
        )}
        <div className="store-info">
          <h3 className="store-name">{shop_name}</h3>
          {owner_name && <p className="store-owner">Owned by {owner_name}</p>}
          {category && <p className="store-category">Category: {category}</p>}
          {location && <p className="store-location">📍 {location}</p>}
        </div>
      </div>

      {/* Description */}
      {description && <p className="store-description">{description}</p>}

      {/* Footer */}
      <div className="store-footer">
        {rating && (
          <div className="store-rating">
            ⭐ {parseFloat(rating).toFixed(1)} / 5
          </div>
        )}
        <Link to={`/shop/${shop.shop_id}`} className="store-link">
          Visit Store
        </Link>

      </div>
    </div>
  );
};

export default StoreCard;
