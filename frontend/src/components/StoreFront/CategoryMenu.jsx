import { useState } from "react";
import "./Styles/StoreFront.css";

// Helper to capitalize each word (Title Case)
const capitalize = (str) =>
  str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const CategoryMenu = ({ onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Mobile toggle button */}
      <button
        className="category-toggle-btn"
        onClick={() => setIsOpen(true)}
      >
        Show Categories ☰
      </button>

      {/* Overlay */}
      <div
        className={`category-overlay ${isOpen ? "show" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`category-menu ${isOpen ? "open" : ""}`}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className="category-btn"
            onClick={() => {
              setIsOpen(false); // close menu after selection
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
    </>
  );
};

export default CategoryMenu;
