const mongoose = require('mongoose');



const promoSchema = new mongoose.Schema({
    code: String,
    amount: Number,
    isUsed: Boolean
});

const Promo = mongoose.model('promo', promoSchema, 'promo');

module.exports = Promo;
