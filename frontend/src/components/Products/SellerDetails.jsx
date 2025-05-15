import "./Styles/SellerDetails.css";

const SellerDetails = () => {
  const seller = {
    name: "iPhone Nigeria Ltd.",
    ratings: 4.5,
    totalOrders: 2080,
    location: "Lagos, Nigeria"
  };

  return (
    <div className="seller-details">
      <h2>Seller Information</h2>
      <p><strong>Name:</strong> {seller.name}</p>
      <p><strong>Rating:</strong> ⭐ {seller.ratings} / 5</p>
      <p><strong>Total Orders:</strong> {seller.totalOrders.toLocaleString()}</p>
      <p><strong>Location:</strong> {seller.location}</p>
    </div>
  );
};

export default SellerDetails;
