import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Styles/ProductGrid.css";

// Same capitalize helper for consistency
const capitalize = (str) =>
  str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const ProductGrid = ({ addToCart, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        if (isMounted)
          setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by category ignoring case, display capitalized
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          capitalize(product.category) === capitalize(selectedCategory) &&
          product.stock > 0
      )
    : products;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (loading) return <p className="pg-loading">Loading products...</p>;
  if (error) return <p className="pg-error">Error: {error}</p>;

  return (
    <section className="pg-section">
      <h2 className="pg-title">
        🛍️ {selectedCategory ? capitalize(selectedCategory) : "All Products"}
      </h2>

      {selectedCategory && filteredProducts.length === 0 ? (
        <p className="pg-no-products">
          No products available in the "{capitalize(selectedCategory)}" category.
        </p>
      ) : (
        <div className="pg-grid">
          {filteredProducts.slice(0, visibleCount).map((product, index) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="pg-card"
              key={product.id}
            >
              <img
                src={`http://localhost:5000/images/${product.image_url}`}
                alt={`Product image of ${product.name}`}
                loading="lazy"
                className="pg-img"
              />
              <h3 className="pg-name">{product.name}</h3>
              <p className="pg-brand">{product.brand}</p>
              <p className="pg-category">{capitalize(product.category)}</p>
              <p className="pg-description">{product.description}</p>
              <p className="pg-price">
                {product.discount_price ? (
                  <>
                    <span className="pg-discount-price">
                      ${parseFloat(product.discount_price).toFixed(2)}
                    </span>{" "}
                    <span className="pg-original-price">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>${parseFloat(product.price).toFixed(2)}</>
                )}
              </p>
              <p className="pg-stock">
                {product.stock > 0
                  ? `In stock: ${product.stock}`
                  : "Out of stock"}
              </p>
              <div
                className="pg-rating"
                aria-label={`Rated ${product.rating} stars`}
              >
                {"⭐".repeat(Math.floor(product.rating) || 0)}{" "}
                <span className="pg-rating-score">
                  {typeof product.rating === "number"
                    ? product.rating.toFixed(1)
                    : "N/A"}
                </span>
              </div>

              <button
                className="pg-btn"
                aria-label={`Add ${product.name} to cart`}
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </motion.article>
          ))}
        </div>
      )}

      {visibleCount < filteredProducts.length && (
        <div className="pg-show-more-container">
          <button onClick={handleShowMore} className="pg-show-more-btn">
            Show More
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
