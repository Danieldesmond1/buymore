import ContactSeller from "../components/Products/ContactSeller";
import DeliveryOptions from '../components/Products/DeliveryOptions';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGallery from '../components/Products/ProductGallery';
import ProductHeader from '../components/Products/ProductHeader';
import RelatedProducts from '../components/Products/RelatedProducts';
import ReviewSection from '../components/Products/ReviewSection';
import SellerDetails from '../components/Products/SellerDetails';
import Footer from "../components/Footer/Footer";

const Products = () => {
  return (
    <>
      <ProductHeader />
      <ProductGallery />
      <ProductDetails />
      <SellerDetails />
      <DeliveryOptions />
      <ReviewSection />
      <ContactSeller />
      <RelatedProducts />
      <Footer />
    </>
  )
}
export default Products;