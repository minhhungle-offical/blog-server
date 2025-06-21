const blogService = require("../services/blogService");
const cloudinary = require("../config/cloudinary");

// GET /blogs - Fetch all blogs with optional pagination/filter
exports.getAllBlogs = async (req, res) => {
  try {
    const result = await blogService.fetchBlogs(req.query);
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch blogs.",
    });
  }
};

// GET /blogs/:id - Fetch a single blog by ID
exports.getBlog = async (req, res) => {
  try {
    const data = await blogService.getBlogById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully.",
      data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: err.message || "Blog not found.",
    });
  }
};

// POST /blogs - Create a new blog (with optional image)
exports.createBlog = async (req, res) => {
  try {
    const blog = req.body;

    // Attach Cloudinary image info if image was uploaded
    if (req.file) {
      blog.image = req.file.path;
      blog.public_id = req.file.filename;
    }

    const data = await blogService.createBlog(blog);

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create blog.",
    });
  }
};

// PUT /blogs/:id - Update a blog (and replace image if needed)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingBlog = await blogService.getBlogById(id);

    // Handle image replacement
    if (req.file) {
      updates.image = req.file.path;
      updates.public_id = req.file.filename;

      // Remove old image from Cloudinary if present
      if (existingBlog?.public_id) {
        await cloudinary.uploader.destroy(existingBlog.public_id);
      }
    }

    const data = await blogService.updateBlog(id, updates);

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to update blog.",
    });
  }
};

// DELETE /blogs/:id - Delete a blog and its Cloudinary image
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogService.getBlogById(id);

    // Delete blog from DB
    const result = await blogService.deleteBlog(id);

    // Delete image from Cloudinary if exists
    if (blog?.public_id) {
      await cloudinary.uploader.destroy(blog.public_id);
    }

    res.status(200).json({
      success: true,
      message: "Blog and image deleted successfully.",
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || "Failed to delete blog.",
    });
  }
};
