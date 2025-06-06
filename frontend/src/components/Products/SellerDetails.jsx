import {
  FaStar,
  FaMapMarkerAlt,
  FaBox,
  FaCheckCircle,
  FaBriefcase,
  FaClock,
  FaUndo,
  FaTruck,
  FaUserFriends,
} from "react-icons/fa";
import "./Styles/SellerDetails.css";

const SellerDetails = () => {
  const seller = {
    name: "iPhone Nigeria Ltd.",
    ratings: 4.5,
    totalOrders: 2080,
    location: "Lagos, Nigeria",
    verified: true,
    yearsInBusiness: 5,
    businessType: "Authorized Retailer",
    responseRate: "92%",
    responseTime: "Within 2 hours",
    returnPolicy: "7-day return",
    shippingGuarantee: "Ships within 24 hours",
    trustedBy: 10244,
    about:
      "iPhone Nigeria Ltd. is a trusted smartphone and electronics seller with over 5 years in the industry. We offer authentic Apple products and top-tier customer service across Nigeria and beyond.",
  };

  return (
    <div className="seller-details">
      <h2 className="seller-title">Seller Information</h2>
      <div className="seller-header">
        <p className="seller-name">
          <strong>{seller.name}</strong>{" "}
          {seller.verified && (
            <FaCheckCircle className="verified-icon" title="Verified Seller" />
          )}
        </p>
        <p className="seller-rating">
          <FaStar className="icon star" />
          <strong>Rating:</strong> {seller.ratings} / 5
        </p>
        <p className="seller-orders">
          <FaBox className="icon box" />
          <strong>Orders Fulfilled:</strong> {seller.totalOrders.toLocaleString()}
        </p>
        <p className="seller-location">
          <FaMapMarkerAlt className="icon location" />
          <strong>Location:</strong> {seller.location}
        </p>
      </div>

      <div className="seller-meta">
        <p>
          <FaBriefcase className="icon" />
          <strong>Business Type:</strong> {seller.businessType}
        </p>
        <p>
          <FaClock className="icon" />
          <strong>In Business:</strong> {seller.yearsInBusiness} years
        </p>
        <p>
          <FaClock className="icon" />
          <strong>Response Time:</strong> {seller.responseTime}
        </p>
        <p>
          <FaUserFriends className="icon" />
          <strong>Trusted by:</strong> {seller.trustedBy.toLocaleString()}+ customers
        </p>
        <p>
          <FaUndo className="icon" />
          <strong>Return Policy:</strong> {seller.returnPolicy}
        </p>
        <p>
          <FaTruck className="icon" />
          <strong>Shipping:</strong> {seller.shippingGuarantee}
        </p>
      </div>

      <div className="seller-about">
        <h3>About the Seller</h3>
        <p>{seller.about}</p>
      </div>
    </div>
  );
};

export default SellerDetails;
