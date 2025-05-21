import CartHeader from '../components/Cart/CartHeader';
import CartItem from '../components/Cart/CartItem';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import EmptyCart from '../components/Cart/EmptyCart';
import PromoCodeForm from '../components/Cart/PromoCodeForm';
import RelatedProducts from '../components/Cart/RelatedProducts';
import StickyCheckoutBar from '../components/Cart/StickyCheckoutBar';

const Cart = () => {
  return (
    <>
      <CartHeader />
      <CartItem />
      <CartItemList />
      <CartSummary />
      <EmptyCart />
      <PromoCodeForm />
      <RelatedProducts />
      <StickyCheckoutBar />
    </>
  )
}

export default Cart;