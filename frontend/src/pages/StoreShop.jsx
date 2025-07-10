// src/pages/Storeshop.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/StoreShop.css";

const Storeshop = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/shops/${shopId}`);
        const data = await res.json();
        setShop(data.shop);
        setProducts(data.products);
      } catch (err) {
        console.error("Failed to fetch store:", err);
      }
    };

    fetchStoreData();
  }, [shopId]);

  if (!shop) return <div>Loading store...</div>;

  return (
    <>
      {/* Full-width banner - outside of container */}
      <div className="storeshop-banner-wrapper">
        <img
          src={`http://localhost:5000/images/${shop.banner_image}`}
          alt="Banner"
          className="storeshop-banner"
        />
      </div>

      {/* Store content inside centered container */}
      <div className="storeshop-page">
        <div className="storeshop-header">
          <img
            src={`http://localhost:5000/images/${shop.logo_image}`}
            alt="Logo"
            className="storeshop-logo"
          />
          <div className="storeshop-details">
            <h1>{shop.shop_name}</h1>
            <p>Owned by {shop.owner_name} - 📍 {shop.location}</p>
            <p>Shipping: {shop.estimated_shipping_time}</p>
            <p>Return Policy: {shop.return_policy}</p>
          </div>
        </div>

        <p className="storeshop-description">{shop.shop_description}</p>

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
          {products.map((product) => (
            <div key={product.id} className="storeshop-product-card">
              <img
                src={`http://localhost:5000/images/${product.image_url}`}
                alt={product.name}
              />
              <p>{product.name}</p>
              <p>₦{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Storeshop;
