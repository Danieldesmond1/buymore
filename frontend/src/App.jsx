import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // 👈 Import CartContext
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider> {/* 👈 Wrap the app */}
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
