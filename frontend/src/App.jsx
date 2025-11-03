import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { PageLoaderProvider } from "./context/PageLoaderContext"; // ✅ import
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <PageLoaderProvider> {/* ✅ Wrap App */}
          <Router>
            <Navbar />
            <AppRoutes />
          </Router>
        </PageLoaderProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
