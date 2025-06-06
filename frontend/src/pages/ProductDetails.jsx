import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import ContactSeller from "../components/Products/ContactSeller";
import DeliveryOptions from '../components/Products/DeliveryOptions';
import ProductDetailsInfo from '../components/Products/ProductDetails'; // renamed to avoid conflict
import ProductGallery from '../components/Products/ProductGallery';
import ProductHeader from '../components/Products/ProductHeader';
import RelatedProducts from '../components/Products/RelatedProducts';
import ReviewSection from '../components/Products/ReviewSection';
import SellerDetails from '../components/Products/SellerDetails';
import Footer from "../components/Footer/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        console.log("Fetch status:", res.status);

        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        console.log("Fetched product:", data);
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Optional: Scroll to top on product id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <>
      <ProductHeader product={product} />
      <ProductGallery product={product} />
      <ProductDetailsInfo product={product} />
      <SellerDetails seller={product?.seller} />
      <DeliveryOptions product={product} />
      <ReviewSection reviews={product?.reviews || []} />
      <ContactSeller seller={product?.seller} />
      <RelatedProducts category={product?.category} />
      <Footer />
    </>
  );
};

export default ProductDetails;
