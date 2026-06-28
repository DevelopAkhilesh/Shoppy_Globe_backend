import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Middleware to protect routes - only logged-in users can access
export const protect = catchAsync(async (req, res, next) => {
  // 1. Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Attach user ID to request
  req.user = { id: decoded.id };
  next();
});