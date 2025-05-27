import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaUserTag,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import LocationPicker from "./LocationPicker/LocationPicker";
import "./Styles/SignupForm.css";

const SignupForm = ({ selectedRole = "buyer" }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    role: selectedRole,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLocationChange = (loc) => {
    const locationString = `${loc.country} > ${loc.state} > ${loc.city}`;
    setFormData((prev) => ({ ...prev, location: locationString }));
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/users/signup", formData);
      setMessage(res.data.message || "Signup successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        location: "",
        role: selectedRole,
      });
      setErrors({});
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Signup failed. Please try again."
      );
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
            onChange={handleChange}
            value={formData.username}
            required
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
            onChange={handleChange}
            value={formData.email}
            required
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
            onChange={handleChange}
            value={formData.password}
            required
            autoComplete="new-password"
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <small className="error-text">{errors.password}</small>}

        <div className="input-wrapper">
          {/* <FaMapMarkerAlt className="input-icon" /> */}
          <div className="location-section">
            <LocationPicker onChange={handleLocationChange} />
            <small>Selected: {formData.location || "None"}</small>
          </div>
        </div>
        {errors.location && <small className="error-text">{errors.location}</small>}

        <div className="input-wrapper">
          <FaUserTag className="input-icon" />
          <select
            name="role"
            onChange={handleChange}
            value={formData.role}
            className="select-field"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        {formData.role === "seller" && (
          <small className="role-tip">
            As a seller, you’ll be able to list and manage your products.
          </small>
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
