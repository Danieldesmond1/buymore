import "./Styles/Hero.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 for redirect
import { useAuth } from "../../context/AuthContext"; // 👈 auth context
import Toast from "../Toast/Toast"; // 👈 custom toast

import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GiShoppingCart } from "react-icons/gi";

const Hero = () => {
  const [animate, setAnimate] = useState(false);
  const [toast, setToast] = useState(null); // 👈 for toast
  const { user } = useAuth(); // 👈 get user
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  const handleShopNowClick = () => {
    if (!user) {
      setToast({
        message: "Please log in to start shopping.",
        type: "info",
        actions: [
          {
            label: "Log In",
            onClick: () => {
              setToast(null);
              navigate("/login");
            },
          },
          {
            label: "Keep Browsing",
            onClick: () => setToast(null),
          },
        ],
      });
    } else {
      navigate("/shop");
    }
  };

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
          <button onClick={handleShopNowClick} className="btn primary-btn">
            Shop Now
          </button>
          <button onClick={() => navigate("/deals")} className="btn secondary-btn">
            Learn More
          </button>
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

      {/* ✅ Show Toast if needed */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actions={toast.actions}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default Hero;
