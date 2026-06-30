import express from "express";
import { getAllProducts,getProductById } from "../controllers/productController.js";


const productRoutes = express.Router();

productRoutes.get("/",getAllProducts); // getiing all the products
productRoutes.get('/:id',getProductById); // getiing product by id

export default productRoutes;