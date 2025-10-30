import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/StoreShop.css";

const API_BASE_URL = "http://localhost:5000";

const Storeshop = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/shops/${shopId}`);
        const data = await res.json();
        setShop(data.shop);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch store:", err);
      }
    };

    fetchStoreData();
  }, [shopId]);

  // ✅ helper to parse image properly (same logic as SellerProducts.jsx)
  const getProductImage = (product) => {
    let imagePath = "/fallback.jpg"; // optional fallback image

    try {
      const parsed = JSON.parse(product.image_url);
      const first = Array.isArray(parsed) ? parsed[0] : parsed;
      if (first) {
        imagePath = first.startsWith("http")
          ? first
          : `${API_BASE_URL}${first}`;
      }
    } catch {
      if (product.image_url) {
        imagePath = product.image_url.startsWith("http")
          ? product.image_url
          : `${API_BASE_URL}${product.image_url}`;
      }
    }

    return imagePath;
  };

  if (!shop) return <div>Loading store...</div>;

  return (
    <>
      {/* 🏪 Banner */}
      <div className="storeshop-banner-wrapper">
        <img
          src={`${API_BASE_URL}/uploads/${shop.banner_image}`}
          alt="Banner"
          className="storeshop-banner"
        />
      </div>

      <div className="storeshop-page">
        {/* Header */}
        <div className="storeshop-header">
          <img
            src={`${API_BASE_URL}/uploads/${shop.logo_image}`}
            alt="Logo"
            className="storeshop-logo"
          />
          <div className="storeshop-details">
            <h1>{shop.shop_name}</h1>
            <p>
              Owned by {shop.owner_name} - 📍 {shop.location}
            </p>
            <p>Shipping: {shop.estimated_shipping_time}</p>
            <p>Return Policy: {shop.return_policy}</p>
          </div>
        </div>

        <p className="storeshop-description">{shop.shop_description}</p>

        {/* All Products */}
        <h2
          style={{
            margin: "2rem 0 1rem",
            fontSize: "1.5rem",
            color: "var(--primary-color)",
          }}
        >
          All Products
        </h2>

        <div className="storeshop-product-grid">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = getProductImage(product);

              return (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="storeshop-product-card"
                >
                  <div className="storeshop-product-image">
                    <img src={imageUrl} alt={product.name} />
                  </div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">
                    ${Number(product.price).toLocaleString()}
                  </p>
                </Link>
              );
            })
          ) : (
            <p>No products found for this store.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Storeshop;
