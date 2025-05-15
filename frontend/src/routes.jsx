import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StoreFront from "./pages/StoreFront.jsx";
import ProductDetails from './pages/ProductDetails.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<StoreFront />} />
      <Route path="/products" element={<ProductDetails />} />

    </Routes>
  );
};

export default AppRoutes;
