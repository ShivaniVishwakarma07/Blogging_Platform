const Post = require("../models/Post");

// Create a post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const post = await Post.create({
      title,
      content,
      author: req.userId,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.max(parseInt(limit) || 5, 1);

    const skip = (pageNumber - 1) * limitNumber;

    // Search by title or content
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Get posts
    const posts = await Post.find(searchQuery)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Count total matching posts
    const totalPosts = await Post.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalPosts / limitNumber);

    res.status(200).json({
      posts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalPosts,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get single post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email",
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.error("Get post error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can only edit your own posts",
      });
    }

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
