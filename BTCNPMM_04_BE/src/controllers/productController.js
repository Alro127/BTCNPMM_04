const productService = require('../services/productService');
const elasticService = require('../services/elasticService');

const getProducts = async (req, res) => {
    try {
        const { page, limit, search, category, minPrice, maxPrice } = req.query;

        const result = await productService.getProducts({
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            search,
            category,
            minPrice,
            maxPrice,
        });

        return res.json({
            success: true,
            data: result.products,
            pagination: {
                page,
                limit,
                count: result.total
            }
        });
    } catch (err) {
        console.error("Lỗi getProducts:", err);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

const getProductsWithElasticSearch = async (req, res) => {
    console.log(">>> Controller hit: getProductsWithElasticSearch");
    try {
        const keyword = req.query.search || '';
        const filters = {
            priceMin: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            priceMax: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            category: req.query.category || undefined
        };

        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const from = (page - 1) * limit;

        const result = await elasticService.searchProduct(keyword, filters, from, limit);

        res.json({
            success: true,
            data: result.hits,
            pagination: {
                page,
                limit,
                count: result.total
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};




const getCategories = async (req, res) => {
    try {
        const categories = await productService.getCategories();
        res.json({ categories });
    } catch (err) {
        console.error("Error getCategories:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const result = await productService.getProductById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json({
            success: true,
            data: result
        }
        );
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: 'Thêm sản phẩm thất bại', error: err.message });
    }
};

const increaseView = async (req, res) => {

    try {
        const { id } = req.params;

        const product = await productService.increaseProductView(id);

        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        res.json({ success: true, product });
    } catch (err) {
        console.error("Lỗi tăng view:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const recordRecentView = async (req, res) => {
    try {
        const userId = req.user?._id;
        const productId = req.params.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
        }
        await productService.recordRecentView(userId, productId);
        res.json({ success: true });
    } catch (err) {
        console.error("Lỗi recordRecentView:", err);
    }
};

const getRecentViewsByUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
        }
        const recentViews = await productService.getRecentViewsByUser(userId);
        res.json({ success: true, recentViews });
    } catch (err) {
        console.error("Lỗi getRecentViewsByUser:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const recordFavourite = async (req, res) => {
    try {
        const userId = req.user?._id;
        const productId = req.params.id;
        if (!userId) return res.status(401).json({ success: false, message: "Chưa đăng nhập" });

        const result = await productService.recordFavourite(userId, productId);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error("Lỗi recordFavourite:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getFavouritesByUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
        }
        const favourites = await productService.getFavouritesByUser(userId);
        res.json({ success: true, favourites });
    } catch (err) {
        console.error("Lỗi getFavourites:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getRelatedProducts = async (req, res) => {
    try {
        const productId = req.query.productId;
        const limit = parseInt(req.query.limit) || 4;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Thiếu productId" });
        }
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }
        const relatedProducts = await elasticService.getRelatedProducts(productId, limit);
        res.json({ success: true, relatedProducts });
    } catch (err) {
        console.error("Lỗi getRelatedProducts:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { getRelatedProducts, recordFavourite, getFavouritesByUser, getRecentViewsByUser, recordRecentView, increaseView, getProducts, getProductsWithElasticSearch, getCategories, getProductById, createProduct };
