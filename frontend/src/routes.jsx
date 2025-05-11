import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StoreFront from "./pages/StoreFront.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<StoreFront />} />
    </Routes>
  );
};

export default AppRoutes;
