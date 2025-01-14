const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { uploader } = cloudinary;

const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temporary folder to store uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.image("landmannalaugar_iceland.jpg", {
  transformation: [
    { width: 1000, crop: "scale" },
    { quality: "auto" },
    { fetch_format: "auto" },
  ],
});
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary setup error:", error);
  } else {
    console.log("Cloudinary setup verified:", result);
  }
});

const uploadPhoto = async (filePath, folder) => {
  try {
    const result = await uploader.upload(filePath, {
      folder: folder, // e.g., "product_photos" or "supplier_photos"
    });
    console.log("Upload successful:", result);
    return result.url; // Return the uploaded file URL
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

// Set up Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = { upload, uploadPhoto };
