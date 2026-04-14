const express = require('express');
const app = express();

app.use(express.json());

const users = [];
const products = [];

// Users
app.get('/users', (_req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  users.splice(index, 1);
  res.status(204).send();
});

// Products
app.get('/products', (_req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
  const product = req.body;
  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  products.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
