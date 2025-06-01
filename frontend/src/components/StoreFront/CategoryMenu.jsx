import "./Styles/StoreFront.css";

// Helper to capitalize each word (Title Case)
const capitalize = (str) =>
  str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const CategoryMenu = ({ onSelectCategory }) => {
  const categories = [
    "show all",
    "phones",
    "electronics",
    "fashion",
    "beauty",
    "gaming",
    "home & kitchen",
    "watches",
    "health",
  ];

  return (
    <div className="category-menu">
      {categories.map((cat, idx) => (
        <button
          key={idx}
          className="category-btn"
          onClick={() => {
            if (cat === "show all") {
              onSelectCategory(""); // reset filter
            } else {
              onSelectCategory(capitalize(cat));
            }
          }}
        >
          {capitalize(cat)}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
