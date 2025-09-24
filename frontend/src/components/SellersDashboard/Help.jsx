import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import "./styles/Help.css";

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I add a new product?",
      answer:
        "Go to the Products section in your dashboard and click 'Add Product'. Fill in the details, upload images, and save.",
    },
    {
      question: "How do I withdraw my earnings?",
      answer:
        "Earnings are automatically sent to your payout bank account based on your payout schedule. You can view payment history in the Payments section.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Use the Contact Support button below or email us at support@metron.com. Our team typically responds within 24 hours.",
    },
    {
      question: "How can I improve my store's visibility?",
      answer:
        "Enable promotions in the Marketing section, add clear product photos, detailed descriptions, and offer free shipping where possible.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-container">
      <h2 className="help-title">Help & Support</h2>
      <p className="help-subtitle">
        Get answers to common questions or contact our support team.
      </p>

      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-header">
              <span>{faq.question}</span>
              <IoChevronDownOutline
                className={`faq-icon ${openIndex === index ? "rotated" : ""}`}
              />
            </div>
            <div className="faq-body">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="contact-support">
        <h3>Need more help?</h3>
        <p>Can't find your answer? Reach out to our support team directly.</p>
        <button className="contact-btn">Contact Support</button>
      </div>
    </div>
  );
};

export default Help;
