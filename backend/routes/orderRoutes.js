import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", placeOrder);
router.get("/user/:user_id", getUserOrders);
router.get("/:order_id", getOrderDetails);
router.put("/:order_id/status", updateOrderStatus);

export default router;
