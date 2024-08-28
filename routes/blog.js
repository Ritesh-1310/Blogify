const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));  // Save uploads to /public/uploads
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Route to render the "Add New Blog" page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
    title: "Add New Blog",
  });
});

// Route to view a specific blog and its comments
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    if (!blog) {
      return res.status(404).render("404", { message: "Blog not found" });
    }

    return res.render("blog", {
      user: req.user,
      blog,
      comments,
      title: blog.title,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { message: "Server error" });
  }
});

// Route to handle comments on a blog post
router.post("/comment/:blogId", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { message: "Failed to add comment" });
  }
});

// Route to handle creating a new blog post with a cover image upload
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { message: "Failed to create blog" });
  }
});

// Route to render the "Edit Blog" page
router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).render("404", { message: "Blog not found" });
    }

    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).render("error", { message: "Unauthorized" });
    }

    return res.render("editBlog", {
      user: req.user,
      blog,
      title: `Edit Blog - ${blog.title}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { message: "Server error" });
  }
});

// Route to handle updating a blog post
router.post("/:id/edit", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).render("404", { message: "Blog not found" });
    }

    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).render("error", { message: "Unauthorized" });
    }

    blog.title = title;
    blog.body = body;

    if (req.file) {
      blog.coverImageURL = `/uploads/${req.file.filename}`;
    }

    await blog.save();

    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { message: "Failed to update blog" });
  }
});

// Route to handle deleting a blog post
router.post("/:id/delete", async (req, res) => {
  try {
    // Find the blog post by ID
    const blog = await Blog.findById(req.params.id);

    // If blog post is not found, render a 404 page
    if (!blog) {
      return res.status(404).render("404", { message: "Blog not found" });
    }

    // Check if the blog post was created by the current user
    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).render("error", { message: "Unauthorized" });
    }

    // Delete the blog post
    await Blog.deleteOne({ _id: req.params.id });

    // Redirect to the home page or wherever appropriate
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    // Render an error page if something goes wrong
    return res.status(500).render("error", { message: "Failed to delete blog" });
  }
});


module.exports = router;
