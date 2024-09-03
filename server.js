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
            to: "anatoliysynecun2016@gmail.com",
            subject: 'Підтвердження замовлення',
            text: `Дякуємо за ваше замовлення, !Ваше замовленняrrrrrrr:`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Лист успішно надіслано!', status: 200 });
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

app.get('/homeitems', async (req, res) => {
    try {
        const items = await Item.find().limit(6);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних', error });
    }
});


// app.get('/users', async (req, res) => {
//     try {
//         const people = await People.find();
//         res.json(people);
//     } catch (error) {
//         console.error('Помилка при отриманні даних:', error);
//         res.status(500).json({ message: 'Помилка при отриманні даних', error });
//     }
// });

// =====================ТОВАРИ В КАТЕГОРІЇ=======================================================
app.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const items = await Item.find({ category }).sort({ price: -1 });
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

app.listen(PORT, console.log("Server is running on port ", PORT))