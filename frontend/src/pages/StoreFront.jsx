import { useState } from "react";
import StoreBanner from "../components/StoreFront/StoreBanner.jsx";
import CategoryMenu from "../components/StoreFront/CategoryMenu.jsx";
import CategorySidebar from "../components/StoreFront/CategorySidebar.jsx";
import ProductGrid from "../components/StoreFront/ProductGrid.jsx";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer/Footer.jsx";

const StoreFront = () => {
  const { addToCart } = useCart();
  
  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handler to update selected category
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <StoreBanner />
      <CategoryMenu onSelectCategory={handleSelectCategory} />
      <CategorySidebar />
      <ProductGrid addToCart={addToCart} selectedCategory={selectedCategory} />
      <Footer />
    </>
  );
};

export default StoreFront;
