import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add more routes here later */}
    </Routes>
  );
};

export default AppRoutes;
