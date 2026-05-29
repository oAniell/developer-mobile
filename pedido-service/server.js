require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pedidosRouter = require('./routes/pedidos');

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

app.use('/pedidos', pedidosRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
