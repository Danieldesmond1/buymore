import CartItem from "./CartItem";

const CartPage = ({ cartItems, setCartItems }) => {

  const handleRemove = async (cart_id) => {
    try {
      const res = await fetch(`/api/cart/remove/${cart_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.cart_id !== cart_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = async (cart_id, quantity) => {
    try {
      const res = await fetch(`/api/cart/update/${cart_id}`, {
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
      }
    } catch (error) {
      console.error(error);
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
