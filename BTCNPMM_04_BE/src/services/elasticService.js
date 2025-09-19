const { Client } = require('@elastic/elasticsearch');
const Product = require('../models/product');
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

/**
 * Search product in Elasticsearch
 * @param {string} keyword - search by name or description
 * @param {object} filters - filter by { priceMin, priceMax, category }
 */
async function searchProduct(keyword, filters = {}, from = 0, size = 10) {
  const { priceMin, priceMax, category } = filters;

  const must = [];
  if (keyword) {
    must.push({
      multi_match: {
        query: keyword,
        fields: ['name', 'description'],
        fuzziness: 'AUTO'
      }
    });
  }

  const filter = [];
  if (priceMin !== undefined || priceMax !== undefined) {
    filter.push({
      range: {
        price: {
          ...(priceMin !== undefined ? { gte: priceMin } : {}),
          ...(priceMax !== undefined ? { lte: priceMax } : {})
        }
      }
    });
  }

  if (category) {
    filter.push({ term: { category } });
  }

  const query = {
    bool: {
      must,
      filter
    }
  };

  console.log(">>> filters:", filters);


  const result = await client.search({
    index: 'products',
    from,
    size,
    query
  });

  return {
    hits: result.hits.hits.map(hit => ({
      _id: hit._id,
      ...hit._source
    })),
    total: result.hits.total.value,
  };
}

const getRelatedProducts = async (productId, limit = 4) => {
  // 1. Lấy thông tin sản phẩm gốc từ Mongo
  const product = await Product.findById(productId);
  if (!product) return [];

  try {
    // 2. Query Elasticsearch
    const result = await client.search({
      index: "products",
      size: limit,
      query: {
        bool: {
          must: [
            { match: { category: product.category } },
            {
              more_like_this: {
                fields: ["name"],
                like: [{ _id: productId.toString() }], // đảm bảo là string
                min_term_freq: 1,
                max_query_terms: 12
              }
            }
          ],
          must_not: [
            { term: { _id: productId.toString() } } // Loại chính nó ra
          ]
        }
      }
    });

    const hits = result.hits.hits.map(hit => hit._source);
    if (hits.length > 0) return hits;

    // 3. Fallback: lấy theo category từ MongoDB nếu ES rỗng
    return await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(limit);
  } catch (err) {
    console.error("Elasticsearch query error:", err);
    // fallback khi ES lỗi
    return await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(limit);
  }
};


module.exports = { searchProduct, getRelatedProducts };
