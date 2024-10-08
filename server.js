const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const nodemailer = require('nodemailer');
const connectDB = require("./config/db")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
const Item = require('./models/itemsModel');
const People = require('./models/peopleModel');
const Order = require('./models/ordersModel');



app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));
app.use(cors());

connectDB()

app.get('/', async (req, res) => {
    res.send('<h1> Hello </h1>');
}
)

// =====================ЗАМОВЛЕННЯ=======================================================
app.post('/order', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: 'Замовлення успішно створено', status: 201, newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при створенні замовлення', error });
    }
});

app.post('/email_order', async (req, res) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            service: 'gmail',
            secure: true,
            auth: {
                user: 'orest.rudenko.fop@gmail.com',
                pass: 'lcuj dksb dhfl dbwp'
            }
        });

        const mailOptions = {
            from: 'noreply.shop',
            to: "128packworks@gmail.com",
            subject: 'Нове замовлення',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="text-align: center; color: #f28a0a;">Деталі Замовлення</h2>
                <p><strong>Прізвище:</strong> ${req.body.lastName}</p>
                <p><strong>Ім'я:</strong> ${req.body.firstName}</p>
                <p><strong>По батькові:</strong> ${req.body.middleName}</p>
                <p><strong>Email:</strong> ${req.body.email}</p>
                <p><strong>Телефон:</strong> ${req.body.phone}</p>
                <p><strong>Адреса:</strong> ${req.body.address}</p>
                <p><strong>Номер відділення:</strong> ${req.body.branchNumber}</p>

                <h3 style="color: #f28a0a;">Замовлені товари:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f28a0a; color: white;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Назва</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Кількість</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Ціна за одиницю</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Артикул</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Сума</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${req.body.cart.map(item => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.discountedPrice ? item.discountedPrice : item.price} грн</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.sku}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.discountedPrice ? item.discountedPrice : item.price * item.quantity} грн</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <p style="margin-top: 10px;"><strong>Загальна сума:</strong> ${req.body.cart.reduce((total, item) => total + (item.discountedPrice ? item.discountedPrice : item.price) * item.quantity, 0)} грн</p>
            </div>`

        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Лист успішно надіслано!', status: 200 });
    } catch (error) {
        console.error('Помилка надсилання листа:', error);
        res.status(500).json({ message: 'Сталася помилка під час надсилання листа.' });
    }
});

app.post('/send_thank_you_email', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            service: 'gmail',
            secure: true,
            auth: {
                user: '128packworks@gmail.com',
                pass: 'tjsi yrex cppx qdul'
            }
        });

        const mailOptions = {
            from: 'noreply.shop',
            to: req.body.email,
            subject: 'Дякуємо за ваше замовлення!',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="text-align: center; color: #f28a0a;">Дякуємо за ваше замовлення!</h2>
                <p>Шановний(а) ${req.body.firstName},</p>
                <p>Ми вдячні, що ви обрали наш магазин. Ваше замовлення було успішно отримане і наразі обробляється.</p>
                
                <h3 style="color: #f28a0a;">Замовлені товари:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f28a0a; color: white;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Назва</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Кількість</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Ціна за одиницю</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Сума</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${req.body.cart.map(item => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.discountedPrice ? item.discountedPrice : item.price} грн</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.discountedPrice ? item.discountedPrice : item.price * item.quantity} грн</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <p style="margin-top: 10px;"><strong>Загальна сума:</strong> ${req.body.cart.reduce((total, item) => total + (item.discountedPrice ? item.discountedPrice : item.price) * item.quantity, 0)} грн</p>
                <p>Якщо у вас виникнуть питання щодо замовлення, не соромтеся зв’язатися з нами.</p>
                <p>128packworks@gmail.com</p>
                <p>З найкращими побажаннями,</p>
                <p>Команда магазину</p>
            </div>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Лист подяки успішно надіслано!', status: 200 });
    } catch (error) {
        console.error('Помилка надсилання листа:', error);
        res.status(500).json({ message: 'Сталася помилка під час надсилання листа.' });
    }
});


app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});

app.get('/search', async (req, res) => {
    const { name } = req.query;

    if (!name || name.length < 2) {
        return res.status(400).json({ message: 'Запит повинен містити хоча б 2 символи' });
    }

    try {
        const products = await Item.find({
            name: { $regex: name, $options: 'i' },
        }).limit(10);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Виникла помилка на сервері', error: err.message });
    }
});

app.get('/homeitems', async (req, res) => {
    try {
        const items = await Item.find().limit(6).skip(13);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});



// =====================ТОВАРИ В КАТЕГОРІЇ=======================================================
app.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const items = await Item.find({ category });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});

app.get('/semilar/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const items = await Item.find({ category }).limit(6);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});

// =====================КАТЕГОРІЇ=======================================================
app.get('/items/categories', async (req, res) => {
    try {
        const items = await Item.aggregate([
            {
                $group: {
                    _id: "$category",
                    categoryUkr: { $first: "$categoryUkr" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    categoryUkr: 1
                }
            },
            {
                $sort: { categoryUkr: 1 }
            }
        ]);

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});


// =====================ТОВАР ПО ІД=======================================================
app.get('/items/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await Item.findById(id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Елемент не знайдено' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});

app.post('/items', async (req, res) => {
    try {
        const newItem = new Item({
            name: req.body.name,
            price: req.body.price,
            discountedPrice: req.body.discountedPrice,
            dropPrice: req.body.dropPrice,
            description: req.body.description,
            category: req.body.category,
            categoryUkr: req.body.categoryUkr,
            stock: req.body.stock,
            brand: req.body.brand,
            rating: req.body.rating || 4.8,
            sku: req.body.sku,
            images: req.body.images || [], // Якщо немає зображень, встановлюємо порожній масив
            reviews: req.body.reviews || [], // Якщо немає відгуків, встановлюємо порожній масив
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при додаванні товару', error });
    }
});

app.listen(PORT, console.log("Server is running on port ", PORT))