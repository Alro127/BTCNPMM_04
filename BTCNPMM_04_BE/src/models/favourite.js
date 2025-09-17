const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Favourite = mongoose.model('favorite', favouriteSchema);
module.exports = Favourite;
