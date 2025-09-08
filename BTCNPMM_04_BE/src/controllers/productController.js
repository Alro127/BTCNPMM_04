const productService = require('../services/productService');

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

module.exports = { getProducts, getCategories, getProductById, createProduct };
