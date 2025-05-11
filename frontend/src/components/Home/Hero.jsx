import "./Styles/Hero.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GiShoppingCart } from "react-icons/gi";

const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200); // Delay to trigger animation smoothly
  }, []);

  return (
    <section className="hero">
      {/* Left Side: CTA Content */}
      <div className={`hero-content ${animate ? "animate-cta" : ""}`}>
        <p className="hero-subtitle">🔥 Exclusive Offers Just for You!</p>
        <h1>Shop the Best Deals Now!</h1>
        <p className="hero-description">
          Discover top-quality products at unbeatable prices. Get fast delivery and secure payment options.
        </p>

        {/* Buttons */}
        <div className="hero-buttons">
          <Link to="/shop" className="btn primary-btn">Shop Now</Link>
          <Link to="/deals" className="btn secondary-btn">Learn More</Link>
        </div>

        {/* Trust Points */}
        <div className="hero-trust">
          <span><TbTruckDelivery /> Fast Delivery ✔️</span>
          <span><RiSecurePaymentFill /> 100% Secure Payment ✔️</span>
          <span><GiShoppingCart /> Best Deals, Always ✔️</span>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hero-image"></div>
    </section>
  );
};

export default Hero;
