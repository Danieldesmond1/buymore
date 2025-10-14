import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/RelatedProducts.css";

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedItems, setRelatedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/category/${category}`);
        const data = await res.json();

        if (data.products) {
          // Filter out the current product
          const filtered = data.products.filter((p) => p.id !== currentProductId);

          // ✅ Safely handle both JSON arrays and strings for image_url
          const processed = filtered.map((p) => {
            let imagePath = "/fallback.jpg";
            try {
              const parsed = JSON.parse(p.image_url);
              const first = Array.isArray(parsed) ? parsed[0] : parsed;
              imagePath = first.startsWith("http")
                ? first
                : `http://localhost:5000${first}`;
            } catch {
              imagePath = p.image_url?.startsWith("http")
                ? p.image_url
                : `http://localhost:5000${p.image_url}`;
            }
            return { ...p, image: imagePath };
          });

          setRelatedItems(processed);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    if (category) fetchRelated();
  }, [category, currentProductId]);

  // ✅ Navigate to product details page when clicked
  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-grid">
        {relatedItems.length > 0 ? (
          relatedItems.map((item) => (
            <div
              key={item.id}
              className="related-card"
              onClick={() => handleViewProduct(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleViewProduct(item.id);
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="related-img"
                loading="lazy"
              />
              <h3 className="product-title">{item.name}</h3>
              <p className="product-price">${item.price?.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="no-related">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
