const { Router } = require("express");
const multer = require("multer");
const blogController = require("../../controllers/blogController");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.get("/:id/comments", blogController.getCommentsForBlog);

router.post("/", isAuthenticated, upload.single("coverImage"), blogController.createBlog);
router.put("/:id", isAuthenticated, upload.single("coverImage"), blogController.updateBlog);
router.delete("/:id", isAuthenticated, blogController.deleteBlog);

router.post("/:id/comment", isAuthenticated, blogController.addComment);
router.delete("/comment/:commentId", isAuthenticated, blogController.deleteComment);

router.get("/user/my-blogs", isAuthenticated, blogController.getBlogsByUser);

module.exports = router;
