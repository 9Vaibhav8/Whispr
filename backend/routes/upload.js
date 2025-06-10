import { v2 as cloudinary } from "cloudinary";
import express from 'express';
import multer from 'multer';
import storage from '../config/storage.js';
import authenticateUser from '../middleware/authMiddleware.js';
const router = express.Router();
const upload = multer({ storage });

router.post('/', authenticateUser, upload.single('image'), async(req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Whispr', // Optional folder organization
      use_filename: true, // Use the original filename
      unique_filename: false,});

    res.json({ 
      success: true,
      imageUrl:  result.secure_url,
      publicId:  result.public_id,
      userId: req.user.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});


export default router;
