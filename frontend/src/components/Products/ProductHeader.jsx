import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Styles/ProductHeader.css";

const ProductHeader = ({ product }) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(null);
  const [hovering, setHovering] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  if (!product || (!product.name && !product.price)) {
    return <p className="loading-message">Loading product details...</p>;
  }

  const title = product.name;
  const price = product.price ?? 0; 
  const discount = product.discount_price ?? 0; 
  const savings = discount > 0 ? discount : 0;
  const discountPercent = price > 0 ? Math.round((savings / price) * 100) : 0;
  const badges = product.tags || ["In Stock"];

  // ✅ Parse image_url safely
  let parsedImages = [];
  try {
    if (typeof product.image_url === "string") {
      parsedImages = JSON.parse(product.image_url);
    } else if (Array.isArray(product.image_url)) {
      parsedImages = product.image_url;
    }
  } catch {
    parsedImages = [];
  }

  const images = parsedImages.map((img) =>
    img.startsWith("http") ? img : `${API_BASE}${img}`
  );

  const defaultImage =
    images.length > 0
      ? images[0]
      : product.image_url
      ? product.image_url.startsWith("http")
        ? product.image_url
        : `${API_BASE}/images/${product.image_url}`
      : "/fallback.jpg";

  useEffect(() => {
    setCurrentImage(defaultImage);
  }, [defaultImage]);

  // ✅ Handle hover image slideshow
  useEffect(() => {
    if (!hovering || images.length <= 1) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(images[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, [hovering, images]);

  const startConversation = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        shopId: product.shop_id,
        productId: product.id,
      };

      const res = await fetch(`${API_BASE}/api/messages/conversations`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Server said:", errorData);
        throw new Error("Failed to start conversation");
      }

      const conv = await res.json();
      navigate(`/dashboard/messages/${conv.id}`);
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };

  return (
    <div className="product-header">
      <div
        className="product-image-container"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          setCurrentImage(defaultImage);
        }}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={title}
            className="product-image smooth-fade"
          />
        ) : (
          <div className="no-image">No image available</div>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-title">{title}</h1>

        <div className="product-pricing">
          <div className="price-stack">
            <div className="product-price">${price.toLocaleString()}</div>
            {discount > 0 && (
              <div className="old-price">${discount.toLocaleString()}</div>
            )}
          </div>

          {discount > 0 && (
            <div className="you-save">
              You save ${savings.toLocaleString()} ({discountPercent}% off)
            </div>
          )}
        </div>

        <div className="product-badges">
          {badges.map((badge, i) => (
            <span
              key={i}
              className={`product-badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="limited-stock">
          🔥 Only {product.stock ?? 3} left – order now!
        </div>

        <div className="chat-seller">
          <button onClick={startConversation} className="message-seller-btn">
            💬 Message Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
