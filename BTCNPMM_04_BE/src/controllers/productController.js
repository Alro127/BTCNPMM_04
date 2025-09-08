const productService = require('../services/productService');
const { searchProduct } = require('../services/elasticService');

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

        return res.status(200).json(result);
    } catch (err) {
        console.error("Lỗi getProducts:", err);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

const getProductsWithElasticSearch = async (req, res) => {
    try {
        const keyword = req.query.q || '';
        const filters = {
            priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
            priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
            category: req.query.category || undefined
        };

        const page = req.query.page ? Number(req.query.page) : 1; // trang hiện tại
        const limit = req.query.limit ? Number(req.query.limit) : 10; // số item mỗi trang
        const from = (page - 1) * limit;

        const products = await searchProduct(keyword, filters, from, limit);

        res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                count: products.length
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}



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
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.status(200).json(product);
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

module.exports = { getProducts, getProductsWithElasticSearch, getCategories, getProductById, createProduct };
