import "./Styles/DeliveryOptions.css";

const DeliveryOptions = () => {
  return (
    <div className="delivery-options">
      <h2>Delivery Options</h2>
      <div className="option">
        <h4>Express Delivery</h4>
        <p>Delivered within 24–48 hours (₦2,000 - ₦3,000)</p>
      </div>
      <div className="option">
        <h4>Pick-up Station</h4>
        <p>Ready for pickup in 2–5 days at your selected location</p>
      </div>
      <div className="option">
        <h4>Nationwide Delivery</h4>
        <p>We deliver to all 36 states across Nigeria</p>
      </div>
    </div>
  );
};

export default DeliveryOptions;
