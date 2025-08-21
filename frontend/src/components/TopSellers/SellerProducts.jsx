import { useParams } from "react-router-dom";
import "./styles/SellerProducts.css";

const SellerProducts = () => {
  const { sellerId } = useParams();

  // Mock seller data (later from backend)
  const seller = {
    id: sellerId,
    name: "Daniel’s Tech Hub",
    location: "Lagos, Nigeria",
    about: "We provide premium gadgets, accessories, and tech solutions.",
    products: [
      { id: 1, name: "iPhone 15 Pro", price: "$1200", img: "/mock/iphone.jpg" },
      { id: 2, name: "MacBook Air M2", price: "$1500", img: "/mock/macbook.jpg" },
      { id: 3, name: "AirPods Pro 2", price: "$250", img: "/mock/airpods.jpg" },
      { id: 4, name: "Samsung Galaxy Watch", price: "$400", img: "/mock/watch.jpg" },
    ],
  };

  return (
    <div className="seller-products-container">
      {/* Header */}
      <div className="seller-header">
        <div>
          <h2>{seller.name}</h2>
          <p>{seller.location}</p>
        </div>
        <button className="message-btn">💬 Message Seller</button>
      </div>

      {/* About Store */}
      <div className="about-store">
        <h3>About Store</h3>
        <p>{seller.about}</p>
      </div>

      {/* Products */}
      <div className="products-grid">
        {seller.products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.name} />
            <h4>{product.name}</h4>
            <p className="price">{product.price}</p>
            <button className="buy-btn">View Product</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;
