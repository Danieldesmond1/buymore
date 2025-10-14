import CartHeader from '../components/Cart/CartHeader';
import CartPage from "../components/Cart/CartPage";
import CartSummary from '../components/Cart/CartSummary';
// import PromoCodeForm from '../components/Cart/PromoCodeForm';
import RelatedProducts from '../components/Cart/RelatedProducts';
// import StickyCheckoutBar from '../components/Cart/StickyCheckoutBar';
import EmptyCart from '../components/Cart/EmptyCart';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      const res = await fetch(`/api/cart/${user.id}`);
      const data = await res.json();
      if (res.ok) setCartItems(data.cart);
    };
    fetchCart();
  }, [user]);

  if (!cartItems || cartItems.length === 0) return <EmptyCart />;

  return (
    <>
      <CartHeader cartItems={cartItems} />
      <CartPage cartItems={cartItems} setCartItems={setCartItems} />
      <CartSummary cartItems={cartItems} />
      {/* <PromoCodeForm /> */}
      <RelatedProducts />
      {/* <StickyCheckoutBar /> */}
    </>
  );
};

export default Cart;
