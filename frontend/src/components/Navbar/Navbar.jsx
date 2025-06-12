import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Navbar/SearchBar.jsx";
import ThemeToggle from "../Navbar/ThemeToggle.jsx";
import { FaOpencart, FaShopify } from "react-icons/fa";
import { RiHomeSmileFill } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";
import { FaStoreAlt } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import Toast from "../Toast/Toast";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

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

  // ✅ Total cart quantity
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

          {user ? (
            user.role === "buyer" ? (
              <li>
                <button onClick={() => handleProtectedClick("/stores")} className="nav-btn">
                  Stores <FaStoreAlt />
                </button>
              </li>
            ) : (
              <li>
                <button onClick={() => handleProtectedClick("/top-sellers")} className="nav-btn">
                  Top Sellers <FaChartLine />
                </button>
              </li>
            )
          ) : null}


          {/* ✅ Cart Icon with Badge */}
          <li className="cart-icon-wrapper">
            <button onClick={() => handleProtectedClick("/cart")} className="nav-btn">
              <span className="cart-label">Cart</span> 
              {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
              <FaOpencart />
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
              <button className="nav-btn user-btn" aria-haspopup="true" aria-expanded="false">
                {user.photoURL && (
                  <img src={user.photoURL} alt="Profile" className="profile-avatar" />
                )}
                {user.displayName || "Account"} ⌄
              </button>

              <ul className="dropdown-menu">
                {/* Buyer View */}
                {user.role === "buyer" && (
                  <>
                    <li>
                      <Link to="/buyer/dashboard" onClick={closeMenu}>My Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
                    </li>
                    <li>
                      <Link to="/saved-items" onClick={closeMenu}>Saved Items</Link>
                    </li>
                    <li>
                      <Link to="/orders" onClick={closeMenu}>Order History</Link>
                    </li>
                  </>
                )}

                {/* Seller View */}
                {user.role === "seller" && (
                  <>
                    <li>
                      <Link to="/seller/dashboard" onClick={closeMenu}>Seller Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/seller/products" onClick={closeMenu}>Manage Products</Link>
                    </li>
                    <li>
                      <Link to="/seller/create" onClick={closeMenu}>Add New Product</Link>
                    </li>
                    <li>
                      <Link to="/seller/orders" onClick={closeMenu}>Sales & Orders</Link>
                    </li>
                  </>
                )}

                {/* Logout */}
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

      {/* ✅ Global Toast Handler */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actions={toast.actions}
          onClose={() => setToast(null)}
        />
      )}
    </nav>
  );
};

export default Navbar;
