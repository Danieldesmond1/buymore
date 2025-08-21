import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SellerProducts from "./SellerProducts";
import "./styles/SellerStore.css";
// import axios from "axios";

const SellerStore = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // 👈 default tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock fallback data
        const sellerRes = {
          data: {
            id: sellerId,
            shopName: "Demo Shop",
            logo: "https://via.placeholder.com/100",
            bannerImage: "https://via.placeholder.com/1200x300",
            bio: "Welcome to Demo Shop! We offer top-quality products at unbeatable prices.",
            rating: 4.8,
            totalSales: 1234,
            followers: 432,
          },
        };

        const productsRes = {
          data: [
            { id: 1, name: "Product A", price: 19.99, image: "https://via.placeholder.com/300" },
            { id: 2, name: "Product B", price: 29.99, image: "https://via.placeholder.com/300" },
            { id: 3, name: "Product C", price: 49.99, image: "https://via.placeholder.com/300" },
            { id: 4, name: "Product D", price: 9.99, image: "https://via.placeholder.com/300" },
          ],
        };

        setSeller(sellerRes.data);
        setProducts(productsRes.data);

        // Uncomment real API when ready
        // const sellerRes = await axios.get(`/api/sellers/${sellerId}`);
        // const productsRes = await axios.get(`/api/sellers/${sellerId}/products`);
      } catch (error) {
        console.error("Error loading store:", error);
      }
    };
    fetchData();
  }, [sellerId]);

  if (!seller) return <p className="loading">Loading store...</p>;

  return (
    <div className="seller-store-container">
      {/* Banner */}
      <div className="seller-banner">
        <img src={seller.bannerImage} alt="Store banner" />
        <div className="banner-overlay"></div>
      </div>

      {/* Store Info */}
      <div className="seller-header">
        <img src={seller.logo} alt="Logo" className="seller-logo" />
        <div className="seller-details">
          <h1 className="seller-name">{seller.shopName}</h1>
          <p className="seller-bio">{seller.bio}</p>
          <div className="seller-stats">
            <span>⭐ {seller.rating} / 5</span>
            <span>📦 {seller.totalSales} sales</span>
            <span>👥 {seller.followers} followers</span>
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
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={activeTab === "about" ? "active" : ""}
          onClick={() => setActiveTab("about")}
        >
          About Store
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "products" && <SellerProducts />}

        {activeTab === "categories" && (
          <div className="categories">
            <h2>Shop by Categories</h2>
            <ul>
              <li>📱 Electronics</li>
              <li>👕 Fashion</li>
              <li>🏠 Home & Kitchen</li>
              <li>🎮 Gaming</li>
              <li>💄 Beauty</li>
            </ul>
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-store">
            <h2>About {seller.shopName}</h2>
            <p>
              {seller.bio} We pride ourselves on excellent customer service,
              premium quality products, and fast delivery.
            </p>
            <button className="message-btn">💬 Message Seller</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerStore;
