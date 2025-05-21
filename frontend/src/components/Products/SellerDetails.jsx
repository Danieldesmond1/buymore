import { FaStar, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import "./Styles/SellerDetails.css";

const SellerDetails = () => {
  const seller = {
    name: "iPhone Nigeria Ltd.",
    ratings: 4.5,
    totalOrders: 2080,
    location: "Lagos, Nigeria",
  };

  return (
    <div className="seller-details">
      <h2 className="seller-title">Seller Information</h2>
      <p><strong>Name:</strong> {seller.name}</p>
      <p>
        <FaStar className="icon star" />
        <strong>Rating:</strong> {seller.ratings} / 5
      </p>
      <p>
        <FaBox className="icon box" />
        <strong>Total Orders:</strong> {seller.totalOrders.toLocaleString()}
      </p>
      <p>
        <FaMapMarkerAlt className="icon location" />
        <strong>Location:</strong> {seller.location}
      </p>
    </div>
  );
};

export default SellerDetails;
