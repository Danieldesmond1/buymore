// src/components/Cart/CartItemList.jsx
import CartItem from './CartItem';
import './Styles/CartItemList.css';

import iphone14promax from '../../assets/iphone14promax.jpg';  // import your actual images
import galaxyS22Ultra from '../../assets/1wrist-watch.jpg';
import macbookPro16 from '../../assets/2polo.jpg';

const cartItems = [
  {
    id: 1,
    name: 'Oraimo Bluetooth Earbuds with Long Battery Life and Clear Sound',
    image: iphone14promax,
    price: 12900,
    quantity: 2,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S22 Ultra - Phantom Black, 256GB',
    image: galaxyS22Ultra,
    price: 350000,
    quantity: 1,
  },
  {
    id: 3,
    name: 'Apple MacBook Pro 16-inch (2023) - Space Gray',
    image: macbookPro16,
    price: 1800000,
    quantity: 1,
  },
];

const CartItemList = () => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <section
        className="cart-empty"
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 tabIndex={0}>Your cart is empty.</h2>
        <p>Browse products and add items to your cart.</p>
      </section>
    );
  }

  return (
    <section
      className="cart-item-list"
      role="list"
      aria-label="Shopping cart items list"
      tabIndex={-1}
    >
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </section>
  );
};

export default CartItemList;
