import pool from "../utils/dbConnect.js";

// ✅ Add a Product (Admin Only)
export const addProduct = async (req, res) => {
  const { name, description, price, discount_price, stock, category, brand, image_url } = req.body;

  if (!name || !description || !price || !stock || !category || !brand || !image_url) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, discount_price, stock, category, brand, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, description, price, discount_price || null, stock, category, brand, image_url]
    );

    res.status(201).json({ message: "Product added successfully", product: result.rows[0] });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT category FROM products");
    res.status(200).json({ categories: result.rows.map(row => row.category) });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Products by Category
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const result = await pool.query("SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC", [category]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Products with Filtering, Sorting, Searching & Pagination
export const getAllProducts = async (req, res) => {
  try {
    let { search, category, brand, min_price, max_price, sort, order, page, limit } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    let values = [];

    // 🔍 Search by Name or Description
    if (search) {
      query += ` AND (name ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`;
      values.push(`%${search}%`);
    }

    // 🎯 Filter by Category
    if (category) {
      query += ` AND category = $${values.length + 1}`;
      values.push(category);
    }

    // 🏷️ Filter by Brand
    if (brand) {
      query += ` AND brand = $${values.length + 1}`;
      values.push(brand);
    }

    // 💰 Filter by Price Range
    if (min_price) {
      query += ` AND price >= $${values.length + 1}`;
      values.push(min_price);
    }
    if (max_price) {
      query += ` AND price <= $${values.length + 1}`;
      values.push(max_price);
    }

    // 🔀 Sorting (Default: Newest First)
    const allowedSortFields = ["price", "name", "stock", "created_at"];
    if (sort && allowedSortFields.includes(sort)) {
      order = order === "asc" ? "ASC" : "DESC";
      query += ` ORDER BY ${sort} ${order}`;
    } else {
      query += " ORDER BY created_at DESC";
    }

    // 📄 Pagination (Default: 10 products per page)
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.status(200).json({ products: result.rows, page, limit });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Get a Single Product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: result.rows[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update a Product (Admin Only)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount_price, stock, category, brand, image_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
       SET 
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         discount_price = COALESCE($4, discount_price),
         stock = COALESCE($5, stock),
         category = COALESCE($6, category),
         brand = COALESCE($7, brand),
         image_url = COALESCE($8, image_url)
       WHERE id = $9
       RETURNING *`,
      [name, description, price, discount_price, stock, category, brand, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a Product (Admin Only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Search Products by Name
export const searchProducts = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Please provide a search term" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE LOWER(name) LIKE LOWER($1) ORDER BY created_at DESC",
      [`%${name}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Products with Filtering
export const getFilteredProducts = async (req, res) => {
  const { category, minPrice, maxPrice, brand } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  let values = [];

  if (category) {
    values.push(category);
    query += ` AND category = $${values.length}`;
  }

  if (minPrice) {
    values.push(Number(minPrice)); // ✅ Convert to number
    query += ` AND price >= $${values.length}`;
  }

  if (maxPrice) {
    values.push(Number(maxPrice)); // ✅ Convert to number
    query += ` AND price <= $${values.length}`;
  }

  if (brand) {
    values.push(brand);
    query += ` AND brand = $${values.length}`;
  }

  query += " ORDER BY created_at DESC"; // Sort by newest products

  console.log("Executing Query:", query);
  console.log("With Values:", values);

  try {
    const result = await pool.query(query, values);
    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
