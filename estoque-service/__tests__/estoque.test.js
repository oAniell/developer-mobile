const request = require('supertest');
const app = require('../app');
const { estoque } = require('../data/estoque');

beforeEach(() => {
  estoque.splice(0, estoque.length,
    { produto: 'Notebook', quantidade: 10 },
    { produto: 'Mouse', quantidade: 50 },
  );
});

describe('GET /estoque', () => {
  it('retorna lista completa de estoque', async () => {
    const res = await request(app).get('/estoque');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ produto: 'Notebook', quantidade: 10 });
    expect(res.body[1]).toMatchObject({ produto: 'Mouse', quantidade: 50 });
  });
});

describe('GET /estoque/:produto', () => {
  it('retorna item existente pelo nome', async () => {
    const res = await request(app).get('/estoque/Notebook');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ produto: 'Notebook', quantidade: 10 });
  });

  it('retorna 404 para produto inexistente', async () => {
    const res = await request(app).get('/estoque/Teclado');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /estoque', () => {
  it('adiciona quantidade a produto existente', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ produto: 'Notebook', quantidade: 5 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ produto: 'Notebook', quantidade: 15 });
  });

  it('cria novo produto no estoque', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ produto: 'Teclado', quantidade: 20 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ produto: 'Teclado', quantidade: 20 });
    expect(estoque).toHaveLength(3);
  });

  it('retorna 400 quando produto não informado', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ quantidade: 10 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Produto é obrigatório');
  });

  it('retorna 400 quando quantidade é zero', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ produto: 'Mouse', quantidade: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Quantidade deve ser um número positivo');
  });

  it('retorna 400 quando quantidade é negativa', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ produto: 'Mouse', quantidade: -5 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Quantidade deve ser um número positivo');
  });

  it('retorna 400 quando quantidade não é número', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ produto: 'Mouse', quantidade: 'dez' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Quantidade deve ser um número positivo');
  });

  it('ignora espaços no nome do produto', async () => {
    const res = await request(app)
      .post('/estoque')
      .send({ produto: '  Mouse  ', quantidade: 10 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ produto: 'Mouse', quantidade: 60 });
  });
});
