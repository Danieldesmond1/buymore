// src/components/Cart/CartItem.jsx
import { FaTrash } from 'react-icons/fa';
import iphone14promax from '../../assets/iphone14promax.jpg';
import './Styles/CartItem.css';

const CartItem = () => {
  // Dummy item data inside the component
  const item = {
    id: 1,
    name: 'Oraimo Bluetooth Earbuds with Long Battery Life and Clear Sound',
    image: iphone14promax,
    price: 12900,
    quantity: 2,
    inStock: true, // optional for future enhancement
  };

  const { id, name, image, price, quantity } = item;

  const handleRemove = () => {
    console.log(`Remove item with id: ${id}`);
  };

  const handleQuantityChange = (e) => {
    console.log(`Change quantity of ${id} to ${e.target.value}`);
  };

  const total = price * quantity;

  return (
    <div className="cart-item" role="listitem" aria-label={`Cart item: ${name}`}>
      <div className="cart-item__image" tabIndex={0} aria-describedby={`desc-${id}`}>
        <img src={image} alt={name} />
      </div>

      <div className="cart-item__details">
        <h3
          className="cart-item__name"
          title={name}
          aria-describedby={`desc-${id}`}
          id={`desc-${id}`}
        >
          {name.length > 50 ? name.slice(0, 50) + '...' : name}
        </h3>

        <p className="cart-item__price">₦{price.toLocaleString()}</p>

        <div className="cart-item__actions">
          <label htmlFor={`qty-${id}`} className="sr-only">Quantity</label>
          <select
            id={`qty-${id}`}
            className="cart-item__qty"
            value={quantity}
            onChange={handleQuantityChange}
            aria-live="polite"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Qty: {i + 1}
              </option>
            ))}
          </select>

          <button
            className="cart-item__remove"
            onClick={handleRemove}
            aria-label={`Remove ${name} from cart`}
            title="Remove item"
          >
            <FaTrash />
          </button>
        </div>

        <p className="cart-item__subtotal" aria-live="polite">
          Subtotal: ₦{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
