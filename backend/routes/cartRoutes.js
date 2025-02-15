import express from "express";
import {
   addToCart,
   getCartItems,
   updateCartItem,
   removeCartItem,
   clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:user_id", getCartItems);
router.put("/update/:cart_id", updateCartItem);
router.delete("/remove/:cart_id", removeCartItem);
router.delete("/clear", clearCart);

export default router;