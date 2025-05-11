import Hero from "../components/Home/Hero.jsx";
import FeaturedProducts from "../components/Home/FeaturedProduct.jsx";
import BestSellers from "../components/Home/BestSellers.jsx";
import Testimonials from "../components/Home/Testimonials.jsx";
import FAQ from "../components/Home/FAQ.jsx";
import SpecialOffers from "../components/Home/SpecialOffers.jsx";
import Footer from "../components/Footer/Footer.jsx";

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Testimonials />
      <BestSellers />
      <FAQ />
      <SpecialOffers />
      <Footer />
    </>
  );
};

export default Home;
