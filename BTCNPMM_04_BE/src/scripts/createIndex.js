// createIndex.js
const { Client } = require('@elastic/elasticsearch');

// Khởi tạo Elasticsearch client
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

async function createIndex() {
    try {
        // Kiểm tra index có tồn tại chưa
        const exists = await client.indices.exists({ index: 'products' });

        if (!exists) {
            console.log('🔧 Index "products" chưa tồn tại → Tạo mới...');
            await client.indices.create({
                index: 'products',
                body: {
                    settings: {
                        analysis: {
                            analyzer: {
                                // Tùy chọn analyzer cho tìm kiếm tên sản phẩm
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
                            description: { type: 'text', analyzer: 'standard' },
                            price: { type: 'float' },
                            category: { type: 'keyword' },
                            images: { type: 'keyword' }, // mảng image URL
                            stock: { type: 'integer' },
                            views: { type: 'integer' },
                            buyers: { type: 'integer' },
                            createdAt: { type: 'date' },
                            updatedAt: { type: 'date' }
                        }
                    }
                }
            });
            console.log('✅ Đã tạo index "products" thành công!');
        } else {
            console.log('ℹ️ Index "products" đã tồn tại → Bỏ qua.');
        }
    } catch (err) {
        console.error('❌ Lỗi khi tạo index:', err.meta?.body?.error || err);
    }
}

// Chạy hàm tạo index
createIndex();
