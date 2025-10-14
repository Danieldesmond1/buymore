import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/RelatedProducts.css";

const RelatedProducts = () => {
  const [relatedItems, setRelatedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        if (data.products && data.products.length > 0) {
          // Shuffle products randomly
          const shuffled = data.products.sort(() => 0.5 - Math.random());

          // Pick maximum of 4
          const selected = shuffled.slice(0, 4);

          // ✅ Process image URLs safely
          const processed = selected.map((p) => {
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
        console.error("Error fetching random products:", err);
      }
    };

    fetchRandomProducts();
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className="related-products" aria-labelledby="related-products-heading">
      <h2 id="related-products-heading" className="related-products__title">
        You Might Also Like
      </h2>

      <ul className="related-products__list" role="list">
        {relatedItems.length > 0 ? (
          relatedItems.map((item) => (
            <li key={item.id} className="related-products__item" role="listitem">
              <div
                className="related-products__card"
                onClick={() => handleViewProduct(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleViewProduct(item.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="related-products__image"
                  loading="lazy"
                />
                <div className="related-products__info">
                  <h3 className="related-products__name">{item.name}</h3>
                  <p className="related-products__price">
                    ₦{item.price?.toLocaleString()}
                  </p>
                  <button
                    className="related-products__btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct(item.id);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="no-related">No products available.</p>
        )}
      </ul>
    </section>
  );
};

export default RelatedProducts;
