import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StoreFront from "./pages/StoreFront.jsx";
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from "./pages/Cart.jsx";
import SignupPage from "./pages/Signup.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<StoreFront />} />
      <Route path="/products" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<SignupPage />} />
    </Routes>
  );
};

export default AppRoutes;
