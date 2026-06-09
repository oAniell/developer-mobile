jest.mock('../rabbitmq', () => ({
  publicarPedido: jest.fn().mockResolvedValue(undefined),
}));

const request = require('supertest');
const app = require('../app');
const { pedidos } = require('../data/pedidos');
const { publicarPedido } = require('../rabbitmq');

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  pedidos.splice(0, pedidos.length);
  jest.clearAllMocks();
});

describe('GET /pedidos', () => {
  it('retorna lista vazia inicialmente', async () => {
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('retorna pedidos existentes', async () => {
    pedidos.push({ id: '1', produto: 'Notebook', quantidade: 2 });
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ produto: 'Notebook', quantidade: 2 });
  });
});

describe('POST /pedidos', () => {
  it('cria pedido com estoque disponível', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ produto: 'Notebook', quantidade: 10 }),
    });

    const res = await request(app)
      .post('/pedidos')
      .send({ id: 'p1', produto: 'Notebook', quantidade: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ produto: 'Notebook', quantidade: 2 });
    expect(publicarPedido).toHaveBeenCalledWith({ id: 'p1', produto: 'Notebook', quantidade: 2 });
    expect(pedidos).toHaveLength(1);
  });

  it('retorna 422 quando produto não existe no estoque', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Produto não encontrado no estoque' }),
    });

    const res = await request(app)
      .post('/pedidos')
      .send({ id: 'p2', produto: 'Teclado', quantidade: 1 });

    expect(res.status).toBe(422);
    expect(res.body.error).toMatch(/Teclado/);
    expect(publicarPedido).not.toHaveBeenCalled();
  });

  it('retorna 422 quando estoque insuficiente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ produto: 'Mouse', quantidade: 3 }),
    });

    const res = await request(app)
      .post('/pedidos')
      .send({ id: 'p3', produto: 'Mouse', quantidade: 10 });

    expect(res.status).toBe(422);
    expect(res.body.error).toMatch(/insuficiente/);
    expect(publicarPedido).not.toHaveBeenCalled();
  });

  it('prossegue se serviço de estoque estiver indisponível', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const res = await request(app)
      .post('/pedidos')
      .send({ id: 'p4', produto: 'Notebook', quantidade: 1 });

    expect(res.status).toBe(201);
    expect(publicarPedido).toHaveBeenCalled();
  });

  it('retorna 500 quando RabbitMQ falha', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ produto: 'Notebook', quantidade: 10 }),
    });
    publicarPedido.mockRejectedValueOnce(new Error('RabbitMQ fora do ar'));

    const res = await request(app)
      .post('/pedidos')
      .send({ id: 'p5', produto: 'Notebook', quantidade: 1 });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/RabbitMQ/);
  });
});
