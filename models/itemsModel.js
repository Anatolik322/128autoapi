const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    discountedPrice: Number,
    description: String,
    category: String,
    categoryUkr: String,
    stock: Number,
    brand: String,
    rating: Number,
    sku: String,
    images: [String],
    reviews: [
        {
            user: String,
            comment: String,
            rating: Number
        }
    ]
});

module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);