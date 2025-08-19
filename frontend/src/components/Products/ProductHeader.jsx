import { useNavigate } from "react-router-dom";
import "./Styles/ProductHeader.css";

const ProductHeader = ({ product }) => {
  const navigate = useNavigate();

  if (!product || (!product.name && !product.price)) {
    return <p className="loading-message">Loading product details...</p>;
  }

  const title = product.name;
  const price = product.discount_price ?? product.price ?? 0;
  const oldPrice = product.price ?? 0;
  const savings = oldPrice - price;
  const badges = product.tags || ["In Stock"];
  const imageUrl = product.image_url
    ? `http://localhost:5000/images/${product.image_url}`
    : "";

  const startConversation = async () => {
    console.log("👉 ProductHeader product object:", product);

    try {
      const payload = {
        shopId: product.shop_id,
        productId: product.id,
      };

      console.log("👉 Sending:", payload);

      const res = await fetch("http://localhost:5000/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send cookies
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
      <div className="product-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="product-image" />
        ) : (
          <div className="no-image">No image available</div>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-title">{title}</h1>

        <div className="product-pricing">
          <div className="product-price">${price.toLocaleString()}</div>
          {oldPrice !== price && (
            <>
              <div className="old-price">${oldPrice.toLocaleString()}</div>
              <div className="you-save">You save ${savings.toLocaleString()}</div>
            </>
          )}
        </div>

        <div className="product-badges">
          {badges.map((badge, i) => (
            <span key={i} className={`badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}>
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
