// Profile.jsx
import React, { useState } from "react";
import "./Styles/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "ebukadaniel",
    email: "ebuka@example.com",
    location: "Lagos, Nigeria",
    bio: "Tech entrepreneur and music lover.",
    profileImage: "/default-profile.png",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated!");
    // send to backend later
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-image-section">
          <img src={profile.profileImage} alt="Profile" />
          <input type="file" onChange={handleImageChange} />
        </div>

        <div className="profile-fields">
          <label>Username</label>
          <input type="text" name="username" value={profile.username} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />

          <label>Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleChange} />

          <label>Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} />

          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
