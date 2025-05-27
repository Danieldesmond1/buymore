import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Navbar/SearchBar.jsx";
import ThemeToggle from "../Navbar/ThemeToggle.jsx";
import { FaOpencart, FaShopify } from "react-icons/fa";
import { RiHomeSmileFill } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import { useAuth } from "../../context/AuthContext";
import Toast from "../Toast/Toast";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleProtectedClick = (path) => {
    if (!user) {
      setToast({
        message: "Please log in to access this page.",
        type: "info",
        actions: [
          {
            label: "Log In",
            onClick: () => {
              setToast(null);
              navigate("/login");
              closeMenu();
            },
          },
          { label: "Cancel", onClick: () => setToast(null) },
        ],
      });
    } else {
      navigate(path);
      closeMenu();
    }
  };

  return (
    <nav className="navbar">
      {/* Left: Logo + Search */}
      <div className="navbar-left">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            BuyMore
          </Link>
        </div>
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      {/* Right: Nav Links + Theme Toggle */}
      <div className={`navbar-right ${isOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link to="/" onClick={closeMenu}>
              Home <RiHomeSmileFill />
            </Link>
          </li>

          <li>
            <button onClick={() => handleProtectedClick("/shop")} className="nav-btn">
              Shop <FaShopify />
            </button>
          </li>
          <li>
            <button onClick={() => handleProtectedClick("/products")} className="nav-btn">
              Products <AiOutlineProduct />
            </button>
          </li>
          <li>
            <button onClick={() => handleProtectedClick("/cart")} className="nav-btn">
              Cart <FaOpencart />
            </button>
          </li>

          {/* 👤 Login or User Dropdown */}
          {!user ? (
            <li>
              <Link to="/login" onClick={closeMenu}>
                Login <CiLogin />
              </Link>
            </li>
          ) : (
            <li className="user-dropdown">
              {/* Note: Removed onClick for dropdown toggle */}
              <button className="nav-btn user-btn" aria-haspopup="true" aria-expanded="false">
                {user.displayName || "Account"} ⌄
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="nav-btn logout-btn"
                    onClick={() => {
                      logout();
                      navigate("/");
                      closeMenu();
                      setToast({
                        message: "Logged out successfully.",
                        type: "success",
                      });
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          )}
        </ul>
        <ThemeToggle />
      </div>

      {/* Toast Message */}
      {toast && (
        <Toast message={toast.message} type={toast.type} actions={toast.actions} onClose={() => setToast(null)} />
      )}
    </nav>
  );
};

export default Navbar;