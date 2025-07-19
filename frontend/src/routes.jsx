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


import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import DashboardHome from "./components/DashBoard/DashboardHome.jsx";
// import Orders from "./components/DashBoard/Orders.jsx";
// import Wishlist from "./components/DashBoard/Wishlist.jsx";
// import Messages from "./components/DashBoard/Messages.jsx";
// import Profile from "./components/DashBoard/Profile.jsx";
// import AddressBook from "./components/DashBoard/AddressBook.jsx";
// import Disputes from "./components/DashBoard/Disputes.jsx";
// import Payments from "./components/DashBoard/Payments.jsx";
// import Security from "./components/DashBoard/Security.jsx";


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

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <BuyerDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        {/* <Route path="orders" element={<Orders />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="addresses" element={<AddressBook />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="payments" element={<Payments />} />
        <Route path="security" element={<Security />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
