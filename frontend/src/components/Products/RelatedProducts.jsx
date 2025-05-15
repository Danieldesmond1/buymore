import "./Styles/RelatedProducts.css";

const relatedItems = [
  {
    id: 1,
    title: "iPhone 14",
    price: 950000,
    image: "/images/iphone14.jpg"
  },
  {
    id: 2,
    title: "Samsung Galaxy S23",
    price: 890000,
    image: "/images/s23.jpg"
  },
  {
    id: 3,
    title: "AirPods Pro",
    price: 135000,
    image: "/images/airpods.jpg"
  },
  {
    id: 4,
    title: "Apple Watch Series 8",
    price: 310000,
    image: "/images/applewatch.jpg"
  }
];

const RelatedProducts = () => {
  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-grid">
        {relatedItems.map(item => (
          <div key={item.id} className="related-card">
            <img src={item.image} alt={item.title} className="related-img" />
            <h3>{item.title}</h3>
            <p>₦{item.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
