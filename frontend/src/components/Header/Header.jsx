import Navbar from "./Navbar";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <Navbar />
      <div className="hero">
        <h1>Welcome to BuyMore</h1>
        <p>Find the best products at unbeatable prices!</p>
        <a href="/products" className="btn">Shop Now</a>
      </div>
    </header>
  );
};

export default Header;
