import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext"; // 👈 Import it
import './App.css';

const App = () => {
  return (
    <AuthProvider> {/* 👈 Wrap whole app */}
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
