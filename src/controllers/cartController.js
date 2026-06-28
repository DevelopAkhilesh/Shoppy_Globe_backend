import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { sendSuccess } from "../utils/response.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { isValidObjectId } from "../utils/validateId.js";


// 1. ADD PRODUCT TO CART
// POST /api/cart

 export const addToCart = catchAsync(async(req,res,)=>{
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id; // From authentication middleware

  // Validate input
  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }
  if (!isValidObjectId(productId)) {
    throw new AppError('Invalid product ID format', 400);
  }
  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

   // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  // Find user's cart or create a new one
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

   // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

    if (existingItemIndex > -1) {
    // Update quantity (add to existing)
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({ productId, quantity });
  }

  // Save cart
  await cart.save();
   // Populate product details for response
  await cart.populate('items.productId', 'name price imageUrl');

  sendSuccess(res, cart, 'Product added to cart successfully', 200);
}) ;


// 2. UPDATE CART ITEM QUANTITY
// PUT /api/cart/:productId

export const updateCartItem = catchAsync(async (req, res) =>{
       const { productId } = req.params;
       const { quantity } = req.body;
       const userId = req.user.id;

        // Validate input
  if (!isValidObjectId(productId)) {
    throw new AppError('Invalid product ID format', 400);
  }
  if (quantity === undefined || quantity < 0) {
    throw new AppError('Quantity must be a non-negative number', 400);
  }
    const cart = await Cart.findOne({ userId });
   if (!cart) {
    throw new AppError('Cart not found', 404);
  }

   // Find the item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
   if (itemIndex === -1) {
    throw new AppError('Product not found in cart', 404);
  }
 // If quantity is 0, remove the item (optional, but nice behavior)
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.productId', 'name price imageUrl');

  sendSuccess(res, cart, 'Cart updated successfully', 200);
});

// 3. REMOVE PRODUCT FROM CART
// DELETE /api/cart/:productId

export const removeFromCart = catchAsync(async(req,res)=>{
    const { productId } = req.params;
  const userId = req.user.id;

  if(!isValidObjectId(productId)){
    throw new AppError('Invalid product ID format', 400);

  }
   // Find user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }
  // Find item and remove
  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  if (cart.items.length === initialLength) {
    throw new AppError('Product not found in cart', 404);
  }
    await cart.save();
  await cart.populate('items.productId', 'name price imageUrl');

  sendSuccess(res, cart, 'Product removed from cart successfully', 200);
});
