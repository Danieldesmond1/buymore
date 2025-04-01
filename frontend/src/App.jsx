import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import AppRoutes from "./routes.jsx";
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
};

export default App;
