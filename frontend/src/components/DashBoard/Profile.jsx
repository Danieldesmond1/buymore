import { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/Profile.css";

const Profile = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    location: "",
    bio: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const user = res.data.user;

        setProfile({
          username: user.username || "",
          email: user.email || "",
          location: user.location || "",
          bio: user.bio || "",
          profile_image: user.profile_image || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("location", profile.location);
      formData.append("bio", profile.bio);
      if (profile.password) formData.append("password", profile.password);
      if (profile.profile_image_file)
        formData.append("profile_image", profile.profile_image_file);

      const res = await axios.put(`${API_BASE}/api/profile`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated!");

      setProfile((prev) => ({
        ...prev,
        profile_image: res.data.user.profile_image,
      }));
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Update failed.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-image-section">
          <img
            src={
              profile.profile_image?.startsWith("http")
                ? profile.profile_image
                : `${API_BASE}${profile.profile_image}`
            }
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ccc",
              marginBottom: "10px",
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                profile_image_file: e.target.files[0],
              }))
            }
          />
        </div>

        <div className="profile-fields">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />

          <label>Email</label>
          <input type="email" value={profile.email} disabled />

          <label>New Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
          />

          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
