require('dotenv').config();
const app = require('./app');
const { iniciarConsumidor } = require('./rabbitmq');
const { carregarDoFirestore } = require('./data/estoqueRepository');
const { estoque } = require('./data/estoque');

const PORT = process.env.PORT || 3002;

(async () => {
  await carregarDoFirestore(estoque);
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    iniciarConsumidor();
  });
})();
