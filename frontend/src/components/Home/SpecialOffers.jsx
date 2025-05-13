import "./Styles/SpecialOffer.css";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

const specialOffers = [
  {
    id: 1,
    title: "50% OFF on All Sneakers",
    description: "Get the latest sneakers at half price for the next 12 hours!",
    discount: "50% OFF",
    image: "/assets/sneakers.jpg",
    timeLimited: true,
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free – Watches",
    description: "For a limited time, buy one premium watch and get another FREE.",
    discount: "BOGO Deal",
    image: "/assets/watch.jpg",
    timeLimited: false,
  },
  {
    id: 3,
    title: "Exclusive 30% Discount on Laptops",
    description: "Upgrade your tech game with this special laptop discount.",
    discount: "30% OFF",
    image: "/assets/laptop.jpg",
    timeLimited: true,
  },
];

const SpecialOffers = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  const calculateTimeLeft = (hours) => {
    const now = new Date();
    const targetTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return targetTime;
  };

  const [timeLeft, setTimeLeft] = useState(
    specialOffers.map((offer) => ({
      id: offer.id,
      endTime: calculateTimeLeft(12),
      timeRemaining: {},
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) =>
        prevTimeLeft.map((offer) => {
          const now = new Date();
          const difference = offer.endTime - now;
          return {
            ...offer,
            timeRemaining: {
              hours: Math.floor(difference / (1000 * 60 * 60)),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            },
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="exclusive-offers">
      <h2 className={inView ? "fade-in-title" : ""}>🔥 Exclusive Special Offers</h2>
      <p className={inView ? "fade-in-description" : ""}>
        Unlock **limited-time deals** and **massive discounts** on top products!
      </p>

      <div className="offers-container">
        {specialOffers.map((offer, index) => {
          const timeLeftData = timeLeft.find((t) => t.id === offer.id)?.timeRemaining;

          return (
            <div key={offer.id} className={`offer-card ${inView ? "show-card" : ""}`} style={{ animationDelay: `${index * 0.3}s` }}>
              <img src={offer.image} alt={offer.title} className="offer-image" />
              <div className="offer-info">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <span className="offer-discount-badge">{offer.discount}</span>
                {offer.timeLimited && timeLeftData && (
                  <div className="offer-countdown-timer">
                    ⏳ Offer ends in: {timeLeftData.hours}h {timeLeftData.minutes}m {timeLeftData.seconds}s
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpecialOffers;
