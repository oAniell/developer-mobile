jest.mock('../firebase', () => {
  const mockGet = jest.fn();
  const mockAdd = jest.fn();
  const mockWhere = jest.fn();

  mockWhere.mockReturnValue({ get: mockGet });

  const mockCollection = jest.fn().mockReturnValue({
    where: mockWhere,
    add: mockAdd,
  });

  return { db: { collection: mockCollection } };
});

process.env.JWT_SECRET = 'segredo-de-teste';

const request = require('supertest');
const app = require('../app');
const { db } = require('../firebase');

const mockCollection = db.collection;

function getMockChain() {
  return mockCollection.mock.results[mockCollection.mock.results.length - 1].value;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /auth/register', () => {
  it('retorna 400 quando nome está ausente', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@b.com', senha: '12345678', perfil: 'usuario' });
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toMatch(/nome/);
  });

  it('retorna 400 quando email é inválido', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'João', email: 'email-invalido', senha: '12345678', perfil: 'usuario' });
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toMatch(/email/);
  });

  it('retorna 400 quando senha tem menos de 8 caracteres', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'João', email: 'a@b.com', senha: '123', perfil: 'usuario' });
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toMatch(/senha/);
  });

  it('retorna 400 quando perfil é inválido', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'João', email: 'a@b.com', senha: '12345678', perfil: 'superusuario' });
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toMatch(/Perfil/);
  });

  it('retorna 409 quando email já está cadastrado', async () => {
    mockCollection.mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ empty: false }),
      }),
      add: jest.fn(),
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'João', email: 'existente@b.com', senha: '12345678', perfil: 'usuario' });

    expect(res.status).toBe(409);
    expect(res.body.mensagem).toMatch(/cadastrado/);
  });

  it('cadastra usuário com dados válidos e retorna 201', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'novo-id-123' });
    // Primeira chamada: verificar se email existe
    mockCollection.mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ empty: true }),
      }),
      add: jest.fn(),
    });
    // Segunda chamada: inserir novo usuário
    mockCollection.mockReturnValueOnce({
      where: jest.fn(),
      add: mockAdd,
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'João', email: 'novo@b.com', senha: '12345678', perfil: 'usuario' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'novo-id-123');
  });
});

describe('POST /auth/login', () => {
  it('retorna 401 quando usuário não existe', async () => {
    mockCollection.mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ empty: true }),
      }),
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nao@existe.com', senha: '12345678' });

    expect(res.status).toBe(401);
    expect(res.body.mensagem).toMatch(/inválidos/);
  });

  it('retorna 401 quando senha está errada', async () => {
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash('senha-correta', 10);

    mockCollection.mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          empty: false,
          docs: [{
            id: 'u1',
            data: () => ({ nome: 'João', email: 'a@b.com', senha: senhaHash, perfil: 'usuario' }),
          }],
        }),
      }),
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'a@b.com', senha: 'senha-errada' });

    expect(res.status).toBe(401);
    expect(res.body.mensagem).toMatch(/inválidos/);
  });

  it('retorna token JWT com credenciais corretas', async () => {
    const bcrypt = require('bcrypt');
    const senhaHash = await bcrypt.hash('senha-correta', 10);

    mockCollection.mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          empty: false,
          docs: [{
            id: 'u1',
            data: () => ({ nome: 'João', email: 'a@b.com', senha: senhaHash, perfil: 'admin' }),
          }],
        }),
      }),
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'a@b.com', senha: 'senha-correta' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload).toMatchObject({ id: 'u1', nome: 'João', perfil: 'admin' });
  });
});
