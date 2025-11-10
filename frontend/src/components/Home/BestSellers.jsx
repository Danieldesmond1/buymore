import "./Styles/BestSellers.css";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Toast from "../Toast/Toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // your live backend URL

const BestSellers = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const navigate = useNavigate();
  const { user } = useAuth();

  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
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
      const response = await fetch(`${API_BASE}/api/cart/add`, {
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
        setToast({
          message: `${product.name} added to cart ✅`,
          type: "success",
        });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({
          message: data.message || "Failed to add product to cart",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Error connecting to server",
        type: "error",
      });
      console.error("Add to cart error:", error);
    }
  };

  const handleViewProduct = (product) => {
    if (!user) {
      setToast({
        message: "Please log in to view more about this product.",
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
      navigate(`/products/${product.id}`);
    }
  };

  return (
    <section ref={ref} className={`best-sellers ${inView ? "active" : ""}`}>
      <div className="bestseller-title">
        <h2 className={inView ? "active" : ""}>🔥 Best Sellers</h2>
        <span className="bestseller-line"></span>
        <p>Most loved items by our customers — shop the hottest deals now.</p>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-list">
          {products.map((product, index) => {
          let parsedImages = [];
          try {
            parsedImages = JSON.parse(product.image_url);
          } catch {
            parsedImages = [];
          }

          const firstImage =
            parsedImages.length > 0
              ? (parsedImages[0].startsWith("http")
                  ? parsedImages[0]
                  : `${API_BASE}${parsedImages[0]}`)
              : "/fallback.jpg";
          // fallback placeholder

          return (
            <div
              key={product.id}
              className={`s-product-card ${inView ? "show-bestseller" : ""}`}
              style={{ animationDelay: `${index * 0.1}s`, cursor: "pointer" }}
              onClick={() => handleViewProduct(product)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleViewProduct(product);
              }}
              aria-label={`View details for ${product.name}`}
            >
              <img
                src={firstImage}
                alt={product.name}
                className="bestseller-img"
                loading="lazy"
              />
              <h3>{product.name}</h3>

              {/* ✅ Updated price layout */}
              <div className="feature-price">
                <span className="current-price">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.discount_price && (
                  <span className="old-price">
                    ${parseFloat(product.discount_price).toFixed(2)}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>

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

export default BestSellers;
