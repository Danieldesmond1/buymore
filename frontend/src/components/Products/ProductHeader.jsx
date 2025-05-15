import "./Styles/ProductHeader.css";
import front from "../../assets/iphone14promaxfront.jpg";
import back from "../../assets/iphone14promax.jpg";
import side from "../../assets/iphone14promaxside.jpg";
import box from "../../assets/iphone14promaxpack.jpg";
import { useState, useEffect } from "react";

const ProductHeader = () => {
  const title = "iPhone 14 Pro Max (256GB) - Deep Purple";
  const price = 1250000;
  const oldPrice = 1450000;
  const savings = oldPrice - price;
  const badges = ["Best Seller", "In Stock"];

  const images = [front, back, side, box];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;

    if (isHovered) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1500);
    } else {
      setCurrentIndex(0);
    }

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="product-header">
      <div
        className="product-image-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={images[currentIndex]}
          alt={title}
          className="product-image fade-image"
        />
      </div>

      <div className="product-info">
        <h1 className="product-title">{title}</h1>

        <div className="product-pricing">
          <div className="product-price">₦{price.toLocaleString()}</div>
          <div className="old-price">₦{oldPrice.toLocaleString()}</div>
          <div className="you-save">You save ₦{savings.toLocaleString()}</div>
        </div>

        <div className="product-badges">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="limited-stock">🔥 Only 3 left – order now!</div>
      </div>
    </div>
  );
};

export default ProductHeader;
