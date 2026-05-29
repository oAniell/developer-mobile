const amqp = require('amqplib');

const FILA = 'fila_pedidos';

async function publicarPedido(mensagem) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(FILA, { durable: true });
  channel.sendToQueue(FILA, Buffer.from(JSON.stringify(mensagem)), { persistent: true });
  await channel.close();
  await conn.close();
}

module.exports = { publicarPedido };
