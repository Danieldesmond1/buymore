import "./Styles/ProductGallery.css";
import { useState, useEffect, useRef } from "react";

const ProductGallery = ({ product }) => {
  const [parsedImages, setParsedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [fade, setFade] = useState(false);
  const [zoom, setZoom] = useState(1);
  const zoomAreaRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!product) return;

    let parsed = [];

    // ✅ Parse image_url safely
    try {
      if (typeof product.image_url === "string") {
        parsed = JSON.parse(product.image_url);
      } else if (Array.isArray(product.image_url)) {
        parsed = product.image_url;
      }
    } catch {
      parsed = [];
    }

    // ✅ Prefix local paths with backend base URL
    const formatted = parsed.map((img) =>
      img.startsWith("http") ? img : `${API_BASE}${img}`
    );

    setParsedImages(formatted);

    // ✅ Default selected image
    if (formatted.length > 0) {
      setSelectedImage(formatted[0]);
    } else {
      setSelectedImage("/fallback.jpg");
    }
  }, [product, API_BASE]);

  // ✅ Handle thumbnail click
  const handleThumbnailClick = (img) => {
    setFade(true);
    setTimeout(() => {
      setSelectedImage(img);
      setFade(false);
      setZoom(1);
    }, 150);
  };

  // ✅ Handle zoom scroll
  const handleWheelZoom = (e) => {
    if (zoomAreaRef.current && zoomAreaRef.current.contains(e.target)) {
      e.preventDefault();
      const newZoom = zoom + (e.deltaY < 0 ? 0.2 : -0.2);
      setZoom(Math.max(1, Math.min(3, newZoom)));
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheelZoom, { passive: false });
    return () => window.removeEventListener("wheel", handleWheelZoom);
  }, []);

  return (
    <div className="product-gallery-wrapper">
      <div className="product-gallery-container">
        {/* ✅ Thumbnails */}
        <div className="gallery-thumbnails">
          {parsedImages.length > 0 ? (
            parsedImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i}`}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => handleThumbnailClick(img)}
              />
            ))
          ) : (
            <div className="no-thumbnails">No images available</div>
          )}
        </div>

        {/* ✅ Main Image */}
        <div className="main-image-area" ref={zoomAreaRef}>
          <div
            className={`main-image-wrapper ${fade ? "fade-out" : "fade-in"}`}
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={selectedImage}
              alt={product?.name || "Product"}
              className="main-image"
            />
          </div>
        </div>

        <div className="zoom-hint">🔍 Scroll to zoom for closer look</div>
      </div>
    </div>
  );
};

export default ProductGallery;
