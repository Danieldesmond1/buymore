import "./Styles/ContactSeller.css";

const ContactSeller = () => {
  return (
    <div className="contact-seller">
      <h2>Contact Seller</h2>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your message to the seller..." rows="4" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactSeller;
