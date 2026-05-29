const express = require('express');
const router = express.Router();
const { publicarPedido } = require('../rabbitmq');
const { pedidos } = require('../data/pedidos');

router.post('/', async (req, res) => {
  try {
    const { id, produto, quantidade } = req.body;
    const pedido = { id, produto, quantidade };
    pedidos.push(pedido);
    await publicarPedido(pedido);
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ error: `RabbitMQ indisponível ou erro interno: ${err.message}` });
  }
});

router.get('/', (_req, res) => {
  try {
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
