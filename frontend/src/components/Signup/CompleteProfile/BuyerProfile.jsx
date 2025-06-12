import { useState } from "react";
import axios from "axios";

const BuyerProfile = ({ userData }) => {
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null); // file object
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection and show preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bio.trim()) {
      setMessage("Please enter a bio.");
      return;
    }
    if (!profileImage) {
      setMessage("Please upload a profile image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("profile_image", profileImage);
      formData.append("userId", userData.userId || userData.id); // adjust depending on backend response

      const res = await axios.post("/api/users/buyerProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setMessage(res.data.message || "Profile updated successfully!");
      // Optionally redirect user to dashboard/login after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-profile-container">
      <h2>Tell us about yourself</h2>
      <form onSubmit={handleSubmit}>

        <textarea
          name="bio"
          placeholder="Write a short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          required
        />

        <div>
          <label>Upload Profile Image:</label><br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {preview && (
          <div style={{ marginTop: "10px" }}>
            <img src={preview} alt="Profile Preview" style={{ width: 150, height: 150, objectFit: "cover", borderRadius: "50%" }} />
          </div>
        )}

        {message && <p className={`message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

export default BuyerProfile;
