import { useState } from "react";
import "./Styles/CategorySidebar.css";

const CategorySidebar = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (section, value) => {
    setFilters((prev) => {
      const exists = prev[section].includes(value);
      return {
        ...prev,
        [section]: exists
          ? prev[section].filter((item) => item !== value)
          : [...prev[section], value],
      };
    });
  };

  const renderCheckbox = (section, label, colorBox = false) => (
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={filters[section].includes(label)}
        onChange={() => handleChange(section, label)}
      />
      {colorBox && <span className="color-box" style={{ background: label }}></span>}
      <span>{label}</span>
    </label>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(true)}
      >
        Show Filters ☰
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`category-sidebar ${isOpen ? "open" : ""}`}>
        <button
          className="close-sidebar-btn"
          onClick={() => setIsOpen(false)}
        >
          ✖ Close
        </button>

        {/* PRICE */}
        <div className="filter-section">
          <h3>Price</h3>
          {renderCheckbox("price", "Under $50")}
          {renderCheckbox("price", "$50 - $100")}
          {renderCheckbox("price", "$100 - $200")}
          {renderCheckbox("price", "$200 & Above")}
        </div>

        {/* BRAND */}
        <div className="filter-section">
          <h3>Brand</h3>
          {renderCheckbox("brand", "Apple")}
          {renderCheckbox("brand", "Samsung")}
          {renderCheckbox("brand", "Nike")}
          {renderCheckbox("brand", "Gucci")}
          {renderCheckbox("brand", "HP")}
        </div>

        {/* RATING */}
        <div className="filter-section">
          <h3>Customer Rating</h3>
          {renderCheckbox("rating", "★★★★☆ & up")}
          {renderCheckbox("rating", "★★★☆☆ & up")}
          {renderCheckbox("rating", "★★☆☆☆ & up")}
        </div>

        {/* AVAILABILITY */}
        <div className="filter-section">
          <h3>Availability</h3>
          {renderCheckbox("availability", "In Stock")}
          {renderCheckbox("availability", "Out of Stock")}
        </div>

        {/* COLOR */}
        <div className="filter-section">
          <h3>Color</h3>
          {renderCheckbox("color", "black", true)}
          {renderCheckbox("color", "white", true)}
          {renderCheckbox("color", "red", true)}
          {renderCheckbox("color", "blue", true)}
          {renderCheckbox("color", "green", true)}
        </div>

        {/* CONDITION */}
        <div className="filter-section">
          <h3>Condition</h3>
          {renderCheckbox("condition", "New")}
          {renderCheckbox("condition", "Used")}
        </div>

        {/* DISCOUNTS */}
        <div className="filter-section">
          <h3>Discount</h3>
          {renderCheckbox("discount", "10% Off or more")}
          {renderCheckbox("discount", "20% Off or more")}
          {renderCheckbox("discount", "30% Off or more")}
          {renderCheckbox("discount", "50% Off or more")}
        </div>

        <div className="bottomSpace"><br /></div>
      </aside>
    </>
  );
};

export default CategorySidebar;
