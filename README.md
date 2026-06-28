# 🛒 Shoppyglobe API

A production-ready e‑commerce backend built with **Node.js**, **Express**, **MongoDB**, and **JWT** authentication.  
It supports user registration/login, product browsing, and a protected shopping cart.

---

## ✨ Features

- ✅ User Registration & Login (JWT-based)
- ✅ Product listing & single product details
- ✅ Protected cart operations (add, update, remove)
- ✅ Input validation & global error handling
- ✅ MongoDB data persistence with Mongoose
- ✅ Modular MVC architecture (with utils for reusability)
- ✅ Tested with ThunderClient

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **Development**: Nodemon

---

## 📁 Project Structure

```
shoppyglobe-backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Cart.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── cartController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── cartRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       ├── catchAsync.js
│       ├── appError.js
│       ├── jwt.js
│       ├── validateId.js
│       └── response.js
├── .env
├── .gitignore
├── package.json
├── index.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shoppyglobe-backend.git
cd shoppyglobe-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shoppyglobe
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

> **Note**: If you use MongoDB Atlas, replace the URI accordingly.

### 4. Seed initial products (optional)

```bash
node --env-file=.env src/utils/seedProduct.js
```

This inserts three sample products into the `products` collection.

### 5. Start the server

#### Development (with auto‑restart):
```bash
npm run dev
```

#### Production:
```bash
npm start
```

The server will run at `http://localhost:5000`.

---

## 📡 API Endpoints

All responses follow a consistent JSON structure:

```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... }
}
```

Errors return:

```json
{
  "success": false,
  "message": "Error description"
}
```

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/register` | Register a new user | ❌ No |
| POST   | `/api/login`    | Login and receive JWT | ❌ No |

#### Sample: Register

**Request**:
```http
POST http://localhost:5000/api/register
Content-Type: application/json
```
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "user": {
      "_id": "6a409c10eab693979c3b31e8",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2026-06-28T03:59:12.287Z",
      "updatedAt": "2026-06-28T03:59:12.287Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Sample: Login

**Request**:
```http
POST http://localhost:5000/api/login
Content-Type: application/json
```
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 📦 Products (Public)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/api/products` | Get all products | ❌ No |
| GET    | `/api/products/:id` | Get a single product | ❌ No |

#### Sample: GET all products

**Request**:
```http
GET http://localhost:5000/api/products
```

**Response** (200):
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "6a40eee951016afec1523066",
      "name": "Wireless Headphones",
      "price": 79.99,
      "description": "High-quality noise-canceling wireless headphones with 20-hour battery life.",
      "stockQuantity": 50,
      "category": "Electronics",
      "imageUrl": "https://example.com/headphones.jpg",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Sample: GET product by ID

**Request**:
```http
GET http://localhost:5000/api/products/6a40eee951016afec1523066
```

**Response** (200):
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": { ... }
}
```

---

### 🛒 Cart (Protected – requires JWT)

All cart endpoints require a valid token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/cart` | Add product to cart |
| PUT    | `/api/cart/:productId` | Update product quantity in cart |
| DELETE | `/api/cart/:productId` | Remove product from cart |

#### Sample: Add to Cart

**Request**:
```http
POST http://localhost:5000/api/cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
```json
{
  "productId": "6a40eee951016afec1523066",
  "quantity": 2
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "items": [
      {
        "productId": {
          "_id": "6a40eee951016afec1523066",
          "name": "Wireless Headphones",
          "price": 79.99
        },
        "quantity": 2
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Sample: Update Quantity

**Request**:
```http
PUT http://localhost:5000/api/cart/6a40eee951016afec1523066
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "quantity": 5
}
```

**Response** (200): Cart object with updated quantity.

#### Sample: Remove from Cart

**Request**:
```http
DELETE http://localhost:5000/api/cart/6a40eee951016afec1523066
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Product removed from cart successfully",
  "data": { ... }
}
```

---

## 🧪 Testing with ThunderClient

Import all endpoints into ThunderClient and test them in this order:

1. **Register** – create a user.
2. **Login** – obtain a JWT token.
3. **GET /products** – view all products and copy an ID.
4. **GET /products/:id** – fetch a single product.
5. **POST /cart** – add that product to your cart.
6. **PUT /cart/:productId** – update its quantity.
7. **DELETE /cart/:productId** – remove the product.

All protected endpoints must include the `Authorization` header with the token.



---

## 🗃️ Database Schema

### Users
- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `createdAt`, `updatedAt` (timestamps)

### Products
- `name` (String, required)
- `price` (Number, required)
- `description` (String, required)
- `stockQuantity` (Number, required, default 0)
- `category` (String, default 'Uncategorized')
- `imageUrl` (String, default '')
- `createdAt`, `updatedAt`

### Cart
- `userId` (ObjectId, ref: 'User', required, unique)
- `items`: Array of:
  - `productId` (ObjectId, ref: 'Product', required)
  - `quantity` (Number, min 1, required)
- `createdAt`, `updatedAt`

---

## 🚨 Error Handling

The API uses a global error handler that returns a consistent error response:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` – Bad Request (e.g., missing fields, invalid ID)
- `401` – Unauthorized (missing or invalid token)
- `404` – Not Found (resource doesn't exist)
- `500` – Internal Server Error

---

## 📦 Deployment

To deploy on platforms like Render, Heroku, or Railway:

1. Set environment variables in the hosting dashboard.
2. Use the start script: `npm start`.
3. Ensure your MongoDB URI allows connections from the deployment IP.

---

## 🤝 Contributing

This project was built as an assignment. Feel free to fork and enhance it.

---

## 📝 License

MIT

---

## 👤 Author

**Your Name**  
GitHub: [Akhilesh Guleria](https://github.com/DevelopAkhilesh/Shoppy_Globe_backend)  
Email: developakhilesh01@gmail.com

---

