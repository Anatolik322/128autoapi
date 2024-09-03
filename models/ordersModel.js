const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
    items: Object,
    firstName: String,
    lastName: String,
    fatherName: String,
    city: String,
    street: String,
    postNumber: Number
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
