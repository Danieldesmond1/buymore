import { useEffect, useState } from "react";
import "./Styles/StoreFront.css";

import bannerImage from "../../assets/store_image_banner.png";
import bannerImage1 from "../../assets/store_image_banner.png";
import bannerImage2 from "../../assets/store_image_banner.png";
import bannerImage3 from "../../assets/store_image_banner.png";

// import xmasBanner from "../../assets/xmas-banner.jpg";
// import ramadanBanner from "../../assets/ramadan-banner.jpg";
// import blackFridayBanner from "../../assets/black-friday.jpg";

const StoreBanner = () => {
  const seasonalBanners = [bannerImage1, bannerImage2, bannerImage3];

  const getSeasonalImage = () => {
    const month = new Date().getMonth();
    if (month === 11) return bannerImage1;
    if (month === 3) return bannerImage2;
    if (month === 10) return bannerImage3;
    return null;
  };

  const [currentBanner, setCurrentBanner] = useState(bannerImage);

  useEffect(() => {
    const seasonal = getSeasonalImage();
    if (!seasonal) return;

    let banners = [bannerImage, seasonal];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % banners.length;
      setCurrentBanner(banners[index]);
    }, 5000); // switch every 5s

    return () => clearInterval(interval);
  }, []);

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
            <input type="text" placeholder="Search for products, categories..." />
            <button>Search</button>
          </div>

          <button className="shop-now-btn">Shop Now</button>
        </div>
      </div>
    </section>
  );
};

export default StoreBanner;