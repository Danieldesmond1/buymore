import { useEffect, useRef, useState } from "react";
import { FiSearch, FiBell, FiCalendar, FiPlus, FiHelpCircle, FiMenu } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import "./styles/Topbar.css";

export default function Topbar({ onSearch, onAddProduct, onMenuClick }) {
  const [query, setQuery] = useState("");
  const [notifCount] = useState(3); // mock badge
  const inputRef = useRef(null);

  // Keyboard: "/" focuses search, "Ctrl/Cmd+K" also focuses search
  useEffect(() => {
    const handler = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      const inTypingField = tag === "input" || tag === "textarea";
      if (!inTypingField && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile menu button placeholder (hook into Sidebar toggle later) */}
        <button
          className="tb-btn hide-desktop"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <FiMenu />
        </button>

        {/* Search */}
        <form className="search-wrap" onSubmit={handleSubmit} role="search" aria-label="Dashboard search">
          <FiSearch className="search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            type="search"
            placeholder="Search orders, products, customers…"
            aria-label="Search"
          />
          <kbd className="slash-kbd">/</kbd>
        </form>
      </div>

      <div className="topbar-right">
        {/* Date range (stub) */}
        <button className="tb-btn">
          <FiCalendar />
          <span>This Month</span>
        </button>

        {/* Quick action */}
        {/* <button className="tb-btn primary" onClick={onAddProduct}>
          <FiPlus />
          <span>Add Product</span>
        </button> */}

        {/* Notifications */}
        <button className="tb-btn icon-only" aria-label="Notifications">
          <FiBell />
          {notifCount > 0 && <span className="badge" aria-label={`${notifCount} new notifications`} />}
        </button>

        {/* Help */}
        <button className="tb-btn icon-only" aria-label="Help & Support">
          <FiHelpCircle />
        </button>

        {/* Account */}
        <button className="tb-avatar" aria-label="Account">
          <CiUser />
        </button>
      </div>
    </header>
  );
}
