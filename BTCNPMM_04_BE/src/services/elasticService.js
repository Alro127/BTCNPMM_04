const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'https://127.0.0.1:9200',

  auth: {
    username: 'elastic',
    password: '77+fZMPtphQKfAIW*IVj'  // 👈 Mật khẩu bạn reset
  },
  tls: {
    rejectUnauthorized: false  // 👈 Bỏ qua self-signed cert
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
        fields: ['name', 'description']
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
      id: hit._id,
      ...hit._source
    })),
    total: result.hits.total.value, // ✅ Tổng số lượng match
  };
}


module.exports = { searchProduct };
