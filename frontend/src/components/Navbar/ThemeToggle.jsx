import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import "./Navbar.css"; // Create a separate CSS file for styling

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="theme-toggle"
    >
      {theme === "light" ? 
      <MdOutlineLightMode className="LightMode-icon" /> : 
      <MdDarkMode className="DarkMode-icon" />}
    </button>
  );
};

export default ThemeToggle;
