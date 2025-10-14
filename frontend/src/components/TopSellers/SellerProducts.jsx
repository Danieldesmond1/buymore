import "./styles/SellerProducts.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Toast from "../Toast/Toast";

const API_BASE_URL = "http://localhost:5000";

const SellerProducts = ({ products }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  if (!products || products.length === 0) {
    return <p className="no-products">No products available in this store.</p>;
  }

  const handleViewProduct = (product) => {
    if (!user) {
      setToast({
        message: "Please log in to view product details.",
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
      return;
    }
    navigate(`/products/${product.id}`);
  };

  // ✅ helper to parse image correctly
  const getProductImage = (product) => {
    let imagePath = "/fallback.jpg"; // optional fallback

    try {
      const parsed = JSON.parse(product.image_url);
      const first = Array.isArray(parsed) ? parsed[0] : parsed;
      if (first) {
        imagePath = first.startsWith("http")
          ? first
          : `${API_BASE_URL}${first}`;
      }
    } catch {
      if (product.image_url) {
        imagePath = product.image_url.startsWith("http")
          ? product.image_url
          : `${API_BASE_URL}${product.image_url}`;
      }
    }

    return imagePath;
  };

  return (
    <div className="seller-products-container">
      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => {
          const imageUrl = getProductImage(product);

          return (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleViewProduct(product)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleViewProduct(product);
              }}
            >
              <div className="product-image-container">
                <img src={imageUrl} alt={product.name} className="product-image" />
              </div>

              <h4>{product.name}</h4>

              <p className="price">
                {product.discount_price && product.discount_price !== "0"
                  ? `₦${Number(product.discount_price).toLocaleString()}`
                  : `₦${Number(product.price).toLocaleString()}`}
              </p>

              {product.discount_price && product.discount_price !== "0" && (
                <p className="old-price">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              )}

              <button
                className="buy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProduct(product);
                }}
              >
                View Product
              </button>
            </div>
          );
        })}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actions={toast.actions}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SellerProducts;
