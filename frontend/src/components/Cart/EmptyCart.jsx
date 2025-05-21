import { FaShoppingCart } from 'react-icons/fa';
import './Styles/EmptyCart.css';

const EmptyCart = () => {
  return (
    <section className="empty-cart" role="region" aria-live="polite" aria-label="Empty shopping cart">
      <FaShoppingCart className="empty-cart__icon" aria-hidden="true" />
      <h2 className="empty-cart__title" tabIndex={0}>Your cart is empty</h2>
      <p className="empty-cart__text">
        Looks like you haven't added anything to your cart yet.
      </p>
      <a href="/" className="empty-cart__shop-link" aria-label="Continue shopping">
        ← Continue Shopping
      </a>
    </section>
  );
};

export default EmptyCart;
