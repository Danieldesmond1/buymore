import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/AddProducts.css";

const BASE_URL = "http://localhost:5000";

const AddProduct = ({ setActiveSection, editingProduct, setEditingProduct }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discount_price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);       // new uploads
  const [existingImages, setExistingImages] = useState([]); // from DB
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load categories
  useEffect(() => {
    axios.get("/api/products/categories").then((res) => {
      setCategories(res.data.categories || []);
    });
  }, []);

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        category: editingProduct.category || "",
        brand: editingProduct.brand || "",
        price: editingProduct.price || "",
        discount_price: editingProduct.discount_price || "",
        stock: editingProduct.stock || "",
      });

      // handle existing DB images
      setExistingImages(editingProduct.imageArray || []);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle image selection (max 4 total including existing)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + images.length + files.length > 4) {
      alert("You can upload a maximum of 4 images per product.");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("price", form.price);
      formData.append("discount_price", form.discount_price);
      formData.append("stock", form.stock);

      // ✅ Append new images
      images.forEach((image) => formData.append("images", image));

      // ✅ Send existing images as JSON (if editing)
      if (editingProduct) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      if (editingProduct) {
        // UPDATE existing product
        await axios.put(`${BASE_URL}/api/products/${editingProduct.id}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product updated successfully!");
      } else {
        // CREATE new product
        await axios.post(`${BASE_URL}/api/products`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product added successfully!");
      }

      setActiveSection("products");
      setEditingProduct(null); // reset edit mode
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="header">
        <button
          className="back-btn"
          onClick={() => {
            setActiveSection("products");
            setEditingProduct(null);
          }}
        >
          ← Back
        </button>
        <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        {/* PRODUCT INFO */}
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Brand</label>
          <input type="text" name="brand" value={form.brand} onChange={handleChange} required />
        </div>

        <div className="form-inline">
          <div>
            <label>Price</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <label>Discount Price</label>
            <input type="number" name="discount_price" value={form.discount_price} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
        </div>

        {/* ✅ IMAGE UPLOADS */}
        <div className="form-group">
          <label>Product Images (max 4)</label>
          <div className="image-upload-container">
            {/* existing images from DB */}
            {existingImages.map((img, idx) => (
              <div key={`db-${idx}`} className="image-preview">
                <img src={img} alt={`existing-${idx}`} />
                <button type="button" className="remove-btn" onClick={() => removeExistingImage(idx)}>
                  ✕
                </button>
              </div>
            ))}
            {/* new uploads */}
            {images.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
                <button type="button" className="remove-btn" onClick={() => removeNewImage(idx)}>
                  ✕
                </button>
              </div>
            ))}
            {existingImages.length + images.length < 4 && (
              <label className="image-upload-box">
                <span>+ Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setActiveSection("products");
              setEditingProduct(null);
            }}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
