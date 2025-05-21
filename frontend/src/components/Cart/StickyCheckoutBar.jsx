import './Styles/StickyCheckoutBar.css';

const StickyCheckout = ({ totalItems = 0, totalPrice = 0, onCheckout }) => {
  return (
    <div
      className="sticky-checkout"
      role="region"
      aria-label="Checkout summary"
    >
      <div className="sticky-checkout__summary">
        <span className="sticky-checkout__items">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
        <span className="sticky-checkout__total">
          Total: ₦{totalPrice.toLocaleString()}
        </span>
      </div>
      <button
        className="sticky-checkout__btn"
        onClick={onCheckout}
        aria-label="Proceed to checkout"
        disabled={totalItems === 0}
      >
        Checkout
      </button>
    </div>
  );
};

export default StickyCheckout;
