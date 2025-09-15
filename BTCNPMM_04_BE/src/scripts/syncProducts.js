// syncProducts.js
require('dotenv').config(); // đọc file .env
const mongoose = require('mongoose');
const Product = require('../models/product'); // đường dẫn tới file model Product của bạn
const { Client } = require('@elastic/elasticsearch');

// ================= MongoDB =================
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ================= Elasticsearch =================
const client = new Client({
    node: 'https://127.0.0.1:9200',

    auth: {
        username: 'elastic',
        password: '77+fZMPtphQKfAIW*IVj' 
    },
    tls: {
        rejectUnauthorized: false  
    }
});
// Tạo index products nếu chưa tồn tại
async function ensureIndex() {
    const exists = await client.indices.exists({ index: 'products' });

    // exists.body === true nếu index tồn tại
    if (!exists) {
        await client.indices.create({
            index: 'products',
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        description: { type: 'text' },
                        price: { type: 'float' },
                        category: { type: 'keyword' },
                        image: { type: 'text' },
                        stock: { type: 'integer' }
                    }
                }
            }
        });
        console.log('Tạo index "products" thành công');
    } else {
        console.log('Index "products" đã tồn tại');
    }
}


// Đồng bộ dữ liệu từ MongoDB sang Elasticsearch
async function syncProducts() {
    try {
        await ensureIndex();

        const products = await Product.find();
        console.log(`Tìm thấy ${products.length} sản phẩm trong MongoDB`);

        for (const p of products) {
            await client.index({
                index: 'products',
                id: p._id.toString(),
                document: {
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    category: p.category,
                    image: p.image,
                    stock: p.stock
                }
            });
            console.log(`Đã đồng bộ product ${p._id}`);
        }

        await client.indices.refresh({ index: 'products' });
        console.log('Đã đồng bộ tất cả products sang Elasticsearch');
    } catch (err) {
        console.error('Lỗi khi đồng bộ products:', err);
    } finally {
        mongoose.disconnect();
    }
}

// Chạy đồng bộ
syncProducts();
