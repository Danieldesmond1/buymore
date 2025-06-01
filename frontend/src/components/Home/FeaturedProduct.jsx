import "./Styles/FeaturedProduct.css";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import Toast from "../Toast/Toast";

const FeaturedProducts = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend on mount
useEffect(() => {
  let isMounted = true;

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      if (isMounted) setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      if (isMounted) {
        setToast({ message: error.message || "Error loading products", type: "error" });
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchProducts();

  return () => {
    isMounted = false;
  };
}, []);


  const handleAddToCart = async (product) => {
    if (!user) {
      setToast({
        message: "Please log in to add items to your cart.",
        type: "warning",
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

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToCart({ ...product, quantity: 1 });
        setToast({ message: `${product.name} added to cart ✅`, type: "success" });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ message: data.message || "Failed to add product to cart", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error connecting to server", type: "error" });
      console.error("Add to cart error:", error);
    }
  };

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

  return (
    <section ref={ref} className={`feature-section ${inView ? "active" : ""}`}>
      <div className="feature-title scroll-reveal active">
        <span className="feature-line"></span>
        <h2>🔥 Featured Products</h2>
        <p>Shop our top-selling items, carefully selected just for you!</p>
      </div>

      {loading ? (
        <div className="loading-placeholder">
          {/* Replace this with a spinner or skeleton UI if you want */}
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <p className="no-products">No products available.</p>
      ) : (
        <div className="feature-grid">
          {products.map((product) => (
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
    <img
      src={`http://localhost:5000/images/${product.image_url}`}
      alt={product.name}
      className="feature-img"
      loading="lazy"
    />
    <h3 className="feature-name">{product.name}</h3>
    <p className="feature-price">${parseFloat(product.discount_price || product.price).toFixed(2)}</p>
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
))}

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
