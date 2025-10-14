import { FaShippingFast, FaPercent, FaReceipt } from 'react-icons/fa';
import './Styles/CartSummary.css';

const formatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0,
});

const CartSummary = ({ cartItems = [] }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.001; // 0.1% tax rate
  const tax = subtotal * taxRate;
  const shippingFee = subtotal > 50000 ? 0 : 40; // Flat $20 shipping fee for orders under $50000
  const discount = 0;
  const total = subtotal + tax + shippingFee - discount;

  return (
    <aside className="cart-summary" aria-label="Order summary">
      <h2 className="cart-summary__title">
        <FaReceipt className="icon" /> Order Summary
      </h2>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>{formatter.format(subtotal)}</span>
        </div>

        <div className="cart-summary__row">
          <span>
            <FaPercent className="icon" /> Tax (0.1%)
          </span>
          <span>{formatter.format(tax)}</span>
        </div>

        <div className="cart-summary__row">
          <span>
            <FaShippingFast className="icon" /> Shipping
          </span>
          <span>{shippingFee === 0 ? <strong>Free</strong> : formatter.format(shippingFee)}</span>
        </div>

        {discount > 0 && (
          <div className="cart-summary__row cart-summary__discount">
            <span>Discount</span>
            <span>-{formatter.format(discount)}</span>
          </div>
        )}

        <div className="cart-summary__total-row" aria-live="polite" aria-atomic="true">
          <span>Total</span>
          <span className="cart-summary__total">{formatter.format(total)}</span>
        </div>
      </div>

      <button
        className="cart-summary__checkout-btn"
        aria-label="Proceed to checkout"
        type="button"
        onClick={() => alert('Checkout functionality coming soon!')}
      >
        Proceed to Checkout
      </button>
    </aside>
  );
};

export default CartSummary;
