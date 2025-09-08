// createIndex.js
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function createIndex() {
    const { body: exists } = await client.indices.exists({ index: 'products' });
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
        console.log('Đã tạo index "products"');
    } else {
        console.log('Index "products" đã tồn tại');
    }
}

createIndex().catch(console.error);
