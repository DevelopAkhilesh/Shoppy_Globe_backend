import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the project root (two levels up from utils/)
dotenv.config({ path: join(__dirname, '../../.env') });

const products = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality noise-canceling wireless headphones with 20-hour battery life.',
    stockQuantity: 50,
    category: 'Electronics',
    imageUrl: 'https://example.com/headphones.jpg',
  },
  {
    name: 'Running Shoes',
    price: 59.99,
    description: 'Lightweight and comfortable running shoes for all terrains.',
    stockQuantity: 30,
    category: 'Footwear',
    imageUrl: 'https://example.com/shoes.jpg',
  },
  {
    name: 'Coffee Mug',
    price: 12.99,
    description: 'Ceramic coffee mug with a funny quote to start your day.',
    stockQuantity: 100,
    category: 'Home & Kitchen',
    imageUrl: 'https://example.com/mug.jpg',
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();