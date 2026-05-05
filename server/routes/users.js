const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../data/db');

router.get('/', async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json({ message: 'Usuário excluído' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
