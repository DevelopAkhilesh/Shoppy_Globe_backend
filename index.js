import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


import AppError from './src/utils/appError.js';
import authRoutes from './src/routes/authRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS (allows your frontend to call this API)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Log incoming requests (optional but helpful for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// connection to db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit the process if DB connection fails
  });

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Shoppyglobe API! 🚀',
    endpoints: {
      register: 'POST /api/register',
      login: 'POST /api/login',
      products: 'GET /api/products',
      productById: 'GET /api/products/:id',
      cart: 'POST /api/cart | PUT /api/cart/:productId | DELETE /api/cart/:productId',
    },
  });
});

app.use("/api",authRoutes);


//* This catches any request that doesn't match any of the above routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


//* This catches all errors thrown with `next(err)` or `throw new AppError()`
app.use((err, req, res, next) => {
  console.error('🔥 ERROR STACK:', err.stack);
  // Set default values if not provided
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Prevent leaking stack traces in production
  const response = {
    success: false,
    message: err.message,
  };

  // Only show stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send the error response
  res.status(err.statusCode).json(response);
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
