import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/ProductsTable.css";
import { useAuth } from "../../context/AuthContext";

const ProductsTable = () => {
  const { user } = useAuth(); // ✅ logged-in user
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products/my-products", {
        params: { search, category },
        withCredentials: true,
      });

      let fetchedProducts = response.data.products || [];

      // ✅ Filter locally to show only THIS seller's products
      // if (user?.role === "seller" && user?.shop?.id) {
      //   fetchedProducts = fetchedProducts.filter(
      //     (p) => p.shop_id === user.shop.id
      //   );
      // }
       
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Categories
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

  // ✅ Run whenever search, category, OR user.shop.id changes
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, category, user?.shop?.id]);

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`, { withCredentials: true });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="title">Products</h2>
        <button
          className="add-btn"
          onClick={() => alert("Open Add Product Modal")}
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
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image_url} alt={p.name} className="product-img" />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.stock > 0 ? p.stock : "—"}</td>
                <td>${p.price}</td>
                <td>
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
                    onClick={() => alert(`Edit product ${p.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsTable;
