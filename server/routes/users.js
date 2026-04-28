const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../data/db');

router.get('/', (_req, res) => {
  const db = readDb();
  res.json(db.users);
});

router.post('/', (req, res) => {
  const db = readDb();
  const user = req.body;
  db.users.push(user);
  writeDb(db);
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const index = db.users.findIndex(u => parseInt(u.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  db.users[index] = { ...db.users[index], ...req.body };
  writeDb(db);
  res.json(db.users[index]);
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const index = db.users.findIndex(u => parseInt(u.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  db.users.splice(index, 1);
  writeDb(db);
  res.status(200).json({ message: 'Usuário excluído' });
});

module.exports = router;
