const express = require('express');
const cors = require('cors');
const pedidosRouter = require('./routes/pedidos');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/pedidos', pedidosRouter);

module.exports = app;
