const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.get('/', (_req, res) => {
  const db = readDb();
  res.json(db.products);
});

router.post('/', (req, res) => {
  const db = readDb();
  const product = req.body;
  db.products.push(product);
  writeDb(db);
  res.status(201).json(product);
});

router.put('/:id', (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => parseInt(p.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  db.products[index] = { ...db.products[index], ...req.body };
  writeDb(db);
  res.json(db.products[index]);
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => parseInt(p.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  db.products.splice(index, 1);
  writeDb(db);
  res.status(200).json({ message: 'Produto excluído' });
});

module.exports = router;
