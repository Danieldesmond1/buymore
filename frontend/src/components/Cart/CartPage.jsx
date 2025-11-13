import CartItem from "./CartItem";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const CartPage = ({ cartItems, setCartItems }) => {
  const handleRemove = async (cart_id) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/remove/${cart_id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.cart_id !== cart_id));
      } else {
        const errText = await res.text();
        console.error("Delete failed:", errText);
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleQuantityChange = async (cart_id, quantity) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/update/${cart_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (res.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.cart_id === cart_id ? { ...item, quantity } : item
          )
        );
      } else {
        const errText = await res.text();
        console.error("Update failed:", errText);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div role="list" aria-label="Shopping cart items">
      {cartItems.map((item) => (
        <CartItem
          key={item.cart_id}
          item={item}
          onRemove={handleRemove}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </div>
  );
};

export default CartPage;
