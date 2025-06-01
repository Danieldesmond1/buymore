import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Styles/ProductGrid.css";

const capitalize = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const ProductGrid = ({
  addToCart,
  selectedCategory,
  setSelectedCategory,
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
}) => {
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

  const applyFilters = (products) => {
    return products.filter((product) => {
      // Search query filter
      if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.trim().toLowerCase();
        if (
          !product.name.toLowerCase().includes(query) &&
          !product.brand.toLowerCase().includes(query) &&
          !product.category.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Category filter
      if (
        selectedCategory &&
        capitalize(product.category) !== capitalize(selectedCategory)
      )
        return false;

      // Price filter
      if (filters.price.length) {
        const price = product.discount_price || product.price;
        const match = filters.price.some((range) => {
          if (range === "Under $50") return price < 50;
          if (range === "$50 - $100") return price >= 50 && price <= 100;
          if (range === "$100 - $200") return price > 100 && price <= 200;
          if (range === "$200 & Above") return price > 200;
          return false;
        });
        if (!match) return false;
      }

      // Brand filter
      if (filters.brand.length && !filters.brand.includes(product.brand))
        return false;

      // Rating filter
      if (filters.rating.length) {
        const ratingMatch = filters.rating.some((ratingLabel) => {
          const minStars = parseInt(ratingLabel[0]);
          return product.rating >= minStars;
        });
        if (!ratingMatch) return false;
      }

      // Availability filter
      if (
        filters.availability.length &&
        !filters.availability.includes(
          product.stock > 0 ? "In Stock" : "Out of Stock"
        )
      )
        return false;

      // Color filter (normalize to lowercase for comparison)
      if (
        filters.color.length &&
        !filters.color.includes(product.color?.toLowerCase())
      )
        return false;

      // Condition filter
      if (filters.condition.length && !filters.condition.includes(product.condition))
        return false;

      // Discount filter
      if (filters.discount.length) {
        if (!product.discount_price) return false; // no discount if no discount_price
        const discountPercent = Math.round(
          ((product.price - product.discount_price) / product.price) * 100
        );
        const match = filters.discount.some((label) => {
          const num = parseInt(label);
          return discountPercent >= num;
        });
        if (!match) return false;
      }

      return true;
    });
  };

  const filteredProducts = applyFilters(products);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleClearFilters = () => {
    setSelectedCategory(""); // resets category
    setFilters({
      price: [],
      brand: [],
      rating: [],
      availability: [],
      color: [],
      condition: [],
      discount: [],
    });
    setSearchQuery(""); // reset search query
    setVisibleCount(6); // reset visible items
  };

  if (loading) return <p className="pg-loading">Loading products...</p>;
  if (error) return <p className="pg-error">Error: {error}</p>;

  return (
    <section className="pg-section">
      <h2 className="pg-title">
        🛍️ {selectedCategory ? capitalize(selectedCategory) : "All Products"}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="pg-no-products">
          {searchQuery && searchQuery.trim() !== "" ? (
            <p>
              Sorry, "{searchQuery}" isn’t available on any seller’s store. 😥
            </p>
          ) : (
            <p>
              No products found in "{capitalize(selectedCategory || "All")}" with the current filters.
            </p>
          )}
          <button
            className="pg-clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
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
              <div className="pg-rating" aria-label={`Rated ${product.rating} stars`}>
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
