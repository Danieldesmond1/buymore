// ✅ 1. BACKEND - shopRoutes.js (Updated to include top 2 products per shop)
import express from "express";
import pool from "../utils/dbConnect.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { location, store_type } = req.query;

    let filterQuery = `
      SELECT 
        s.id AS shop_id,
        s.shop_name,
        s.shop_handle,
        s.shop_description,
        s.logo_image,
        s.banner_image,
        s.store_type,
        s.estimated_shipping_time,
        s.return_policy,
        s.chat_enabled,
        u.username AS owner_name,
        u.location,
        s.business_address
      FROM sellers_shop s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;

    const values = [];

    if (location) {
      values.push(location);
      filterQuery += ` AND u.location = $${values.length}`;
    }

    if (store_type) {
      values.push(store_type);
      filterQuery += ` AND s.store_type = $${values.length}`;
    }

    const { rows: shops } = await pool.query(filterQuery, values);

    // Fetch top 2 products per shop
    const shopWithProducts = await Promise.all(
      shops.map(async (shop) => {
        const productQuery = `
          SELECT id, name, image_url, price, discount_price, rating, stock
          FROM products
          WHERE shop_id = $1
          ORDER BY rating DESC
          LIMIT 2
        `;
        const { rows: topProducts } = await pool.query(productQuery, [shop.shop_id]);
        return { ...shop, topProducts };
      })
    );

    res.json({ shops: shopWithProducts });
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/shops/:shopId - Get single shop and its products
router.get("/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    // Fetch the shop
    const shopQuery = `
      SELECT 
        s.id AS shop_id,
        s.shop_name,
        s.shop_handle,
        s.shop_description,
        s.logo_image,
        s.banner_image,
        s.store_type,
        s.estimated_shipping_time,
        s.return_policy,
        s.chat_enabled,
        u.username AS owner_name,
        u.location,
        s.business_address
      FROM sellers_shop s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `;
    const { rows: shopRows } = await pool.query(shopQuery, [shopId]);

    if (shopRows.length === 0) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shop = shopRows[0];

    // Fetch all products for this shop
    const productQuery = `
      SELECT id, name, image_url, price, discount_price, rating, stock
      FROM products
      WHERE shop_id = $1
      ORDER BY created_at DESC
    `;
    const { rows: products } = await pool.query(productQuery, [shopId]);

    res.json({ shop, products });

  } catch (err) {
    console.error("Error fetching shop details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
