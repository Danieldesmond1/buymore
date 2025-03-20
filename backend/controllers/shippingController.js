import pool from "../utils/dbConnect.js";

// Add shipping details
export const addShippingDetails = async (req, res) => {
    try {
        const { order_id, user_id, address, city, state, country, postal_code } = req.body;

        if (!order_id || !user_id || !address || !city || !state || !country) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const result = await pool.query(
            `INSERT INTO shipping (order_id, user_id, address, city, state, country, postal_code)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [order_id, user_id, address, city, state, country, postal_code]
        );

        res.status(201).json({ message: "Shipping details added", shipping: result.rows[0] });
    } catch (error) {
        console.error("Error adding shipping details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update shipping status
export const updateShippingStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { shipping_status, tracking_number } = req.body;

        const result = await pool.query(
            `UPDATE shipping SET shipping_status = $1, tracking_number = $2 WHERE order_id = $3 RETURNING *`,
            [shipping_status, tracking_number, order_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Shipping details not found" });
        }

        res.status(200).json({ message: "Shipping status updated", shipping: result.rows[0] });
    } catch (error) {
        console.error("Error updating shipping status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get shipping details
export const getShippingDetails = async (req, res) => {
    try {
        const { order_id } = req.params;

        const result = await pool.query(
            `SELECT * FROM shipping WHERE order_id = $1`,
            [order_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Shipping details not found" });
        }

        res.status(200).json({ shipping: result.rows[0] });
    } catch (error) {
        console.error("Error fetching shipping details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
