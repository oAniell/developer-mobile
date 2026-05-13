const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../firebase');

/**
 * POST /auth/register
 * Cadastra um novo usuário com senha criptografada
 */
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    // Verifica se email já existe
    const existing = await db.collection('auth_users').where('email', '==', email).get();
    if (!existing.empty) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const docRef = await db.collection('auth_users').add({ nome, email, senha: hash, perfil });

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /auth/login
 * Valida email e senha, retorna token JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const snapshot = await db.collection('auth_users').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválidos' });
    }

    const doc = snapshot.docs[0];
    const usuario = { id: doc.id, ...doc.data() };

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ mensagem: 'Login realizado com sucesso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
