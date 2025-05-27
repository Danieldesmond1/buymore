import "./Styles/FeaturedProduct.css";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom"; // 👈 for navigation
import { useAuth } from "../../context/AuthContext"; // 👈 for auth

import productImageA from "../../assets/1polo.jpg";
import productImageB from "../../assets/1jeans.jpg";
import productImageC from "../../assets/1wrist-watch.jpg";
import productImageD from "../../assets/2polo.jpg";

import { useState } from "react";
import Toast from "../Toast/Toast"; // ✅ Import custom Toast component

const FeaturedProducts = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 Get current user

    const [toast, setToast] = useState(null); // ✅ Toast state

  const products = [
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 5, name: "Product A", price: "$99.99", img: productImageA },
    { id: 6, name: "Product B", price: "$79.99", img: productImageB },
    { id: 7, name: "Product C", price: "$59.99", img: productImageC },
    { id: 8, name: "Product D", price: "$99.99", img: productImageD },
    { id: 9, name: "Product C", price: "$59.99", img: productImageC },
    { id: 10, name: "Product D", price: "$99.99", img: productImageD },
    { id: 11, name: "Product A", price: "$99.99", img: productImageA },
    { id: 12, name: "Product B", price: "$79.99", img: productImageB },
    { id: 13, name: "Product C", price: "$59.99", img: productImageC },
    { id: 14, name: "Product D", price: "$99.99", img: productImageD },
    { id: 15, name: "Product A", price: "$99.99", img: productImageA },
    { id: 16, name: "Product B", price: "$79.99", img: productImageB },
    { id: 17, name: "Product C", price: "$59.99", img: productImageC },
    { id: 18, name: "Product D", price: "$99.99", img: productImageD },
    { id: 19, name: "Product C", price: "$59.99", img: productImageC },
    { id: 20, name: "Product D", price: "$99.99", img: productImageD },
    { id: 21, name: "Product A", price: "$99.99", img: productImageA },
    { id: 22, name: "Product B", price: "$79.99", img: productImageB },
    { id: 23, name: "Product C", price: "$59.99", img: productImageC },
    { id: 24, name: "Product D", price: "$99.99", img: productImageD },
    { id: 25, name: "Product A", price: "$99.99", img: productImageA },
    { id: 26, name: "Product B", price: "$79.99", img: productImageB },
    { id: 27, name: "Product C", price: "$59.99", img: productImageC },
    { id: 28, name: "Product D", price: "$99.99", img: productImageD },
    { id: 29, name: "Product C", price: "$59.99", img: productImageC },
    { id: 30, name: "Product D", price: "$99.99", img: productImageD },
  ];

  const handleAddToCart = (product) => {
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
            onClick: () => {
              setToast(null);
            },
          },
        ],
      });
    } else {
      setToast({
        message: `${product.name} added to cart ✅`,
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
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
            onClick: () => {
              setToast(null);
            },
          },
        ],
      });
    } else {
      navigate(`/products/${product.id}`);
    }
  };



  // const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section ref={ref} className={`feature-section ${inView ? "active" : ""}`}>
      <div className="feature-title scroll-reveal active">
        <span className="feature-line"></span>
        <h2>🔥 Featured Products</h2>
        <p>Shop our top-selling items, carefully selected just for you!</p>
      </div>

      <div className="feature-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className={`feature-card scroll-reveal ${inView ? "active" : ""}`}
            onClick={() => handleViewProduct(product)}
            style={{ cursor: "pointer" }}
          >
            <img src={product.img} alt={product.name} className="feature-img" />
            <h3 className="feature-name">{product.name}</h3>
            <p className="feature-price">{product.price}</p>
            <button
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation(); // 👈 prevent card click
                handleAddToCart(product);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Show Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actions={toast.actions} // ✅ pass actions!
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;
