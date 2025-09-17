const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },         // Tên sản phẩm
    price: { type: Number, required: true },        // Giá
    description: { type: String },                  // Mô tả
    images: [{ type: String }],                     // Danh sách ảnh (link hoặc base64)
    category: { type: String },                     // Loại sản phẩm
    stock: { type: Number, default: 0 },            // Số lượng tồn
    stats: {
        views: { type: Number, default: 0 },        // số lượt xem
        buyers: { type: Number, default: 0 },       // số khách đã mua
    }
}, { timestamps: true }); // tự thêm createdAt, updatedAt

const Product = mongoose.model('product', productSchema);

module.exports = Product;
