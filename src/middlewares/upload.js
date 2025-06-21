const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "blog_images", // Target folder in Cloudinary
      format: "webp", // Convert to WebP for optimized delivery
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // Unique filename
      transformation: [
        {
          width: 800, // Max width constraint
          crop: "limit", // Maintain aspect ratio, don't crop
          quality: "auto", // Let Cloudinary determine optimal quality
        },
      ],
    };
  },
});

// Create Multer middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size: 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WebP image formats are allowed."));
    }
  },
});

module.exports = upload;
