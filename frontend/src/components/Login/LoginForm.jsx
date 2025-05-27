import { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Styles/LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();


  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      setMessage("");

      try {
        const res = await axios.post("/api/users/signin", formData);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        login(res.data.user); // This comes from AuthContext


        setMessage(res.data.message || "Login successful!");

        // Redirect example after 1 second delay
        setTimeout(() => {
          window.location.href = "/"; // change as needed
        }, 1000);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Login failed. Please check your credentials."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h2 className="login-title">Login to Your Account</h2>

        <div className="login-input-wrapper">
          <FaEnvelope className="login-input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="login-input"
          />
        </div>
        {errors.email && <small className="login-error-text">{errors.email}</small>}

        <div className="login-input-wrapper">
          <FaLock className="login-input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="login-input"
          />
          <span
            className="login-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <small className="login-error-text">{errors.password}</small>}

        {message && (
          <p
            className={`login-message ${
              message.toLowerCase().includes("success") ? "login-success" : "login-error"
            }`}
          >
            {message}
          </p>
        )}

        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-signup-prompt">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
