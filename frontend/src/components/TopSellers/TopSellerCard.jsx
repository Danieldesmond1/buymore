import { IoStarSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./styles/TopSellerCard.css";

const TopSellerCard = ({ seller }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const formatImage = (path) => {
    if (!path) return "/fallback.jpg";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path.replace(/^\/+/, "")}`;

  };

  return (
    <div className="top-seller-card">
      <Link to={`/sellers/${seller.id}`} className="card-banner">
        {/* Banner */}
        <img 
          src={formatImage(seller.banner)} 
          alt={seller.name} 
          className="banner-img" 
        />

        <div className="banner-overlay">
          <span className="overlay-text">View Store</span>
        </div>

        {/* Logo */}
        <div className="card-logo">
          <img 
            src={formatImage(seller.logo)} 
            alt={seller.name} 
          />
        </div>

        {seller.badge && <span className="seller-badge">{seller.badge}</span>}
      </Link>

      <div className="card-content">
        <h3 className="seller-name">{seller.name}</h3>
        <p className="seller-location">{seller.location}</p>

        <div className="seller-stats">
          <div className="rating">
            <IoStarSharp size={18} className="star-icon" />
            <span>{seller.rating}</span>
          </div>
          <p className="sales">{(seller.sales || 0).toLocaleString()} sales</p>
        </div>

        <Link to={`/sellers/${seller.id}`}>
          <button className="visit-btn">Visit Store</button>
        </Link>
      </div>
    </div>
  );
};

export default TopSellerCard;
