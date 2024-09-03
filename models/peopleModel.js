const mongoose = require('mongoose');

// Створюємо схему для колекції `people`
const peopleSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String
});

// Створюємо модель на основі схеми
const People = mongoose.model('users', peopleSchema);

module.exports = People;