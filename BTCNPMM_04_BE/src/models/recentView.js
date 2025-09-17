const mongoose = require('mongoose');

const recentViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  viewedAt: { type: Date, default: Date.now }
});

const RecentView = mongoose.model('recentView', recentViewSchema);
module.exports = RecentView;
