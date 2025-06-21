const db = require("../libs/database");

// Get blogs with pagination
exports.fetchBlogs = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await db
    .from("blogs")
    .select("*", { count: "exact" })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
    data,
  };
};

// Get one blog by ID
exports.getBlogById = async (id) => {
  const { data, error } = await db
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Create a new blog
exports.createBlog = async (blog) => {
  const { data, error } = await db.from("blogs").insert(blog).select().single();

  if (error) throw new Error(error.message);
  return data;
};

// Update a blog by ID
exports.updateBlog = async (id, updates) => {
  const { data, error } = await db
    .from("blogs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete a blog by ID
exports.deleteBlog = async (id) => {
  const { error } = await db.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { message: "Blog deleted successfully." };
};
