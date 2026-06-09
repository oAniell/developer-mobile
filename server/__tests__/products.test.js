jest.mock('firebase-admin', () => ({
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({ collection: jest.fn() })),
}));

jest.mock('../data/db', () => ({
  getProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProductById: jest.fn(),
}));

process.env.JWT_SECRET = 'segredo-de-teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../data/db');

function tokenFor(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const adminToken = tokenFor({ id: 'admin1', nome: 'Admin', perfil: 'admin' });
const userToken = tokenFor({ id: 'user1', nome: 'User', perfil: 'usuario' });

beforeEach(() => jest.clearAllMocks());

describe('GET /products', () => {
  it('retorna lista de produtos sem autenticação', async () => {
    db.getProducts.mockResolvedValue([
      { id: 'p1', name: 'Notebook', price: 3000, userId: 'user1' },
    ]);

    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ name: 'Notebook' });
  });
});

describe('POST /products', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Mouse', price: 150 });
    expect(res.status).toBe(401);
  });

  it('cria produto com usuário autenticado', async () => {
    db.createProduct.mockResolvedValue({ id: 'p1', name: 'Mouse', price: 150, userId: 'user1' });

    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Mouse', price: 150 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Mouse', userId: 'user1' });
    expect(db.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Mouse', userId: 'user1' })
    );
  });
});

describe('PUT /products/:id', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).put('/products/p1').send({ name: 'Novo' });
    expect(res.status).toBe(401);
  });

  it('retorna 404 quando produto não existe', async () => {
    db.getProductById.mockResolvedValue(null);

    const res = await request(app)
      .put('/products/inexistente')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Novo' });

    expect(res.status).toBe(404);
  });

  it('retorna 403 quando usuário tenta editar produto de outro', async () => {
    db.getProductById.mockResolvedValue({ id: 'p1', name: 'Notebook', userId: 'outro-user' });

    const res = await request(app)
      .put('/products/p1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Novo' });

    expect(res.status).toBe(403);
  });

  it('permite usuário editar seu próprio produto', async () => {
    db.getProductById.mockResolvedValue({ id: 'p1', name: 'Mouse', userId: 'user1' });
    db.updateProduct.mockResolvedValue({ id: 'p1', name: 'Mouse Gamer', userId: 'user1' });

    const res = await request(app)
      .put('/products/p1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Mouse Gamer' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Mouse Gamer' });
  });

  it('admin pode editar produto de qualquer usuário', async () => {
    db.getProductById.mockResolvedValue({ id: 'p1', name: 'Mouse', userId: 'user1' });
    db.updateProduct.mockResolvedValue({ id: 'p1', name: 'Mouse Gamer', userId: 'user1' });

    const res = await request(app)
      .put('/products/p1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Mouse Gamer' });

    expect(res.status).toBe(200);
  });
});

describe('DELETE /products/:id', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).delete('/products/p1');
    expect(res.status).toBe(401);
  });

  it('retorna 404 quando produto não existe', async () => {
    db.getProductById.mockResolvedValue(null);

    const res = await request(app)
      .delete('/products/inexistente')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
  });

  it('retorna 403 quando usuário tenta excluir produto de outro', async () => {
    db.getProductById.mockResolvedValue({ id: 'p1', name: 'Notebook', userId: 'outro-user' });

    const res = await request(app)
      .delete('/products/p1')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('permite usuário excluir seu próprio produto', async () => {
    db.getProductById.mockResolvedValue({ id: 'p1', name: 'Mouse', userId: 'user1' });
    db.deleteProduct.mockResolvedValue(true);

    const res = await request(app)
      .delete('/products/p1')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  it('admin pode excluir produto de qualquer usuário', async () => {
    db.getProductById.mockResolvedValue({ id: 'p1', name: 'Mouse', userId: 'user1' });
    db.deleteProduct.mockResolvedValue(true);

    const res = await request(app)
      .delete('/products/p1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});
