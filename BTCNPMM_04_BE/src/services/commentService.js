const Comment = require('../models/comment');

/**
 * Đếm tổng số bình luận của 1 sản phẩm
 * @param {string} productId 
 * @returns {number} tổng số bình luận
 */
const countCommentsByProduct = async (productId) => {
    return await Comment.countDocuments({ productId });
};

const getCommentsByProduct = async (productId) => {
    return await Comment.find({ productId }).sort({ createdAt: -1 }).populate("author", "name");
};

const createComment = async ({ productId, author, content }) => {
    const newComment = new Comment({
        author: author,
        productId: productId,
        content: content,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return await newComment.save();
}

module.exports = {
    countCommentsByProduct,
    getCommentsByProduct,
    createComment
};
