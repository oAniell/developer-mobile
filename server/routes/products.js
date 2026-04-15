const express = require('express');
const router = express.Router();

const products = [];

router.get('/', (_req, res) => {
  res.json(products);
});

router.post('/', (req, res) => {
  const product = req.body;
  products.push(product);
  res.status(201).json(product);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  products.splice(index, 1);
  res.status(204).send();
});

module.exports = router;