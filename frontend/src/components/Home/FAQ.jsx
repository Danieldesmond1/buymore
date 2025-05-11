import "./Styles/FAQ.css";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const FAQ = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView) {
      setAnimate(true);
    } else {
      setAnimate(false); // Reset animation when out of view
    }
  }, [inView]);

  const faqItems = [
    { question: "What is the return policy?", answer: "You can return products within 30 days for a full refund." },
    { question: "How long does shipping take?", answer: "Shipping typically takes 5-7 business days." },
    { question: "Do you offer international shipping?", answer: "Yes, we ship internationally to most countries." },
  ];

  return (
    <section ref={ref} className="faq">
      <h2 className={animate ? "fade-in" : ""}>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div key={index} className={`faq-item ${animate ? "show" : ""}`} style={{ animationDelay: `${index * 1}s` }}>
            <h3 className={`faq-question ${animate ? "slide-left" : ""}`}>{item.question}</h3>
            <p className={`faq-answer ${animate ? "slide-right" : ""}`}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
