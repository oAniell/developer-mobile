const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { db } = require('../firebase');
const { getUsers, createUser, updateUser, deleteUser } = require('../data/db');
const { autenticar, autorizar } = require('../middleware/protect');
const { enviarSenhaProvisoria } = require('../services/email');

router.get('/', autenticar, autorizar('admin'), async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const { name, email, perfil = 'usuario' } = req.body;

    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    const senhaProvisoria = crypto.randomBytes(6).toString('base64url');
    const hash = await bcrypt.hash(senhaProvisoria, 10);

    const existingAuth = await db.collection('auth_users').where('email', '==', email).get();
    if (existingAuth.empty) {
      await db.collection('auth_users').add({ nome: name, email, senha: hash, perfil });
    } else {
      await existingAuth.docs[0].ref.update({ nome: name, senha: hash, perfil });
    }

    const user = await createUser({ name, email });

    enviarSenhaProvisoria({ nome: name, email, senha: senhaProvisoria })
      .catch(err => console.error('Falha ao enviar email para', email, ':', err.message));

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json({ message: 'Usuário excluído' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
