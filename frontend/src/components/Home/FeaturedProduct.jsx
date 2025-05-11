import "./Styles/FeaturedProduct.css";
// import { useEffect } from "react";
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
  ];

  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section ref={ref} className={`featured-products ${inView ? "active" : ""}`}>
  <div className="featured-heading scroll-reveal active">
    <span className="line"></span>  
    <h2>🔥 Featured Products</h2>
    <p>Shop our top-selling items, carefully selected just for you!</p>
  </div>

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
