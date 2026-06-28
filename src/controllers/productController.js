import Product from "../models/product.js";
import { sendSuccess } from "../utils/response.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { isValidObjectId } from "../utils/validateId.js";

// Get all products (with optional filtering)
export const getAllProducts = catchAsync(async (req, res) => {
  // You can add query params for filtering, sorting, pagination later
  const products = await Product.find();
  sendSuccess(res, products, 'Products fetched successfully', 200);
});

// Get a single product by ID
export const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    throw new AppError('Invalid product ID format', 400);
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  sendSuccess(res, product, 'Product fetched successfully', 200);
});