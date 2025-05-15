import "./Styles/ProductGallery.css";
import { useState, useRef, useEffect } from "react";

import front from "../../assets/iphone14promaxfront.jpg";
import back from "../../assets/iphone14promax.jpg";
import side from "../../assets/iphone14promaxside.jpg";
import box from "../../assets/iphone14promaxpack.jpg";

const ProductGallery = () => {
  const images = [front, back, side, box];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [fade, setFade] = useState(false);
  const [zoom, setZoom] = useState(1);
  const zoomAreaRef = useRef(null);

  const handleThumbnailClick = (img) => {
    setFade(true);
    setTimeout(() => {
      setSelectedImage(img);
      setFade(false);
      setZoom(1); // Reset zoom on image change
    }, 150);
  };

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
  });

  return (
    <div className="product-gallery-wrapper">
      <div className="product-gallery-container">
        <div className="gallery-thumbnails">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumbnail ${i}`}
              className={`thumbnail ${selectedImage === img ? "active" : ""}`}
              onClick={() => handleThumbnailClick(img)}
            />
          ))}
        </div>

        <div className="main-image-area">
          <div className={`main-image-wrapper ${fade ? "fade-out" : "fade-in"}`} style={{ transform: `scale(${zoom})` }}>
            <img src={selectedImage} alt="Product" className="main-image" />
          </div>
        </div>

        <div className="zoom-side" ref={zoomAreaRef}>
          <div className="zoom-hint">🔍 Zoom for closer look<br />(scroll while hovering)</div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
