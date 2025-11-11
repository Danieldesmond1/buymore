import { useState } from "react";
import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SellerShop = ({ userData }) => {
  const [formData, setFormData] = useState({
    shop_name: "",
    shop_handle: "",
    tagline: "",
    shop_description: "",
    store_type: "",
    banner_image: null,
    logo_image: null,
    business_address: "",
    estimated_shipping_time: "",
    return_policy: "",
    chat_enabled: true,
    social_links: "",
    verification_docs: null,
    preferred_language: "",
    seo_keywords: "",
    welcome_message: "",
    auto_reply: "",
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [verificationPreview, setVerificationPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (files.length > 0) {
        const file = files[0];
        setFormData((prev) => ({ ...prev, [name]: file }));

        if (name === "banner_image") setBannerPreview(URL.createObjectURL(file));
        if (name === "logo_image") setLogoPreview(URL.createObjectURL(file));
        if (name === "verification_docs") setVerificationPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation can be added here...

    setLoading(true);
    setMessage("");

    try {
      const submitData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      }
      submitData.append("userId", userData.userId || userData.id);

      const res = await axios.post(`${API_BASE}/api/users/sellerShop`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Shop created successfully!");
      // Redirect or next steps here
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create shop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-shop-container">
      <h2>Create your shop</h2>
      <form onSubmit={handleSubmit}>

        <input
          name="shop_name"
          type="text"
          placeholder="Shop Name"
          value={formData.shop_name}
          onChange={handleChange}
          required
        />

        <input
          name="shop_handle"
          type="text"
          placeholder="Shop Handle (unique)"
          value={formData.shop_handle}
          onChange={handleChange}
          required
        />

        <input
          name="tagline"
          type="text"
          placeholder="Shop Tagline"
          value={formData.tagline}
          onChange={handleChange}
        />

        <textarea
          name="shop_description"
          placeholder="Shop Description"
          value={formData.shop_description}
          onChange={handleChange}
          rows={4}
          required
        />

        <input
          name="store_type"
          type="text"
          placeholder="Store Type (e.g., Electronics, Fashion)"
          value={formData.store_type}
          onChange={handleChange}
        />

        <div>
          <label>Banner Image:</label><br />
          <input type="file" accept="image/*" name="banner_image" onChange={handleChange} />
          {bannerPreview && <img src={bannerPreview} alt="Banner Preview" style={{ width: "100%", maxHeight: 150, objectFit: "cover" }} />}
        </div>

        <div>
          <label>Logo Image:</label><br />
          <input type="file" accept="image/*" name="logo_image" onChange={handleChange} />
          {logoPreview && <img src={logoPreview} alt="Logo Preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }} />}
        </div>

        <input
          name="business_address"
          type="text"
          placeholder="Business Address"
          value={formData.business_address}
          onChange={handleChange}
        />

        <input
          name="estimated_shipping_time"
          type="text"
          placeholder="Estimated Shipping Time"
          value={formData.estimated_shipping_time}
          onChange={handleChange}
        />

        <textarea
          name="return_policy"
          placeholder="Return Policy"
          value={formData.return_policy}
          onChange={handleChange}
          rows={3}
        />

        <label>
          <input
            type="checkbox"
            name="chat_enabled"
            checked={formData.chat_enabled}
            onChange={handleChange}
          />
          Enable Chat Support
        </label>

        <input
          name="social_links"
          type="text"
          placeholder="Social Links (comma separated)"
          value={formData.social_links}
          onChange={handleChange}
        />

        <div>
          <label>Verification Documents:</label><br />
          <input
            type="file"
            accept="image/*,application/pdf"
            name="verification_docs"
            onChange={handleChange}
          />
          {verificationPreview && (
            <img
              src={verificationPreview}
              alt="Verification Preview"
              style={{ width: 150, height: 150, objectFit: "cover" }}
            />
          )}
        </div>

        <input
          name="preferred_language"
          type="text"
          placeholder="Preferred Language"
          value={formData.preferred_language}
          onChange={handleChange}
        />

        <input
          name="seo_keywords"
          type="text"
          placeholder="SEO Keywords (comma separated)"
          value={formData.seo_keywords}
          onChange={handleChange}
        />

        <textarea
          name="welcome_message"
          placeholder="Welcome Message"
          value={formData.welcome_message}
          onChange={handleChange}
          rows={3}
        />

        <textarea
          name="auto_reply"
          placeholder="Auto Reply Message"
          value={formData.auto_reply}
          onChange={handleChange}
          rows={3}
        />

        {message && <p className={`message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating Shop..." : "Create Shop"}
        </button>
      </form>
    </div>
  );
};

export default SellerShop;
