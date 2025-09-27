import { IoStarSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./styles/TopSellerCard.css";

const TopSellerCard = ({ seller }) => {
  return (
    <div className="top-seller-card">
      {/* Banner */}
      <Link to={`/sellers/${seller.id}`} className="card-banner">
        {/* ✅ Banner comes directly from DB */}
        <img 
          src={`http://localhost:5000/uploads/${seller.banner}`} 
          alt={seller.name} 
          className="banner-img" 
        />

        {/* Overlay on hover */}
        <div className="banner-overlay">
          <span className="overlay-text">View Store</span>
        </div>

        {/* Logo */}
        <div className="card-logo">
          <img 
            src={`http://localhost:5000/uploads/${seller.logo}`} 
            alt={seller.name} 
          />
        </div>

        {/* Badge */}
        {seller.badge && <span className="seller-badge">{seller.badge}</span>}
      </Link>

      {/* Content */}
      <div className="card-content">
        <h3 className="seller-name">{seller.name}</h3>
        <p className="seller-location">{seller.location}</p>

        {/* Stats */}
        <div className="seller-stats">
          <div className="rating">
            <IoStarSharp size={18} className="star-icon" />
            <span>{seller.rating}</span>
          </div>
          <p className="sales">{seller.sales.toLocaleString()} sales</p>
        </div>

        {/* Visit Store Button */}
        <Link to={`/sellers/${seller.id}`}>
          <button className="visit-btn">Visit Store</button>
        </Link>
      </div>
    </div>
  );
};

export default TopSellerCard;
