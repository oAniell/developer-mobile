const express = require('express');
const router = express.Router();
const { estoque } = require('../data/estoque');
const { persistirItem } = require('../data/estoqueRepository');

router.get('/', (_req, res) => {
  try {
    res.json(estoque);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:produto', (req, res) => {
  try {
    const item = estoque.find(e => e.produto === req.params.produto);
    if (!item) return res.status(404).json({ error: 'Produto não encontrado no estoque' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { produto, quantidade } = req.body;
    if (!produto || typeof produto !== 'string' || !produto.trim()) {
      return res.status(400).json({ error: 'Produto é obrigatório' });
    }
    const qtd = Number(quantidade);
    if (!quantidade || isNaN(qtd) || qtd <= 0) {
      return res.status(400).json({ error: 'Quantidade deve ser um número positivo' });
    }

    const item = estoque.find((e) => e.produto === produto.trim());
    if (item) {
      item.quantidade += qtd;
    } else {
      estoque.push({ produto: produto.trim(), quantidade: qtd });
    }

    const resultado = estoque.find((e) => e.produto === produto.trim());
    console.log(`[Estoque] Adicionado: ${resultado.produto} | Quantidade total: ${resultado.quantidade}`);
    await persistirItem(resultado.produto, resultado.quantidade);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
