import "./Home.css";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const FeaturedProducts = () => {
  const products = [
    { id: 1, name: "Product A", price: "$99.99", img: "https://via.placeholder.com/150" },
    { id: 2, name: "Product B", price: "$79.99", img: "https://via.placeholder.com/150" },
    { id: 3, name: "Product C", price: "$59.99", img: "https://via.placeholder.com/150" },
    { id: 4, name: "Product D", price: "$99.99", img: "https://via.placeholder.com/150" },
  ];

  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section ref={ref} className={`featured-products ${inView ? "active" : ""}`}>
      <h2 className={`scroll-reveal ${inView ? "active" : ""}`}>Featured Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className={`product-card scroll-reveal ${inView ? "active" : ""}`}>
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
