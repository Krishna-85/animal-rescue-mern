import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: "dabkukfv7",
  api_key: "586778495952315",
  api_secret: "EzlBjsFYpe_76fvybedN9nUdeGU",
});

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path; // multer ke through file path
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'animal-rescue', // optional: folder in Cloudinary
    });

    // Upload ke baad local temp file delete kar do
    fs.unlinkSync(filePath);

    // Cloudinary URL ko request me attach kar do
    req.fileUrl = result.secure_url;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};
