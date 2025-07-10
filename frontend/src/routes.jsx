import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import StoreFront from "./pages/StoreFront.jsx";
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from "./pages/Cart.jsx";
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import StoreDirectoryPage from "./pages/BrowseStores.jsx";
import Storeshop from "./pages/StoreShop.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<StoreFront />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/stores" element={<StoreDirectoryPage />} />
      <Route path="/shop/:shopId" element={<Storeshop />} />
    </Routes>
  );
};

export default AppRoutes;
