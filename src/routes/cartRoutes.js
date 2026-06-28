import express from "express";
import { protect } from "../middleware/auth.js";
import { updateCartItem,removeFromCart,addToCart } from "../controllers/cartController.js";

const cartRoutes = express.Router();

// All cart routes require authentication
cartRoutes.use(protect);

cartRoutes.post('/', addToCart);                 // POST /api/cart
cartRoutes.put('/:productId', updateCartItem);   // PUT /api/cart/:productId
cartRoutes.delete('/:productId', removeFromCart); // DELETE /api/cart/:productId

export default cartRoutes;