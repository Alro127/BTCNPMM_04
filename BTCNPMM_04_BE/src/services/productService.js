const Product = require('../models/product');
const Fuse = require("fuse.js");

// Lấy danh sách sản phẩm có phân trang, tìm kiếm, filter
const getProducts = async ({ page = 1, limit = 8, search = "", category, minPrice, maxPrice }) => {
    const skip = (page - 1) * limit;

    // 1. Query ban đầu
    let query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 2. Lấy tất cả sản phẩm match query (category + price)
    const allProducts = await Product.find(query);

    let filteredProducts = allProducts;

    // 3. Nếu có từ khóa search -> dùng Fuse.js fuzzy search
    if (search) {
        const fuse = new Fuse(allProducts, {
            keys: ["name", "description"], // tìm trong name + description
            threshold: 0.4,               
        });
        const results = fuse.search(search);
        filteredProducts = results.map(r => r.item);
    }

    // 4. Phân trang
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    return {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
    };
};

const getCategories = async () => {
    return await Product.distinct("category"); // Lấy ra danh sách category duy nhất
};

const getProductById = async (id) => {
    return await Product.findById(id);
};

const createProduct = async (data) => {
    const product = new Product(data);
    return await product.save();
};

module.exports = { getProducts, getCategories, getProductById, createProduct };
