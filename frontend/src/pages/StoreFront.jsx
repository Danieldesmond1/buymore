import { useState } from "react";
import StoreBanner from "../components/StoreFront/StoreBanner.jsx";
import CategoryMenu from "../components/StoreFront/CategoryMenu.jsx";
import CategorySidebar from "../components/StoreFront/CategorySidebar.jsx";
import ProductGrid from "../components/StoreFront/ProductGrid.jsx";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer/Footer.jsx";

const StoreFront = () => {
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    price: [],
    brand: [],
    rating: [],
    availability: [],
    color: [],
    condition: [],
    discount: [],
  });

  return (
    <>
      <StoreBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={setSearchQuery}  // Add this line
      />
      <CategoryMenu onSelectCategory={setSelectedCategory} />
      <CategorySidebar filters={filters} setFilters={setFilters} />
      <ProductGrid
        addToCart={addToCart}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory} // <-- add this
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Footer />
    </>
  );
};

export default StoreFront;
