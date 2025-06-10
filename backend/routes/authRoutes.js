import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import { registerUser, loginUser, getUserDetails, logoutUser, checkAuth } from '../controllers/authController.js';

const router = express.Router();

// Public routes (No authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // POST request for logout
router.get('/check', authMiddleware, checkAuth);
// Protected route (authentication required)
router.get('/profile', authMiddleware, getUserDetails);

export default router;
