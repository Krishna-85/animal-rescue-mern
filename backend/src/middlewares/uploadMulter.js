// backend/src/middlewares/uploadMulter.js
import multer from 'multer';

// Temporary disk storage for Multer (will delete after upload to Cloudinary)
const storage = multer.diskStorage({}); 

export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
