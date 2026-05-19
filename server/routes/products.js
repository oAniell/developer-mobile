const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, getProductById } = require('../data/db');
const { autenticar } = require('../middleware/protect');

router.get('/', async (_req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', autenticar, async (req, res) => {
  try {
    const product = await createProduct({ ...req.body, userId: req.usuario.id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', autenticar, async (req, res) => {
  try {
    const produto = await getProductById(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    if (produto.userId !== req.usuario.id) return res.status(403).json({ mensagem: 'Você não tem permissão para modificar este produto' });
    const updated = await updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', autenticar, async (req, res) => {
  try {
    const produto = await getProductById(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    if (produto.userId !== req.usuario.id) return res.status(403).json({ mensagem: 'Você não tem permissão para modificar este produto' });
    await deleteProduct(req.params.id);
    res.status(200).json({ message: 'Produto excluído' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
