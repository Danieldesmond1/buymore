import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // ✅ get user from context
import "./Styles/Wishlist.css";

const Wishlist = () => {
  const { user } = useAuth(); // ✅ logged-in user
  const [wishlistItems, setWishlistItems] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`${API_BASE}/api/wishlist/user/${user.id}`, {
          withCredentials: true,
        });
        setWishlistItems(Array.isArray(res.data.wishlist) ? res.data.wishlist : []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user?.id, API_BASE]);

  // Remove item from wishlist
  const handleRemove = async (wishlistId) => {
    try {
      await axios.delete(`${API_BASE}/api/wishlist/${wishlistId}`, {
        withCredentials: true,
      });
      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
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
          {wishlistItems.map((item) => {
            // ✅ Handle possible missing image
            const imageUrl =
              item.image_url?.startsWith("http") 
                ? item.image_url 
                : `${API_BASE}${item.image_url || "/fallback.jpg"}`;

            return (
              <div key={item.id} className="wishlist-card">
                <img src={imageUrl} alt={item.name || "Product"} className="wishlist-img" />
                <div className="wishlist-details">
                  <h4>{item.name || "Unnamed Product"}</h4>
                  <p className="wishlist-price">${item.price?.toFixed(2) || "0.00"}</p>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
