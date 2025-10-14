import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Styles/ProductGrid.css";
import Toast from "../Toast/Toast";


const capitalize = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const ProductGrid = ({
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
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleViewProduct = (product) => {
    navigate(`/products/${product.id}`);
  };

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

      if (
        selectedCategory &&
        capitalize(product.category) !== capitalize(selectedCategory)
      )
        return false;

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

      if (filters.brand.length && !filters.brand.includes(product.brand))
        return false;

      if (filters.rating.length) {
        const ratingMatch = filters.rating.some((ratingLabel) => {
          const minStars = parseInt(ratingLabel[0]);
          return product.rating >= minStars;
        });
        if (!ratingMatch) return false;
      }

      if (
        filters.availability.length &&
        !filters.availability.includes(
          product.stock > 0 ? "In Stock" : "Out of Stock"
        )
      )
        return false;

      if (
        filters.color.length &&
        !filters.color.includes(product.color?.toLowerCase())
      )
        return false;

      if (filters.condition.length && !filters.condition.includes(product.condition))
        return false;

      if (filters.discount.length) {
        if (!product.discount_price) return false;
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
    setSelectedCategory("");
    setFilters({
      price: [],
      brand: [],
      rating: [],
      availability: [],
      color: [],
      condition: [],
      discount: [],
    });
    setSearchQuery("");
    setVisibleCount(6);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user) {
      setToast({ message: "Please login to add to cart", type: "warning" });
      return;
    }

    addToCart(user.id, product, (message, type) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    });
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
          {filteredProducts.slice(0, visibleCount).map((product, index) => {
            // Parse the image_url field like in FeaturedProducts
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
                    : `http://localhost:5000${parsedImages[0]}`)
                : "/fallback.jpg"; // fallback placeholder if no image found

            return (
              <motion.article
                key={product.id}
                onClick={() => handleViewProduct(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleViewProduct(product);
                }}
                aria-label={`View details for ${product.name}`}
                className="pg-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <img
                  src={firstImage}
                  alt={product.name}
                  className="pg-img"
                  loading="lazy"
                />
                <h3 className="pg-name">{product.name}</h3>
                <p className="pg-brand">{product.brand}</p>
                <p className="pg-category">{capitalize(product.category)}</p>
                <p className="pg-description">{product.description}</p>
                <div className="pg-price">
                  <span className="pg-current-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.discount_price && (
                    <span className="pg-old-price">
                      ${parseFloat(product.discount_price).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="pg-stock">
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
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
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </button>
              </motion.article>
            );
          })}
        </div>
      )}

      {visibleCount < filteredProducts.length && (
        <div className="pg-show-more-container">
          <button onClick={handleShowMore} className="pg-show-more-btn">
            Show More
          </button>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

    </section>
  );
};

export default ProductGrid;
