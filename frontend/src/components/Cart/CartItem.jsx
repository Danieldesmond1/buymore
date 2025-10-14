import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Styles/CartItem.css";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const navigate = useNavigate();
  const { cart_id, product_id, name, image_url, price, quantity } = item;
  const total = price * quantity;

  // 🖼️ Parse image_url (handles JSON arrays or plain strings)
  let parsedImages = [];
  try {
    parsedImages = JSON.parse(image_url);
  } catch {
    parsedImages = [];
  }

  const firstImage =
    parsedImages.length > 0
      ? (parsedImages[0].startsWith("http")
          ? parsedImages[0]
          : `http://localhost:5000${parsedImages[0]}`)
      : image_url?.startsWith("http")
      ? image_url
      : image_url
      ? `http://localhost:5000${image_url}`
      : "/fallback.jpg"; // fallback placeholder

  // 🧭 Navigate to product details when image is clicked
  const handleViewProduct = () => {
    navigate(`/products/${product_id}`);
  };

  return (
    <article className="cart-item" aria-label={`Cart item: ${name}`}>
      {/* 🖼️ Image Section (clickable to go to details) */}
      <div
        className="cart-item__image"
        onClick={handleViewProduct}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleViewProduct();
        }}
        style={{ cursor: "pointer" }}
        title="View product details"
      >
        <img src={firstImage} alt={name} loading="lazy" />
      </div>

      {/* ℹ️ Info Section */}
      <div className="cart-item__info">
        <h3 className="cart-item__name" title={name}>
          {name.length > 50 ? `${name.slice(0, 50)}...` : name}
        </h3>

        <p className="cart-item__price">${price.toLocaleString()}</p>

        {/* 🧮 Quantity + Remove */}
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

        {/* 💰 Subtotal */}
        <p className="cart-item__subtotal">
          Subtotal: ${total.toLocaleString()}
        </p>
      </div>
    </article>
  );
};

export default CartItem;
