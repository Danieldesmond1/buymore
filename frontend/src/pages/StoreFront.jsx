import StoreBanner from "../components/StoreFront/StoreBanner.jsx";
import CategoryMenu from "../components/StoreFront/CategoryMenu.jsx";
// import CategorySidebar from "../components/StoreFront/CategorySidebar.jsx";
import ProductGrid from "../components/StoreFront/ProductGrid.jsx";
import Footer from "../components/Footer/Footer.jsx";

const StoreFront = () => {
  return (
    <>
      <StoreBanner />
      <CategoryMenu />
      {/* <CategorySidebar /> */}
      <ProductGrid />
      <Footer />
    </>
  );
};

export default StoreFront;
