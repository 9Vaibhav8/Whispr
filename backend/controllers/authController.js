import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateToken } from '../config/utils.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;



export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate token and set cookie
    generateToken(user._id, res);

    // Send response back with success
    res.status(201).json({
      message: 'Registration successful',
      userId: user._id,
      username: user.username
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate the JWT token and set it as a cookie
    generateToken(user._id, res);

    // Send a success response without the token in the body (since it's in the cookie)
    res.json({
      message: 'Login successful',
      userId: user._id,
      username: user.username,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req, res) => {
  try {
    // Clear the jwt cookie by setting it to an expired date
    res.cookie("jwt", "", {
      maxAge: 0, // Expired immediately
      httpOnly: true, // Prevent XSS attacks
      sameSite: "None", // CSRF protection
      secure: process.env.NODE_ENV !== "development", // Secure cookies in production
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    if (req.user) {
        const user = await User.findById(req.user.id).select("username email");
      // If the user is authenticated, send user data
      return res.json({
        message: 'User authenticated',
        user: {
          userId: req.user.id , // Use id or userId based on your token structure
          username: req.user.username,
          email: req.user.email,
        },
      });
    } else {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    // req.user will contain the decoded user data (from the JWT token)
    const userId = req.user.userId || req.user.id;  // User ID from the decoded token

    // Fetch user details from the database (or return any other data you need)
    const user = await User.findById(userId).select('-password');  // Exclude password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


