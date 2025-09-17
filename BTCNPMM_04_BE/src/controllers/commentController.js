const commentService = require('../services/commentService');

/**
 * API: GET /products/:id/comments/count
 */
const getCommentCount = async (req, res) => {
  try {
    const productId = req.params.id;

    const count = await commentService.countCommentsByProduct(productId);

    res.json({ success: true, productId, comments: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCommentsByProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const comments = await commentService.getCommentsByProduct(productId);
    res.json({ success: true, productId, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    const productId = req.params.id;
    const { content } = req.body;
    const author = req.user?._id;
    console.log(">>> createComment author:", author, "content:", content);
    if (!author || !content) {
      return res.status(400).json({ success: false, message: "Author and content are required" });
    }
    const newComment = await commentService.createComment({ productId, author, content });
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCommentCount,
  getCommentsByProduct,
  createComment
};
