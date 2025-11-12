import CartHeader from '../components/Cart/CartHeader';
import CartPage from "../components/Cart/CartPage";
import CartSummary from '../components/Cart/CartSummary';
import RelatedProducts from '../components/Cart/RelatedProducts';
import EmptyCart from '../components/Cart/EmptyCart';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cart/${user.id}`);
        if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
        const data = await res.json();
        setCartItems(data.cart);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [user]);

  if (!cartItems || cartItems.length === 0) return <EmptyCart />;

  return (
    <>
      <CartHeader cartItems={cartItems} />
      <CartPage cartItems={cartItems} setCartItems={setCartItems} />

      {/* ✅ Pass user prop here */}
      <CartSummary cartItems={cartItems} user={user} />

      <RelatedProducts />
    </>
  );
};

export default Cart;
