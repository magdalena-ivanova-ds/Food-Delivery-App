const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Save order to database
app.post('/api/orders', (req, res) => {
    const { customerName, customerEmail, customerAddress, customerPhone, customerCity, customerZip, items, totalPrice } = req.body;

    // Insert into orders table
    const orderQuery = `
        INSERT INTO orders (customer_name, customer_email, customer_address, customer_phone, customer_city, customer_zip, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [customerName, customerEmail, customerAddress, customerPhone, customerCity, customerZip, totalPrice];

    db.query(orderQuery, orderValues, (err, result) => {
        if (err) throw err;

        const orderId = result.insertId;

        // Insert into order_items table
        const itemQuery = `
            INSERT INTO order_items (order_id, item_name, item_price, item_quantity)
            VALUES ?
        `;
        const itemValues = items.map(item => [orderId, item.name, item.price, item.quantity]);

        db.query(itemQuery, [itemValues], (err, result) => {
            if (err) throw err;
            res.status(200).send('Order saved successfully!');
        });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
