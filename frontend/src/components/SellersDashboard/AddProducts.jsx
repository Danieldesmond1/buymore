import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/AddProducts.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AddProduct = ({ setActiveSection, editingProduct, setEditingProduct }) => {
  const token = localStorage.getItem("token"); // ✅ Get token

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discount_price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [token]);

  // Pre-fill form when editing
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

      setExistingImages(editingProduct.imageArray || []);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      // New images
      images.forEach((image) => formData.append("images", image));

      // Existing images (if editing)
      if (editingProduct) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      };

      if (editingProduct) {
        await axios.put(`${API_BASE}/api/products/${editingProduct.id}`, formData, config);
        alert("✅ Product updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/products`, formData, config);
        alert("✅ Product added successfully!");
      }

      setActiveSection("products");
      setEditingProduct(null);
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
        {/* Product Info */}
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

        {/* Images */}
        <div className="form-group">
          <label>Product Images (max 4)</label>
          <div className="image-upload-container">
            {existingImages.map((img, idx) => (
              <div key={`db-${idx}`} className="image-preview">
                <img src={img} alt={`existing-${idx}`} />
                <button type="button" className="remove-btn" onClick={() => removeExistingImage(idx)}>✕</button>
              </div>
            ))}
            {images.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
                <button type="button" className="remove-btn" onClick={() => removeNewImage(idx)}>✕</button>
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

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => { setActiveSection("products"); setEditingProduct(null); }}>
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
