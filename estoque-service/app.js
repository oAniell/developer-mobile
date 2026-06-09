const express = require('express');
const cors = require('cors');
const estoqueRouter = require('./routes/estoque');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/estoque', estoqueRouter);

module.exports = app;
