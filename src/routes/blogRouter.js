const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const upload = require("../middlewares/upload"); // Middleware for image upload

// GET all blogs with optional pagination and filters
router.get("/", blogController.getAllBlogs);

// GET a single blog by ID
router.get("/:id", blogController.getBlog);

// CREATE a new blog (with optional image)
router.post("/", upload.single("image"), blogController.createBlog);

// UPDATE an existing blog (optionally replace image)
router.put("/:id", upload.single("image"), blogController.updateBlog);

// DELETE a blog (and delete image if exists)
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
