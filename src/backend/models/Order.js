const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }
  ],
  total: Number,
  address: String,
  status: { type: String, default: 'Đang xử lý' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
