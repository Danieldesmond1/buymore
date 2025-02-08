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

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.status(200).json({ products: result.rows });
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
