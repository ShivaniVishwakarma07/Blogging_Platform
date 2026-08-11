const express = require("express");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get comments for a post
router.get("/post/:postId", getComments);

// Add comment
router.post("/post/:postId", protect, createComment);

// Update comment
router.put("/:id", protect, updateComment);

// Delete comment
router.delete("/:id", protect, deleteComment);

module.exports = router;
