const express = require('express');

const router = express.Router();

const Product = require('../models/Product');

function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        console.log('Query parameter q:', q);
        if (!q || q.trim() === '') {
            return res.json([]);
        }
        const normalizedQuery = removeDiacritics(q.trim());
        console.log('Normalized query:', normalizedQuery);
        const regex = new RegExp(normalizedQuery, 'i');
        console.log('Regex:', regex);
        const allProducts = await Product.find({}, 'tenSanPham -_id');
        console.log('All product names:', allProducts.map(p => p.tenSanPham));
        const suggestions = allProducts
            .map(p => p.tenSanPham)
            .filter(name => {
                const normalizedName = removeDiacritics(name);
                const isMatch = regex.test(normalizedName);
                console.log(`Checking "${name}" -> "${normalizedName}" : match = ${isMatch}`);
                return isMatch;
            })
            .slice(0, 10);
        console.log('Suggestions:', suggestions);
        res.json(suggestions);
    } catch (err) {
        console.error('Lỗi ở /suggestions:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// 🔍 Lấy tất cả sản phẩm, lọc theo giới tính, tìm kiếm theo `q`
router.get('/', async (req, res) => {
    try {
        const { gioiTinh, q } = req.query;
        let query = {};
        if (gioiTinh) {
            if (['treem', 'trẻ em'].includes(gioiTinh.toLowerCase())) {
                query.gioiTinh = { $in: ['Bé Nam', 'Bé Nữ'] };
            } else {
                query.gioiTinh = new RegExp(`^${gioiTinh}$`, 'i');
            }
        }
        if (q) {
            query.$text = { $search: q };
        }
        let products;
        if (q) {
            products = await Product
                .find(query, { score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } });
        } else {
            products = await Product.find(query);
        }
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        res.json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo id:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;