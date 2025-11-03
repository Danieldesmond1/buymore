import { useEffect } from "react";
import { usePageLoader } from "../context/PageLoaderContext";
import Loader from "../components/Loader/Loader.jsx";
import Hero from "../components/Home/Hero.jsx";
import FeaturedProducts from "../components/Home/FeaturedProduct.jsx";
import BestSellers from "../components/Home/BestSellers.jsx";
import Testimonials from "../components/Home/Testimonials.jsx";
import FAQ from "../components/Home/FAQ.jsx";
import SpecialOffers from "../components/Home/SpecialOffers.jsx";
import Footer from "../components/Footer/Footer.jsx";

const Home = () => {
  const { loading, setLoading, homeLoaded, setHomeLoaded } = usePageLoader();

  useEffect(() => {
    if (!homeLoaded) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <>
          <Hero />
          <FeaturedProducts
            onLoaded={() => {
              setLoading(false);
              setHomeLoaded(true); // ✅ Save that Home has loaded
            }}
          />
          <BestSellers />
          <Testimonials />
          <FAQ />
          <SpecialOffers />
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
