require('dotenv').config();
const app = require('./app');
const { carregarDoFirestore } = require('./data/pedidosRepository');
const { pedidos } = require('./data/pedidos');

const PORT = process.env.PORT || 3001;

(async () => {
  await carregarDoFirestore(pedidos);
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
})();
