import "./Styles/BestSellers.css";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Toast from "../Toast/Toast";

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
        headers: {
          "Content-Type": "application/json",
        },
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
      <h2 className={`fade-in-bestseller ${inView ? "active" : ""}`}>🔥 Best Sellers</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-list">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`product-card ${inView ? "show-bestseller" : ""}`}
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
                src={`http://localhost:5000/images/${product.image_url}`}
                alt={product.name}
                loading="lazy"
              />
              <h3>{product.name}</h3>
              <p>${parseFloat(product.discount_price || product.price).toFixed(2)}</p>
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

export default BestSellers;
