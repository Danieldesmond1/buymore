// src/components/Cart/CartHeader.jsx
import { FaShoppingCart } from "react-icons/fa";
import './Styles/CartHeader.css';

const CartHeader = () => {
  // Simulated cart total (in real case, you'd get this from context/store)
  const totalAmount = 48320.00;

  return (
    <div className="cart-header slide-in">
      <div className="cart-header__left">
        <FaShoppingCart className="cart-header__icon pulse" />
        <h1 className="cart-header__title">Your Shopping Cart</h1>
      </div>
      <div className="cart-header__right">
        <div className="cart-header__info">
          <span className="cart-header__total">Cart Total: ₦{totalAmount.toLocaleString()}</span>
          <a href="/" className="cart-header__link">← Continue Shopping</a>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
