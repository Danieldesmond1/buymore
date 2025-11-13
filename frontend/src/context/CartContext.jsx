import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false); // 👈 Add this
  const { user } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ✅ Load user cart automatically when logged in or refreshed
  useEffect(() => {
    const fetchUserCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/cart/${user.id}`);
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        setCartItems(data.cart || []);
      } catch (err) {
        console.error("Error loading user cart:", err);
      }
    };

    fetchUserCart();
  }, [user, API_BASE]);

  // ✅ Manual cart refresh
  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE}/api/cart/${userId}`);
      const text = await response.text();
      const data = JSON.parse(text);
      setCartItems(data.cart || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  // ✅ Add to Cart (with tooltip trigger)
  const addToCart = async (userId, product, showToast = () => {}) => {
    if (!product || !product.id) {
      console.error("Invalid product:", product);
      showToast("Invalid product data", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems((prev) => [...prev, product]);
        showToast(`${product.name} added to cart ✅`, "success");

        // 👇 Trigger navbar tooltip
        setCartUpdated(true);
        setTimeout(() => setCartUpdated(false), 1500);
      } else {
        showToast(data.message || "Error adding to cart", "error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Server error", "error");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        fetchCart,
        cartUpdated, // 👈 Make this accessible
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
