const Product = require('../models/product');
const Fuse = require("fuse.js");
const RecentView = require('../models/recentView');
const Favourite = require('../models/favourite');

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

const increaseProductView = async (id) => {
    return await Product.findByIdAndUpdate(
        id,
        { $inc: { "stats.views": 1 } },
        { new: true }
    );
};

const increaseProductBuyers = async (productId) => {
    return Product.findByIdAndUpdate(
        productId,
        { $inc: { "stats.buyers": 1 } },
        { new: true }
    );
};

const recordRecentView = async (userId, productId) => {
    return RecentView.findOneAndUpdate(
        { userId, productId },
        { viewedAt: new Date() },
        { upsert: true, new: true }
    );
}

const getRecentViewsByUser = async (userId, limit = 10) => {
    const recentViews = await RecentView.find({ userId })
        .sort({ viewedAt: -1 })
        .limit(limit)
        .select("productId -_id"); // ✅ chỉ lấy productId, bỏ _id

    // Trả về mảng productId thay vì document
    return recentViews.map((rv) => rv.productId.toString());
};

const recordFavourite = async (userId, productId) => {
    const existing = await Favourite.findOne({ userId, productId });

    if (existing) {
        await Favourite.deleteOne({ _id: existing._id });
        return { removed: true, message: "Đã xóa khỏi danh sách yêu thích" };
    } else {
        const newFav = await Favourite.create({
            userId,
            productId,
            createdAt: new Date()
        });
        return { removed: false, favourite: newFav, message: "Đã thêm vào danh sách yêu thích" };
    }
};


const getFavouritesByUser = async (userId, limit = 10) => {
    const favourites = await Favourite.find({ userId })
        .sort({ viewedAt: -1 })
        .limit(limit)
        .select("productId -_id");

    // Trả về mảng productId thay vì document
    return favourites.map((fv) => fv.productId.toString());
};

module.exports = { recordFavourite, getFavouritesByUser, getRecentViewsByUser, recordRecentView, increaseProductBuyers, increaseProductView, getProducts, getCategories, getProductById, createProduct };
