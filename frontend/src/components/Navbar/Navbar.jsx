import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../Navbar/SearchBar.jsx";
import ThemeToggle from "../Navbar/ThemeToggle.jsx"; // Import Theme Toggle
import { FaOpencart, FaShopify } from "react-icons/fa";
import { RiHomeSmileFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left Section: Logo + Search Bar */}
      <div className="navbar-left">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>BuyMore</Link>
        </div>
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Mobile Menu Button */}
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      {/* Right Section: Links + Theme Toggle */}
      <div className={`navbar-right ${isOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li><Link to="/" onClick={closeMenu}>Home <RiHomeSmileFill /></Link></li>
          <li><Link to="/shop" onClick={closeMenu}>Shop <FaShopify /></Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products <AiOutlineProduct /></Link></li>
          <li><Link to="/cart" onClick={closeMenu}>Cart <FaOpencart /></Link></li>
          <li><Link to="/login" onClick={closeMenu}>Login <CiLogin /></Link></li>
        </ul>
        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
