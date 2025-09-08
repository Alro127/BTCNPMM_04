const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },         // Tên sản phẩm
    price: { type: Number, required: true },        // Giá
    description: { type: String },                  // Mô tả
    image: { type: String },                        // Ảnh (link hoặc base64)
    category: { type: String },                     // Loại sản phẩm
    stock: { type: Number, default: 0 },            // Số lượng tồn
}, { timestamps: true }); // tự thêm createdAt, updatedAt

const Product = mongoose.model('product', productSchema);

module.exports = Product;
