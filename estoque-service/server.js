require('dotenv').config();
const express = require('express');
const estoqueRouter = require('./routes/estoque');
const { iniciarConsumidor } = require('./rabbitmq');

const app = express();

app.use(express.json());
app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

app.use('/estoque', estoqueRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  iniciarConsumidor();
});
