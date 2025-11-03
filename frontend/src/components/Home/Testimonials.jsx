import "./Styles/Testimonials.css";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import user1 from "../../assets/aiony-haust-unsplash.jpg";
import user2 from "../../assets/ayo-ogunseinde-unsplash.jpg";
import user3 from "../../assets/charlesdeluvio-unsplash.jpg";
import user4 from "../../assets/cord-allman-unsplash.jpg";
import user5 from "../../assets/ibrahima-toure-unsplash.jpg";
import user6 from "../../assets/joseph-gonzalez-unsplash.jpg";
import user7 from "../../assets/kingsley-osei-abrah-unsplash.jpg";
import user8 from "../../assets/kirill-balobanov-unsplash.jpg";
import user9 from "../../assets/michael-dam-unsplash.jpg";
import user10 from "../../assets/romello-morris-unsplash.jpg";
import user11 from "../../assets/taylor-unsplash.jpg";
import user12 from "../../assets/the-connected-narrative-unsplash.jpg";
import user13 from "../../assets/yusuf-shamsudeen-unsplash.jpg";

const allTestimonials = [
  { name: "aiony Johnson", feedback: "Absolutely amazing service!", image: user1 },
  { name: "ayo ogunseinde", feedback: "Great quality, fast shipping!", image: user2 },
  { name: "charles deluvio", feedback: "Exceeded my expectations!", image: user3 },
  { name: "Noah allman", feedback: "Highly recommend to everyone!", image: user4 },
  { name: "ibrahima toure", feedback: "Superb experience overall!", image: user5 },
  { name: "joseph gonzalez", feedback: "Fantastic product, worth every penny!", image: user6 },
  { name: "kingsley osei", feedback: "Will definitely buy again!", image: user7 },
  { name: "kirill balobanov", feedback: "This changed my life, honestly!", image: user8 },
  { name: "michael Rodriguez", feedback: "Five stars all the way!", image: user9 },
  { name: "romello morris", feedback: "Best customer support ever!", image: user10 },
  { name: "taylor Walker", feedback: "Quick delivery and top quality!", image: user11 },
  { name: "Elijah Scott", feedback: "Can’t stop recommending this!", image: user12 },
  { name: "yusuf shamsudeen", feedback: "wow I'll recommend y'll use BuyMore!", image: user13 },
];

const getRandomTestimonials = () => {
  const shuffled = allTestimonials.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8); // Get 8 random testimonials
};

const Testimonials = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const [testimonials, setTestimonials] = useState(getRandomTestimonials());
  const [currentSet, setCurrentSet] = useState(0);
  const [fadeIndex, setFadeIndex] = useState(0);
  const totalSets = Math.ceil(testimonials.length / 4);

  useEffect(() => {
    // Cycle through individual testimonials within the current set
    const fadeInterval = setInterval(() => {
      setFadeIndex((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(fadeInterval);
  }, [currentSet]);

  useEffect(() => {
    // Move to the next set after all four have changed
    const slideInterval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % totalSets);
      setFadeIndex(0);
    }, 12000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
  <section ref={ref} className={`testimonials ${inView ? "active" : ""}`}>
    <div className="testimonial-header">
      <h2 className="scroll-reveal active">
        <span className="highlight">What Our</span> Customers Say
      </h2>
      <p className="sub-heading">Real experiences from our satisfied clients worldwide.</p>
      <div className="underline"></div>
    </div>

    <div className="testimonial-container">
      <div className="testimonial-slider" style={{ transform: `translateX(-${currentSet * 100}%)` }}>
        {Array.from({ length: totalSets }).map((_, setIndex) => (
          <div key={setIndex} className="testimonial-group">
            {testimonials.slice(setIndex * 4, setIndex * 4 + 4).map((testimonial, index) => (
              <div key={testimonial.name} className={`testimonial-card ${index === fadeIndex ? "fade-in" : ""}`}>
                <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
                <p>"{testimonial.feedback}"</p>
                <h3>- {testimonial.name}</h3>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>

  );
};

export default Testimonials;