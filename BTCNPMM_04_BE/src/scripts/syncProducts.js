// syncProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const { Client } = require('@elastic/elasticsearch');

// ================= MongoDB =================
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ================= Elasticsearch =================
const client = new Client({
    node: 'https://127.0.0.1:9200',
    auth: {
        username: 'elastic',
        password: '77+fZMPtphQKfAIW*IVj' // ⚠️ thay bằng password thật
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Đảm bảo index tồn tại trước khi đồng bộ
async function ensureIndex() {
    const exists = await client.indices.exists({ index: 'products' });

    if (!exists) {
        console.log('🔧 Index "products" chưa tồn tại → tạo mới...');
        await client.indices.create({
            index: 'products',
            body: {
                settings: {
                    analysis: {
                        analyzer: {
                            product_name_analyzer: {
                                type: "custom",
                                tokenizer: "standard",
                                filter: ["lowercase", "asciifolding"]
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        name: { type: 'text', analyzer: 'product_name_analyzer' },
                        description: { type: 'text' },
                        price: { type: 'float' },
                        category: { type: 'keyword' },
                        images: { type: 'keyword' },
                        stock: { type: 'integer' },
                        views: { type: 'integer' },
                        buyers: { type: 'integer' },
                        createdAt: { type: 'date' },
                        updatedAt: { type: 'date' }
                    }
                }
            }
        });
        console.log('✅ Đã tạo index "products" thành công');
    } else {
        console.log('ℹ️ Index "products" đã tồn tại');
    }
}

// Đồng bộ dữ liệu từ MongoDB sang Elasticsearch
async function syncProducts() {
    try {
        await ensureIndex();

        const products = await Product.find();
        console.log(`📦 Tìm thấy ${products.length} sản phẩm trong MongoDB`);

        const operations = [];

        for (const p of products) {
            operations.push({
                index: { _index: 'products', _id: p._id.toString() }
            });
            operations.push({
                name: p.name,
                description: p.description || '',
                price: p.price,
                category: p.category || '',
                images: p.images || [],
                stock: p.stock,
                views: p.stats?.views || 0,
                buyers: p.stats?.buyers || 0,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            });
        }

        if (operations.length > 0) {
            const bulkResponse = await client.bulk({ refresh: true, operations });

            if (bulkResponse.errors) {
                console.error('❌ Một số documents bị lỗi khi đồng bộ:', bulkResponse.items);
            } else {
                console.log(`✅ Đồng bộ ${products.length} sản phẩm sang Elasticsearch thành công`);
            }
        } else {
            console.log('⚠️ Không có sản phẩm nào để đồng bộ');
        }

    } catch (err) {
        console.error('❌ Lỗi khi đồng bộ products:', err.meta?.body?.error || err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Đã đóng kết nối MongoDB');
    }
}

// Chạy đồng bộ
syncProducts();
