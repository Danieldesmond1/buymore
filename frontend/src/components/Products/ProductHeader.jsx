import "./Styles/ProductHeader.css";

const ProductHeader = ({ product }) => {
  // If product is undefined or missing important fields, show a fallback
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

  return (
    <div className="product-header">
      <div className="product-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="product-image"
          />
        ) : (
          <div className="no-image">No image available</div>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-title">{title || "Unnamed Product"}</h1>

        <div className="product-pricing">
          <div className="product-price">${price.toLocaleString()}</div>
          {oldPrice !== price && (
            <>
              <div className="old-price">${oldPrice.toLocaleString()}</div>
              <div className="you-save">
                You save ${savings.toLocaleString()}
              </div>
            </>
          )}
        </div>

        <div className="product-badges">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`badge ${badge
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="limited-stock">
          🔥 Only {product.stock ?? 3} left – order now!
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
