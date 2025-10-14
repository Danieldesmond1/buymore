import { FaShoppingCart } from "react-icons/fa";
import './Styles/CartHeader.css';

const formatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0,
});

const CartHeader = ({ cartItems = [] }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.001; // 0.1% tax rate
  const shippingFee = subtotal > 50000 ? 0 : 40; // Flat $20 shipping fee for orders under $50000
  const discount = 0;
  const totalAmount = subtotal + tax + shippingFee - discount;

  return (
    <div className="cart-header slide-in">
      <div className="cart-header__left">
        <FaShoppingCart className="cart-header__icon pulse" />
        <h1 className="cart-header__title">Your Shopping Cart</h1>
      </div>
      <div className="cart-header__right">
        <div className="cart-header__info">
          <span className="cart-header__total">
            Cart Total: {formatter.format(totalAmount)}
          </span>
          <a href="/" className="cart-header__link">← Continue Shopping</a>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
