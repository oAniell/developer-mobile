require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

module.exports = app;
