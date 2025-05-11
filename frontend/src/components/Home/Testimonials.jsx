import "./Styles/Testimonials.css";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import user1 from "../../assets/react.svg";
import user2 from "../../assets/react.svg";
import user3 from "../../assets/react.svg";
import user4 from "../../assets/react.svg";
import user5 from "../../assets/react.svg";
import user6 from "../../assets/react.svg";
import user7 from "../../assets/react.svg";
import user8 from "../../assets/react.svg";

const allTestimonials = [
  { name: "Ava Johnson", feedback: "Absolutely amazing service!", image: user1 },
  { name: "Liam Martinez", feedback: "Great quality, fast shipping!", image: user2 },
  { name: "Sophia Kim", feedback: "Exceeded my expectations!", image: user3 },
  { name: "Noah Williams", feedback: "Highly recommend to everyone!", image: user4 },
  { name: "Olivia Brown", feedback: "Superb experience overall!", image: user5 },
  { name: "Ethan Lee", feedback: "Fantastic product, worth every penny!", image: user6 },
  { name: "Isabella White", feedback: "Will definitely buy again!", image: user7 },
  { name: "Mason Clark", feedback: "This changed my life, honestly!", image: user8 },
  { name: "Emma Rodriguez", feedback: "Five stars all the way!", image: user3 },
  { name: "Lucas Anderson", feedback: "Best customer support ever!", image: user1 },
  { name: "Mia Walker", feedback: "Quick delivery and top quality!", image: user5 },
  { name: "Elijah Scott", feedback: "Can’t stop recommending this!", image: user2 },
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