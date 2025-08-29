const express = require('express');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Order request body:', req.body);
    const { userId, items, total, address } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId không được để trống' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng không được để trống' });
    }
    const newOrder = new Order({ userId, items, total, address });
    await newOrder.save();
    res.status(201).json({ message: 'Đặt hàng thành công', orderId: newOrder._id });
  } catch (err) {
    console.error('Lỗi server khi tạo order:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
  }
});
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Chuyển userId sang ObjectId để so sánh chính xác
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào' });
    }

    res.json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
});

module.exports = router;
