import { useEffect, useState } from "react";
import axios from "axios";
import "./Styles/Wishlist.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get current user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/wishlist/user/${userId}`
        );
        setWishlistItems(res.data.wishlist);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Optional: Remove from wishlist
  const handleRemove = async (wishlistId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${wishlistId}`);
      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== wishlistId)
      );
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img
                src={item.image_url}
                alt={item.name}
                className="wishlist-img"
              />
              <div className="wishlist-details">
                <h4>{item.name}</h4>
                <p className="wishlist-price">${item.price}</p>
                <div className="wishlist-actions">
                  <button className="wishlist-btn add">Add to Cart</button>
                  <button
                    className="wishlist-btn remove"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
