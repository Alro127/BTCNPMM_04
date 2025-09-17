const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }, // đánh giá sao (1-5)
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }], // danh sách user đã like comment
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, { timestamps: true });

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
