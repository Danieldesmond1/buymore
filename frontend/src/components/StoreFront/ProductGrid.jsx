import { useState } from "react";
import "./Styles/ProductGrid.css";
import sampleImg from "../../assets/1polo.jpg";

// Full product list
const allProducts = [
  {
    id: 1,
    name: "Classic Polo Shirt",
    price: "$24.99",
    rating: 4.5,
    image: sampleImg,
  },
  {
    id: 2,
    name: "Casual Jeans",
    price: "$34.99",
    rating: 4.2,
    image: sampleImg,
  },
  {
    id: 3,
    name: "Smart Wrist Watch",
    price: "$149.99",
    rating: 4.8,
    image: sampleImg,
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: "$79.99",
    rating: 4.6,
    image: sampleImg,
  },
  {
    id: 5,
    name: "Sneakers",
    price: "$59.99",
    rating: 4.3,
    image: sampleImg,
  },
  {
    id: 6,
    name: "Graphic Tee",
    price: "$19.99",
    rating: 4.1,
    image: sampleImg,
  },
  {
    id: 7,
    name: "Denim Jacket",
    price: "$49.99",
    rating: 4.7,
    image: sampleImg,
  },
  {
    id: 8,
    name: "Leather Belt",
    price: "$15.99",
    rating: 4.0,
    image: sampleImg,
  },
  {
    id: 9,
    name: "Sunglasses",
    price: "$29.99",
    rating: 4.4,
    image: sampleImg,
  },
  {
    id: 10,
    name: "Backpack",
    price: "$39.99",
    rating: 4.2,
    image: sampleImg,
  },
  // Add more as needed
];

const ProductGrid = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section className="product-grid-section">
      <h2 className="section-title">🛍️ All Products</h2>

      <div className="product-grid">
        {allProducts.slice(0, visibleCount).map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <div className="rating">
              {"⭐".repeat(Math.floor(product.rating))} ({product.rating})
            </div>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>

      {visibleCount < allProducts.length && (
        <div className="show-more-container">
          <button onClick={handleShowMore} className="show-more-btn">
            Show More
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
