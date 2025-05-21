import { useState } from "react";
import "./Styles/ContactSeller.css";

const ContactSeller = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.name && form.email && form.message) {
      // You can handle sending logic here (e.g., API call)
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="contact-seller">
      <h2>Contact Seller</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message to the seller..."
          rows="4"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Message</button>
        {submitted && <span className="success-msg">Message sent successfully ✅</span>}
      </form>
    </div>
  );
};

export default ContactSeller;
