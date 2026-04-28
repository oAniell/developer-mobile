const express = require('express');
const router = express.Router();

const users = [];

router.get('/', (_req, res) => {
  res.json(users);
});

router.post('/', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;