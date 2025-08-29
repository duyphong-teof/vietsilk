const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  maSanPham: { type: String, required: true },
  tenSanPham: { type: String, required: true },
  danhMuc: { type: String, required: true },
  gia: { type: Number, required: true },
  moTa: { type: String },
  kichThuoc: { type: String },
  mauSac: { type: String },
  hinhAnh: { type: [String] },
  gioiTinh: String,
}, { timestamps: true });

productSchema.index({ tenSanPham: 'text' });



module.exports = mongoose.model('Product', productSchema);
