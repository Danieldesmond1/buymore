import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SellerProducts from "./SellerProducts";
import "./styles/SellerStore.css";

const API_BASE_URL = "http://localhost:5000"; // 👈 Make sure this matches your backend port

const SellerStore = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/shops/${sellerId}`, {
          withCredentials: true,
        });

        console.log("Shop API response:", res.data);
        setSeller(res.data.shop);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error loading store:", error);
      }
    };

    fetchData();
  }, [sellerId]);

  if (!seller) return <p className="loading">Loading store...</p>;

  // ✅ Prepend /uploads path so images load correctly
  const bannerUrl = seller.banner_image
    ? `${API_BASE_URL}/uploads/${seller.banner_image}`
    : "/fallback-banner.jpg"; // optional fallback
  const logoUrl = seller.logo_image
    ? `${API_BASE_URL}/uploads/${seller.logo_image}`
    : "/fallback-logo.jpg"; // optional fallback

  return (
    <div className="seller-store-container">
      {/* Banner */}
      <div className="seller-banner">
        <img src={bannerUrl} alt="Store banner" />
        <div className="banner-overlay"></div>
      </div>

      {/* Store Info */}
      <div className="seller-header">
        <img src={logoUrl} alt="Logo" className="seller-logo" />
        <div className="seller-details">
          <h1 className="seller-name">{seller.shop_name}</h1>
          <p className="seller-bio">{seller.shop_description}</p>
          <div className="seller-stats">
            <span>⭐ {seller.rating ?? "N/A"} / 5</span>
            <span>📦 {products.length} products</span>
            <span>👥 {seller.owner_name}</span>
          </div>
        </div>
        <button className="follow-btn">+ Follow Store</button>
      </div>

      {/* Navigation Tabs */}
      <div className="seller-nav">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          All Products
        </button>
        {/* <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button> */}
        <button
          className={activeTab === "about" ? "active" : ""}
          onClick={() => setActiveTab("about")}
        >
          About Store
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "products" && <SellerProducts products={products} />}

        {activeTab === "categories" && (
          <div className="categories">
            <h2>Shop by Categories</h2>
            <ul>
              {[...new Set(products.map((p) => p.category))].map((cat, i) => (
                <li key={i}>{cat}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-store">
            <h2>About {seller.shop_name}</h2>

            {/* Shop Description */}
            <p className="shop-description">{seller.shop_description}</p>

            {/* Shop Details */}
            <div className="shop-details">
              <p><span className="key">Shop Handle:</span> {seller.shop_handle}</p>
              <p><span className="key">Business Address:</span> {seller.business_address}</p>
              <p><span className="key">Owner:</span> {seller.owner_name}</p>
              <p><span className="key">Owner Location:</span> {seller.location}</p>
              <p><span className="key">Store Type:</span> {seller.store_type}</p>
              <p><span className="key">Estimated Shipping Time:</span> {seller.estimated_shipping_time}</p>
              <p><span className="key">Return Policy:</span> {seller.return_policy}</p>
              <p><span className="key">Chat Enabled:</span> {seller.chat_enabled ? "✅ Yes" : "❌ No"}</p>
            </div>

            <button className="message-btn">💬 Message Seller</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerStore;
