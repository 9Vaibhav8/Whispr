
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Whispr',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    
  },
});

export default storage;
