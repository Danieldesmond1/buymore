import express from "express";
import {
    addShippingDetails,
    updateShippingStatus,
    getShippingDetails
} from "../controllers/shippingController.js";

const router = express.Router();

router.post("/add", addShippingDetails);
router.put("/update/:order_id", updateShippingStatus);
router.get("/:order_id", getShippingDetails);

export default router;
