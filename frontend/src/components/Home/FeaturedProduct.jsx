import "./Styles/FeaturedProduct.css";
import { useInView } from "react-intersection-observer";
import productImageA  from "../../assets/1polo.jpg";
import productImageB  from "../../assets/1jeans.jpg";
import productImageC  from "../../assets/1wrist-watch.jpg";
import productImageD  from "../../assets/2polo.jpg";

const FeaturedProducts = () => {
  const products = [
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 1, name: "Product A", price: "$99.99", img: productImageA },
    { id: 2, name: "Product B", price: "$79.99", img: productImageB },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
    { id: 3, name: "Product C", price: "$59.99", img: productImageC },
    { id: 4, name: "Product D", price: "$99.99", img: productImageD },
  ];

  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section ref={ref} className={`feature-section ${inView ? "active" : ""}`}>
      <div className="feature-title scroll-reveal active">
        <span className="feature-line"></span>  
        <h2>🔥 Featured Products</h2>
        <p>Shop our top-selling items, carefully selected just for you!</p>
      </div>

      <div className="feature-grid">
        {products.map((product) => (
          <div key={product.id} className={`feature-card scroll-reveal ${inView ? "active" : ""}`}>
            <img src={product.img} alt={product.name} className="feature-img" />
            <h3 className="feature-name">{product.name}</h3>
            <p className="feature-price">{product.price}</p>
            <button className="feature-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
