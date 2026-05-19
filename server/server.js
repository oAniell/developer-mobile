require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
