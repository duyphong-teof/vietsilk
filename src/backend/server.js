const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const OpenAI = require('openai');
const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Thiếu MONGODB_URI trong .env');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Kết nối MongoDB thành công!'))
    .catch(err => {
        console.error('Kết nối MongoDB thất bại:', err);
        process.exit(1);
    });

app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model = 'gpt-3.5-turbo' } = req.body;
        if (!messages) {
            return res.status(400).json({ error: 'Thiếu messages trong body' });
        }
        const completion = await openai.chat.completions.create({
            model,
            messages,
        });
        res.json(completion);
    } catch (error) {
        console.error('Lỗi OpenAI API:', error);
        res.status(500).json({ error: 'Lỗi OpenAI API', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server chạy ở cổng ${PORT}`);

});