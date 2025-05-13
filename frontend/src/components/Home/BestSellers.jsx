import "./Styles/BestSellers.css";
import { useInView } from "react-intersection-observer";
import bestSellerA from "../../assets/1polo.jpg";
import bestSellerB from "../../assets/1jeans.jpg";
import bestSellerC from "../../assets/1wrist-watch.jpg";
import bestSellerD from "../../assets/2polo.jpg";

const BestSellers = () => {
  const products = [
    { id: 1, name: "Best Seller A", price: "$99.99", img: bestSellerA },
    { id: 2, name: "Best Seller B", price: "$79.99", img: bestSellerB },
    { id: 3, name: "Best Seller C", price: "$59.99", img: bestSellerC },
    { id: 4, name: "Best Seller D", price: "$99.99", img: bestSellerD },
    { id: 4, name: "Best Seller D", price: "$99.99", img: bestSellerD },
    { id: 4, name: "Best Seller D", price: "$99.99", img: bestSellerD },
    { id: 4, name: "Best Seller D", price: "$99.99", img: bestSellerD },
  ];

  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section ref={ref} className="best-sellers">
      <h2 className={inView ? "fade-in-bestseller" : ""}>Best Sellers</h2>
      <div className="product-list">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`product-card ${inView ? "show-bestseller" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button>Add</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
