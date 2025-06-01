import { useState, useEffect } from "react";
import "./Styles/StoreFront.css";

import bannerImage from "../../assets/store_image_banner.png";

const StoreBanner = ({ onSearch }) => {
  const [currentBanner] = useState(bannerImage);
  const [searchQuery, setSearchQuery] = useState("");

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const countdownEnd = new Date().getTime() + 4 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countdownEnd - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Now use the passed in onSearch prop or fallback to alert
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      alert("Please enter a search term.");
      return;
    }

    if (typeof onSearch === "function") {
      onSearch(searchQuery.trim());
    } else {
      alert(`Searching for: "${searchQuery}" (placeholder action)`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section
      className="store-banner"
      style={{
        backgroundImage: `url(${currentBanner})`,
      }}
    >
      <div className="overlay">
        <div className="store-banner-content">
          <div className="promo-badge">🔥 Flash Sale</div>
          <h1>Unbeatable Deals Everyday</h1>
          <p>Shop top-rated products at the best prices. Limited-time offers!</p>

          <div className="countdown-timer">
            <span>Ends In:</span>
            <div className="timer-box">{String(timeLeft.hours).padStart(2, "0")}</div>:
            <div className="timer-box">{String(timeLeft.minutes).padStart(2, "0")}</div>:
            <div className="timer-box">{String(timeLeft.seconds).padStart(2, "0")}</div>
          </div>

          <div className="store-search">
            <input
              type="text"
              placeholder="Search for products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="Search products"
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <button className="shop-now-btn">Shop Now</button>
        </div>
      </div>
    </section>
  );
};

export default StoreBanner;
