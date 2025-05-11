import "./Styles/ProductGrid.css";
import sampleImg from "../../assets/1polo.jpg"; // Use different images for realism

const products = [
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
];

const ProductGrid = () => {
  console.log(products); // Check if products array is populated correctly
  return (
    <section className="product-grid-section">
      <h2 className="section-title">🛍️ All Products</h2>
      <div className="product-grid">
        {products.map((product) => (
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
    </section>
  );
};


export default ProductGrid;
