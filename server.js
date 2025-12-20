const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hyakkano Gambling Bot Web Sitesi Yayýnda!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Sunucu ${port} portunda çalýþýyor.`);
});