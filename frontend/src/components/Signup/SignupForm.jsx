import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import LocationPicker from "./LocationPicker/LocationPicker";
import "./Styles/SignupForm.css";

const SignupForm = ({ selectedRole = "buyer", onSignupSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    role: selectedRole,
    bio: "",

    // seller-specific
    shop_name: "",
    shop_handle: "",
    tagline: "",
    shop_description: "",
    store_type: "",
    banner_image: "",
    logo_image: "",
    business_address: "",
    estimated_shipping_time: "",
    return_policy: "",
    chat_enabled: true,
    social_links: "",
    verification_docs: "",
    preferred_language: "",
    seo_keywords: "",
    welcome_message: "",
    auto_reply: "",
  });

  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shopHandleStatus, setShopHandleStatus] = useState(null);


  useEffect(() => {
    setForm((prev) => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email.";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckShopHandle = async () => {
  if (!form.shop_handle.trim()) return;

  try {
    const res = await axios.get(`/api/users/check-handle?handle=${form.shop_handle}`);
    setShopHandleStatus({ available: true, message: "Shop handle is available ✅" });
  } catch (err) {
    setShopHandleStatus({
      available: false,
      message: err.response?.data?.message || "Shop handle is taken ❌",
    });
  }
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLocationChange = (loc) => {
    const locationString = `${loc.country} > ${loc.state} > ${loc.city}`;
    setForm((prev) => ({ ...prev, location: locationString }));
    setErrors((prev) => ({ ...prev, location: "" }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  setMessage("");

  try {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    if (logoImage) {
      formData.append("logo_image", logoImage);
    }

    if (bannerImage) {
      formData.append("banner_image", bannerImage);
    }

    if (form.banner_image && typeof form.banner_image !== "string") {
      formData.append("banner_image", form.banner_image);
    }

    if (form.logo_image && typeof form.logo_image !== "string") {
      formData.append("logo_image", form.logo_image);
    }

    // ✅ Send signup request and let backend set the cookie
    const res = await axios.post("/api/users/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true, // ⬅️ required to accept HTTP-only cookies
    });

    // ✅ Get user data directly or via /me if needed
    const userData = res.data.user || res.data;

    // ✅ Update auth context (no localStorage for token!)
    login(userData);
    onSignupSuccess && onSignupSuccess(form.role, userData);

    setMessage(res.data.message || "Signup successful!");

    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);


    // ✅ Reset form
    setForm({
      username: "",
      email: "",
      password: "",
      location: "",
      role: selectedRole,
      bio: "",
      shop_name: "",
      shop_handle: "",
      tagline: "",
      shop_description: "",
      store_type: "",
      banner_image: "",
      logo_image: "",
      business_address: "",
      estimated_shipping_time: "",
      return_policy: "",
      chat_enabled: true,
      social_links: "",
      verification_docs: "",
      preferred_language: "",
      seo_keywords: "",
      welcome_message: "",
      auto_reply: "",
    });
    setProfileImage(null);
    setPreview(null);
    setErrors({});
  } catch (error) {
    console.error("Signup failed", error);
    setMessage(error.response?.data?.message || "Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit} className="signup-form" noValidate>
        <h2>Create Account</h2>

        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        {errors.username && <small className="error-text">{errors.username}</small>}

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        {errors.email && <small className="error-text">{errors.email}</small>}

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <span className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <small className="error-text">{errors.password}</small>}

        <div className="input-wrapper">
          <LocationPicker onChange={handleLocationChange} />
          <small>Selected: {form.location || "None"}</small>
        </div>
        {errors.location && <small className="error-text">{errors.location}</small>}

        <div className="input-wrapper">
          <FaUserTag className="input-icon" />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <textarea
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
        />

        <label className="upload-label">Upload Profile Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="profile-preview" />}

        {form.role === "seller" && (
          <>
            <h4 className="section-heading">🛍️ Seller Shop Details</h4>

            <div className="section-group">
              <h5 className="sub-section-title">🏷️ Brand Identity</h5>

              <div className="input-wrapper">
                <input
                  name="shop_name"
                  placeholder="Shop Name"
                  value={form.shop_name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper with-button">
                <input
                  name="shop_handle"
                  placeholder="Shop Handle"
                  value={form.shop_handle}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="check-btn"
                  onClick={handleCheckShopHandle}
                  disabled={!form.shop_handle.trim()}
                >
                  Check
                </button>
              </div>
              {shopHandleStatus && (
                <small
                  className={`status-text ${shopHandleStatus.available ? "available" : "taken"}`}
                >
                  {shopHandleStatus.message}
                </small>
              )}

              <div className="input-wrapper">
                <input
                  name="tagline"
                  placeholder="Tagline"
                  value={form.tagline}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <textarea
                  name="shop_description"
                  placeholder="Shop Description"
                  value={form.shop_description}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <input
                  name="store_type"
                  placeholder="Store Type"
                  value={form.store_type}
                  onChange={handleChange}
                />
              </div>

              <label className="upload-label">Upload Logo Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setLogoImage(file);
                  }}
                />

                {logoImage && (
                  <img
                    src={URL.createObjectURL(logoImage)}
                    alt="Logo Preview"
                    className="logo-preview"
                  />
                )}

              <label className="upload-label">Upload Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setBannerImage(file);
                  }}
                />

                {bannerImage && (
                  <img
                    src={URL.createObjectURL(bannerImage)}
                    alt="Banner Preview"
                    className="banner-preview"
                  />
                )}
            </div>

            <div className="section-group">
              <h5 className="sub-section-title">📍 Business Details</h5>

              <div className="input-wrapper">
                <input
                  name="business_address"
                  placeholder="Business Address"
                  value={form.business_address}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <input
                  name="estimated_shipping_time"
                  placeholder="Estimated Shipping Time"
                  value={form.estimated_shipping_time}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <textarea
                  name="return_policy"
                  placeholder="Return Policy"
                  value={form.return_policy}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <input
                  name="preferred_language"
                  placeholder="Preferred Language"
                  value={form.preferred_language}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <input
                  name="verification_docs"
                  placeholder="Verification Docs"
                  value={form.verification_docs}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="section-group">
              <h5 className="sub-section-title">⚙️ Store Settings</h5>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="chat_enabled"
                  checked={form.chat_enabled}
                  onChange={handleChange}
                />
                Enable Chat
              </label>

              <div className="input-wrapper">
                <input
                  name="social_links"
                  placeholder='Social Links (e.g. {"instagram": "...", "x": "..."})'
                  value={form.social_links}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <input
                  name="seo_keywords"
                  placeholder="SEO Keywords"
                  value={form.seo_keywords}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <textarea
                  name="welcome_message"
                  placeholder="Welcome Message"
                  value={form.welcome_message}
                  onChange={handleChange}
                />
              </div>

              <div className="input-wrapper">
                <textarea
                  name="auto_reply"
                  placeholder="Auto Reply"
                  value={form.auto_reply}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}


        {message && (
          <p className={`message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="login-prompt">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
