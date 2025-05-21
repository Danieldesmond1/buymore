import { useEffect, useState } from "react";
import axios from "axios";
import LocationPicker from "./LocationPicker/LocationPicker";

const SignupForm = ({ selectedRole = "buyer" }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    role: selectedRole,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (loc) => {
    const locationString = `${loc.country} > ${loc.state} > ${loc.city}`;
    setFormData((prev) => ({ ...prev, location: locationString }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username.trim()) return setMessage("Username is required");
    if (!validateEmail(formData.email)) return setMessage("Invalid email");
    if (formData.password.length < 6)
      return setMessage("Password must be at least 6 characters");
    if (!formData.location)
      return setMessage("Please select your location");

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/api/users/signup", formData);
      setMessage(res.data.message);
      setLoading(false);
      console.log("User signed up:", res.data.user);
      // Optionally reset form here
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || "Signup failed");
      console.error("Signup failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        value={formData.username}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password (min 6 chars)"
        onChange={handleChange}
        value={formData.password}
        required
      />

      <LocationPicker onChange={handleLocationChange} />

      <p>Selected location: {formData.location || "None"}</p>

      <select name="role" onChange={handleChange} value={formData.role}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
        {message}
      </p>
    </form>
  );
};

export default SignupForm;
