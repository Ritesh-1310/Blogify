const Blog = require("../models/blog");
const Comment = require("../models/comment");
const uploadImage = require("../services/uploadImage");

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({}).populate("createdBy", "fullName");
  res.json(blogs);
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy", "fullName");
  const comments = await Comment.find({ blogId: blog._id }).populate("createdBy", "fullName");
  res.json({ blog, comments });
};

exports.createBlog = async (req, res) => {
  const { title, body } = req.body;
  const result = await uploadImage(req.file);

  const blog = await Blog.create({
    title,
    body,
    coverImageURL: result.secure_url,
    createdBy: req.user._id,
  });
  res.status(201).json(blog);
};

exports.updateBlog = async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (!blog) return res.status(404).json({ message: "Not found" });
  if (blog.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  blog.title = title;
  blog.body = body;
  if (req.file) {
    const result = await uploadImage(req.file);
    blog.coverImageURL = result.secure_url;
  }
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });
  if (blog.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });
  await Blog.deleteOne({ _id: blog._id });
  res.json({ message: "Deleted successfully" });
};

exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });
  res.status(201).json(comment);
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });
  await Comment.deleteOne({ _id: comment._id });
  res.json({ message: "Comment deleted" });
};

exports.getCommentsForBlog = async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy", "fullName");
  res.json(comments);
};

exports.getBlogsByUser = async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.user._id });
  res.json(blogs);
};
