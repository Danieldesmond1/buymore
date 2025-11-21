import pool from "../utils/dbConnect.js";
import cloudinary from "../utils/cloudinary.js";

// Helper function to upload a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",

        // 🔥 Auto-compress & convert to WebP
        quality: "auto",
        fetch_format: "auto",

        // 🔥 Prevent extremely large uploads by resizing
        transformation: [
          { width: 2000, crop: "limit" } // prevents 8k/4k 50MB images
        ]
      },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );

    stream.end(fileBuffer);
  });
};


// ✅ Add a Product (Seller/Admin)
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, discount_price, stock, category, brand } = req.body;

    if (!req.user || (req.user.role !== "seller" && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Only sellers or admins can add products" });
    }

    if (req.user.role === "seller" && !req.user.shop?.id) {
      return res.status(400).json({ message: "You must create a shop before adding products" });
    }

    if (!name || !description || !price || !stock || !category || !brand) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shop_id = req.user.role === "seller" ? req.user.shop.id : null;

    // ✅ Upload images to Cloudinary
    let imageUrls = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, "products");
        imageUrls.push(url);
      }
    }

    const result = await pool.query(
      `INSERT INTO products 
        (name, description, price, discount_price, stock, category, brand, image_url, shop_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        name,
        description,
        price,
        discount_price || null,
        stock,
        category,
        brand,
        JSON.stringify(imageUrls), // store as JSON array
        shop_id,
      ]
    );

    return res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return res.status(500).json({ message: "Internal server error" });
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

    // 🎯 Filter by Seller (if logged in and is seller)
    if (req.user?.role === "seller" && req.user?.shop?.id) {
      query += ` AND shop_id = $${values.length + 1}`;
      values.push(req.user.shop.id); // ✅ USE shop.id instead of userId
    }

    // 🔍 Search by Name or Description
    if (search) {
      query += ` AND (name ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`;
      values.push(`%${search}%`);
    }

    if (category) {
      query += ` AND category = $${values.length + 1}`;
      values.push(category);
    }

    if (brand) {
      query += ` AND brand = $${values.length + 1}`;
      values.push(brand);
    }

    if (min_price) {
      query += ` AND price >= $${values.length + 1}`;
      values.push(min_price);
    }
    if (max_price) {
      query += ` AND price <= $${values.length + 1}`;
      values.push(max_price);
    }

    query += " ORDER BY created_at DESC";

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    const offset = (page - 1) * limit;

    values.push(limit);
    query += ` LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;

    console.log("Final query:", query);
    console.log("Values:", values);

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
// export const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, discount_price, stock, category, brand, image_url } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE products 
//        SET 
//          name = COALESCE($1, name),
//          description = COALESCE($2, description),
//          price = COALESCE($3, price),
//          discount_price = COALESCE($4, discount_price),
//          stock = COALESCE($5, stock),
//          category = COALESCE($6, category),
//          brand = COALESCE($7, brand),
//          image_url = COALESCE($8, image_url)
//        WHERE id = $9
//        RETURNING *`,
//       [name, description, price, discount_price, stock, category, brand, image_url, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product updated successfully", product: result.rows[0] });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// ✅ Update a Product (Seller/Admin)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount_price, stock, category, brand } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = existing.rows[0];

    if (req.user.role === "seller" && product.shop_id !== req.user.shop?.id) {
      return res.status(403).json({ message: "You can only update your own products" });
    }

    // ✅ Handle Cloudinary image uploads
    let imageUrls = product.image_url ? JSON.parse(product.image_url) : [];
    if (req.files?.length > 0) {
      let newImages = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, "products");
        newImages.push(url);
      }
      imageUrls = newImages; // replace with new images
    }

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
      [name, description, price, discount_price, stock, category, brand, JSON.stringify(imageUrls), id]
    );

    res.status(200).json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a Product (Admin Only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if product exists
    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = existing.rows[0];

    // ✅ Sellers can only delete their own product
    if (req.user.role === "seller" && product.shop_id !== req.user.shop?.id) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    // Delete product
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Related Products
export const getRelatedProducts = async (req, res) => {
  const { id } = req.params; // current product ID

  try {
    // First, get the product details to know its category and brand
    const productResult = await pool.query(
      "SELECT category, brand FROM products WHERE id = $1",
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { category, brand } = productResult.rows[0];

    // Now fetch related products (same category, optionally same brand)
    const relatedResult = await pool.query(
      `SELECT * FROM products 
       WHERE category = $1 AND id != $2
       ORDER BY created_at DESC
       LIMIT 6`,
      [category, id]
    );

    return res.status(200).json({
      related_products: relatedResult.rows,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
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

// ✅ Toggle Like (Like/Unlike a Product)
export const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the product exists
    const checkProduct = await pool.query("SELECT like_count FROM products WHERE id = $1", [id]);
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    let currentLikes = checkProduct.rows[0].like_count || 0;

    // Toggle Like: If liked, unlike it. If not liked, like it.
    let newLikes = currentLikes === 0 ? 1 : currentLikes - 1; // Unlike if already liked, like otherwise.

    // Update like count
    await pool.query("UPDATE products SET like_count = $1 WHERE id = $2", [newLikes, id]);

    res.status(200).json({ message: `Product ${newLikes > currentLikes ? "liked" : "unliked"} successfully`, like_count: newLikes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Most Liked Products
export const getMostLikedProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY like_count DESC LIMIT 10");

    res.status(200).json({ most_liked_products: result.rows });
  } catch (error) {
    console.error("Error fetching most liked products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Like & Unlike a Product
export const toggleProductLike = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Validate inputs
    if (!user_id || !product_id) {
      return res.status(400).json({ message: "user_id and product_id are required" });
    }

    const checkQuery = "SELECT * FROM product_likes WHERE user_id = $1 AND product_id = $2";
    const checkResult = await pool.query(checkQuery, [user_id, product_id]);

    if (checkResult.rows.length > 0) {
      // Unlike
      const deleteQuery = "DELETE FROM product_likes WHERE user_id = $1 AND product_id = $2";
      await pool.query(deleteQuery, [user_id, product_id]);
      return res.status(200).json({ message: "Product unliked successfully" });
    } else {
      // Like
      const insertQuery = "INSERT INTO product_likes (user_id, product_id) VALUES ($1, $2)";
      await pool.query(insertQuery, [user_id, product_id]);
      return res.status(200).json({ message: "Product liked successfully" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Get Like Count for a Product
export const getProductLikes = async (req, res) => {
  try {
    const { product_id } = req.params;
    const query = "SELECT COUNT(*) FROM product_likes WHERE product_id = $1";
    const result = await pool.query(query, [product_id]);

    res.status(200).json({ product_id, like_count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Add or Update a Product Review
export const addProductReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    // Check if user already reviewed this product
    const existingReview = await pool.query(
      "SELECT * FROM product_reviews WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingReview.rows.length > 0) {
      // Update existing review
      await pool.query(
        "UPDATE product_reviews SET rating = $1, comment = $2 WHERE user_id = $3 AND product_id = $4",
        [rating, comment, user_id, product_id]
      );
    } else {
      // Insert new review
      await pool.query(
        "INSERT INTO product_reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4)",
        [user_id, product_id, rating, comment]
      );
    }

    // ✅ Update the product's average rating
    const avgRating = await pool.query(
      "SELECT AVG(rating) AS average FROM product_reviews WHERE product_id = $1",
      [product_id]
    );

    await pool.query("UPDATE products SET rating = $1 WHERE id = $2", [
      avgRating.rows[0].average,
      product_id,
    ]);

    res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Reviews for a Product
export const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await pool.query(
      "SELECT r.*, u.username FROM product_reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC",
      [product_id]
    );

    res.status(200).json({ reviews: result.rows });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Add or Remove a Product from Wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Check if product is already in wishlist
    const existing = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existing.rows.length > 0) {
      // Remove from wishlist
      await pool.query(
        "DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2",
        [user_id, product_id]
      );
      return res.status(200).json({ message: "Product removed from wishlist" });
    } else {
      // Add to wishlist
      await pool.query(
        "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)",
        [user_id, product_id]
      );
      return res.status(201).json({ message: "Product added to wishlist" });
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Wishlist for a User
export const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      "SELECT w.product_id, p.name, p.price, p.image_url FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = $1 ORDER BY w.created_at DESC",
      [user_id]
    );

    res.status(200).json({ wishlist: result.rows });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
