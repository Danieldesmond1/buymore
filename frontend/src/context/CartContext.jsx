import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCartItems(data.cart || []);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

const addToCart = async (userId, product, showToast = () => {}) => {
  if (!product || !product.id) {
    console.error("Invalid product:", product);
    showToast("Invalid product data", "error");
    return;
  }

  try {
    const res = await fetch("/api/cart/add", {
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
    } else {
      showToast(data.message || "Error adding to cart", "error");
    }
  } catch (error) {
    console.error(error);
    showToast("Server error", "error");
  }
};


  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
