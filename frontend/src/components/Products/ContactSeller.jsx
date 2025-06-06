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
      // Handle message send logic here
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="contact-seller">
      <h2 className="contact-title">Contact Seller</h2>
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
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Message</button>
        {submitted && <p className="success-msg">✅ Message sent successfully!</p>}
      </form>
    </section>
  );
};

export default ContactSeller;
