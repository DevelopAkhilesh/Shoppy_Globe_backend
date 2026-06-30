import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess } from '../utils/response.js';

export const registerUser = catchAsync(async(req,res,next)=>{
    
    const { username, email, password } = req.body;
// Validation: Check if all fields are provided
    if (!username || !email || !password) {
    return next(new AppError('Please provide username, email, and password', 400));
  }
//Check if user already exists
   const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });

  
   if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      return next(new AppError('Email already registered. Please login.', 400));
    }
    if (existingUser.username === username) {
      return next(new AppError('Username already taken. Please choose another.', 400));
    }
  }
  // Create new user (password will be hashed by pre-save middleware)
  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
  });
 // Generate JWT token
    // const token = generateToken(user._id);
    //Send response (password is automatically excluded via toJSON)
     sendSuccess(res, {user}, 'User registered successfully! Please login.', 201);

})

//* LOGIN - Authenticate existing user
export const loginUser = catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;
    //Validation: Check if email and password are provided
    if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
   //Find user by email (explicitly include password because we set select:false)
   const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
 // Check if user exists and password is correct
   if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  // Generate JWT token
  const token = generateToken(user._id);
// Send response
  sendSuccess(res, {
    user, // password is automatically excluded because we have toJSON
    token,
  }, 'Login successful!', 200);

})