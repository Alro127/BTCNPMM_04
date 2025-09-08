const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'http://localhost:9200',
  apiVersionCompatibility: true // client sẽ gửi đúng header compatible-with=8
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

  const result = await client.search({
    index: 'products',
    from,
    size,
    query
  });

  return result.hits.hits.map(hit => hit._source);
}

module.exports = { searchProduct };
