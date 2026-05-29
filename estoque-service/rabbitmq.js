const amqp = require('amqplib');
const { estoque } = require('./data/estoque');

const FILA = 'fila_pedidos';

async function iniciarConsumidor() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(FILA, { durable: true });
    channel.prefetch(1);

    console.log(`[Estoque] Aguardando mensagens na fila "${FILA}"...`);

    channel.consume(FILA, (msg) => {
      if (!msg) return;
      try {
        const { produto, quantidade } = JSON.parse(msg.content.toString());
        const item = estoque.find((e) => e.produto === produto);
        if (item) {
          item.quantidade -= quantidade;
        } else {
          estoque.push({ produto, quantidade: -quantidade });
        }
        const restante = estoque.find((e) => e.produto === produto).quantidade;
        console.log(`[Estoque] Produto: ${produto} | Quantidade restante: ${restante}`);
        channel.ack(msg);
      } catch (err) {
        console.error('[Estoque] Mensagem malformada:', err.message);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.error('[Estoque] Erro ao conectar ao RabbitMQ:', err.message);
  }
}

module.exports = { iniciarConsumidor };
