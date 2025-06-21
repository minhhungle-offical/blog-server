const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Import the Cloudinary upload middleware

// POST /upload-image — Upload a single image
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No file was uploaded.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully.",
    url: req.file.path, // Cloudinary URL of the uploaded image
    publicId: req.file.filename, // Cloudinary public_id (for future reference/deletion)
  });
});

module.exports = router;
