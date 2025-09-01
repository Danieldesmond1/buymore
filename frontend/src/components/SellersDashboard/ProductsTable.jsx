import { useState } from "react";
import "./styles/ProductsTable.css";

const ProductsTable = () => {
  const [products] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/60",
      name: "Wireless Headphones",
      category: "Electronics",
      stock: 120,
      price: "$120",
      status: "Active",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/60",
      name: "Leather Handbag",
      category: "Fashion",
      stock: 45,
      price: "$85",
      status: "Draft",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/60",
      name: "Office Chair",
      category: "Furniture",
      stock: 0,
      price: "$199",
      status: "Out of Stock",
    },
  ]);

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="title">Products</h2>
        <button className="add-btn">+ Add Product</button>
      </div>
      <p className="subtitle">
        Manage your products — upload, edit, delete, and track inventory.
      </p>

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
        />
        <select className="filter-dropdown">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Furniture</option>
        </select>
      </div>

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
                <img src={p.image} alt={p.name} className="product-img" />
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.stock > 0 ? p.stock : "—"}</td>
              <td>{p.price}</td>
              <td>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </td>
              <td>
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled>{"<"}</button>
        <span>Page 1 of 5</span>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default ProductsTable;
