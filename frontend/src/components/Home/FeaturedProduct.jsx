import "./Styles/FeaturedProduct.css";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import Toast from "../Toast/Toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const FeaturedProducts = ({ onLoaded }) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        if (isMounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        if (isMounted) {
          setToast({ message: error.message || "Error loading products", type: "error" });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          if (onLoaded) onLoaded();
        }
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    if (!user) {
      setToast({
        message: "Please log in to add items to your cart.",
        type: "warning",
        actions: [
          {
            label: "Log In",
            onClick: () => { setToast(null); navigate("/login"); },
          },
          { label: "Keep Browsing", onClick: () => setToast(null) },
        ],
      });
      return;
    }

    const productForCart = {
      id: product.id || product.product_id,
      name: product.name,
      image_url: product.image_url,
      price: product.price,
      quantity: 1,
    };

    addToCart(user.id, productForCart, (msg, type) => {
      setToast({ message: msg, type });
      setTimeout(() => setToast(null), 3000);
    });
  };

  // Handle View Product
  const handleViewProduct = (product) => {
    if (!user) {
      setToast({
        message: "Please log in to view product details.",
        type: "info",
        actions: [
          { label: "Log In", onClick: () => { setToast(null); navigate("/login"); } },
          { label: "Keep Browsing", onClick: () => setToast(null) },
        ],
      });
      return;
    }
    navigate(`/products/${product.id}`);
  };

  return (
    <section ref={ref} className={`feature-section ${inView ? "active" : ""}`}>
      <div className="feature-title scroll-reveal active">
        <span className="feature-line"></span>
        <h2>🔥 Featured Products</h2>
        <p>Shop our top-selling items, carefully selected just for you!</p>
      </div>

      {loading ? (
        <div className="loading-placeholder">
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <p className="no-products">No products available.</p>
      ) : (
        <div className="feature-grid">
          {products.map((product) => {
            let parsedImages = [];
            try {
              parsedImages = JSON.parse(product.image_url);
            } catch {
              parsedImages = [];
            }

            const firstImage =
              parsedImages.length > 0
                ? (parsedImages[0].startsWith("http") ? parsedImages[0] : `${API_BASE}${parsedImages[0]}`)
                : "/fallback.jpg";

            return (
              <article
                key={product.id}
                className={`feature-card scroll-reveal ${inView ? "active" : ""}`}
                onClick={() => handleViewProduct(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleViewProduct(product);
                }}
                aria-label={`View details for ${product.name}`}
              >
                <img src={firstImage} alt={product.name} className="feature-img" loading="lazy" />
                <h3 className="feature-name">{product.name}</h3>
                <p className="feature-price">
                  {product.discount_price && product.discount_price !== "0" ? (
                    <>
                      <span className="current-price">${parseFloat(product.discount_price).toFixed(2)}</span>
                      <span className="old-price">${parseFloat(product.price).toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
                  )}
                </p>

                <button
                  className="feature-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </article>
            );
          })}
        </div>
      )}

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

export default FeaturedProducts;
