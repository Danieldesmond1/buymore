import "./Styles/StoreFront.css";

const CategoryMenu = () => {
  const categories = [
    "Phones",
    "Electronics",
    "Fashion",
    "Beauty",
    "Gaming",
    "Home & Kitchen",
    "Watches",
    "Health",
  ];

  return (
    <div className="category-menu">
      {categories.map((cat, idx) => (
        <button key={idx} className="category-btn">
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
