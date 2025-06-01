import { FaTrash } from 'react-icons/fa';
import './Styles/CartItem.css';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const { cart_id, name, image_url, price, quantity } = item;
  const total = price * quantity;

  return (
    <article className="cart-item" aria-label={`Cart item: ${name}`}>
      {/* Image Section */}
      <div className="cart-item__image">
        <img
          src={image_url}
          alt={name}
          loading="lazy"
        />
      </div>

      {/* Info Section */}
      <div className="cart-item__info">
        <h3 className="cart-item__name" title={name}>
          {name.length > 50 ? `${name.slice(0, 50)}...` : name}
        </h3>

        <p className="cart-item__price">₦{price.toLocaleString()}</p>

        {/* Quantity + Remove */}
        <div className="cart-item__controls">
          <label htmlFor={`qty-${cart_id}`} className="sr-only">
            Quantity
          </label>
          <select
            id={`qty-${cart_id}`}
            value={quantity}
            className="cart-item__qty"
            onChange={(e) => onQuantityChange(cart_id, Number(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() => onRemove(cart_id)}
            className="cart-item__remove"
            aria-label={`Remove ${name} from cart`}
            title="Remove item"
          >
            <FaTrash />
            <span className="sr-only">Remove</span>
          </button>
        </div>

        {/* Subtotal */}
        <p className="cart-item__subtotal">
          Subtotal: ₦{total.toLocaleString()}
        </p>
      </div>
    </article>
  );
};

export default CartItem;
