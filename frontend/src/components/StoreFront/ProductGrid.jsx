import { useState } from "react";
import "./Styles/ProductGrid.css";
import sampleImg from "../../assets/1polo.jpg";

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
];

const ProductGrid = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section className="pg-section">
      <h2 className="pg-title">🛍️ All Products</h2>

      <div className="pg-grid">
        {allProducts.slice(0, visibleCount).map((product) => (
          <article className="pg-card" key={product.id}>
            <img
              src={product.image}
              alt={`Product image of ${product.name}`}
              loading="lazy"
              className="pg-img"
            />
            <h3 className="pg-name">{product.name}</h3>
            <p className="pg-price">{product.price}</p>
            <div className="pg-rating" aria-label={`Rated ${product.rating} stars`}>
              {"⭐".repeat(Math.floor(product.rating))}{" "}
              <span className="pg-rating-score">({product.rating})</span>
            </div>
            <button className="pg-btn" aria-label={`Add ${product.name} to cart`}>
              Add to Cart
            </button>
          </article>
        ))}
      </div>

      {visibleCount < allProducts.length && (
        <div className="pg-show-more-container">
          <button onClick={handleShowMore} className="pg-show-more-btn">
            Show More
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
