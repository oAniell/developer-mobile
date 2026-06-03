const express = require('express');
const router = express.Router();
const { publicarPedido } = require('../rabbitmq');
const { pedidos } = require('../data/pedidos');

const ESTOQUE_API = process.env.ESTOQUE_API_URL || 'http://localhost:3002';

router.post('/', async (req, res) => {
  try {
    const { id, produto, quantidade } = req.body;

    // Verifica estoque disponível antes de aceitar
    try {
      const estoqueRes = await fetch(`${ESTOQUE_API}/estoque/${encodeURIComponent(produto)}`);
      if (estoqueRes.status === 404) {
        return res.status(422).json({ error: `Produto "${produto}" não encontrado no estoque` });
      }
      if (estoqueRes.ok) {
        const item = await estoqueRes.json();
        if (item.quantidade < quantidade) {
          return res.status(422).json({
            error: `Estoque insuficiente para "${produto}". Disponível: ${item.quantidade}, solicitado: ${quantidade}`,
          });
        }
      }
    } catch (estoqueErr) {
      console.warn('[Pedidos] Não foi possível verificar estoque:', estoqueErr.message);
      // Prossegue se o serviço de estoque estiver indisponível
    }

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
