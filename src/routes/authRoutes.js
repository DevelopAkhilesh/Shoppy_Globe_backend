import { loginUser,registerUser } from "../controllers/authController.js";
import express from "express";

const authRoutes = express.Router();

// Public routes (no authentication needed)
authRoutes.post('/register', registerUser);   // POST /api/register No token is generated
authRoutes.post('/login', loginUser);         // POST /api/login

export default authRoutes;