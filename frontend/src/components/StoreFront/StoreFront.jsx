import { useState } from "react";
import CategoryMenu from "./CategoryMenu";
import ProductGrid from "./ProductGrid";

const StoreFront = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = (product) => {
    console.log("Adding to cart:", product);
    // Your add to cart logic here
  };

  return (
    <div>
      <CategoryMenu onSelectCategory={handleSelectCategory} />
      <ProductGrid selectedCategory={selectedCategory} addToCart={addToCart} />
    </div>
  );
};

export default StoreFront;
