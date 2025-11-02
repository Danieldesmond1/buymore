import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/ProductsTable.css";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = "http://localhost:5000";

const ProductsTable = ({ setActiveSection, setEditingProduct }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(null); // store product id for delete confirmation

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products/my-products", {
        params: { search, category },
        withCredentials: true,
      });

      let fetchedProducts = response.data.products || [];

      fetchedProducts = fetchedProducts.map((p) => {
        let parsedImages = [];
        try {
          parsedImages = JSON.parse(p.image_url);
        } catch {
          parsedImages = [];
        }

        const imageArray = parsedImages.map((img) =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        );

        return { ...p, imageArray };
      });

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/products/categories", {
        withCredentials: true,
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, category, user?.shop?.id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, { withCredentials: true });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmDelete(null); // close modal
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product); // pass product data to AddProducts.jsx
    setActiveSection("addProduct");
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="title">Products</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditingProduct(null); // clear edit mode
            setActiveSection("addProduct");
          }}
        >
          + Add Product
        </button>
      </div>

      <p className="subtitle">
        Manage your products — upload, edit, delete, and track inventory.
      </p>

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const firstImage = p.imageArray?.[0] || null;
              return (
                <tr key={p.id}>
                  <td data-label="Image">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={p.name}
                        className="product-img"
                      />
                    ) : (
                      <div className="product-img placeholder">No Image</div>
                    )}
                  </td>
                  <td data-label="Name">{p.name}</td>
                  <td data-label="Category">{p.category}</td>
                  <td data-label="Stock">{p.stock > 0 ? p.stock : "—"}</td>
                  <td data-label="Price">${p.price}</td>
                  <td data-label="Status">
                    <span
                      className={`status ${
                        p.stock > 0 ? "active" : "out-of-stock"
                      }`}
                    >
                      {p.stock > 0 ? "Active" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => setConfirmDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ✅ Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) {
              setConfirmDelete(null); // close when clicking outside
            }
          }}
        >
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this product? <br />
              <strong>This action cannot be undone.</strong>
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(confirmDelete)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
