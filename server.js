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
                <ul style="padding-left: 20px;">
                    ${req.body.cart.map(item => `
                        <li>
                            <p><strong>Назва:</strong> ${item.name}</p>
                            <p><strong>Кількість:</strong> ${item.quantity}</p>
                            <p><strong>Ціна:</strong> ${item.price} грн</p>
                            <p><strong>Артикул:</strong> ${item.sku} грн</p>
                        </li>
                        <hr style="border: none; border-top: 1px solid #ddd;" />
                    `).join('')}
                </ul>
    
                <p><strong>Загальна сума:</strong> ${req.body.cart.reduce((total, item) => total + item.price * item.quantity, 0)} грн</p>
            </div>
        `,
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