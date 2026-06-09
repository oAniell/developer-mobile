const jwt = require('jsonwebtoken');
const { autenticar, autorizar } = require('../middleware/protect');

process.env.JWT_SECRET = 'segredo-de-teste';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('autenticar', () => {
  it('retorna 401 sem header Authorization', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token não informado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 401 com token inválido', () => {
    const req = { headers: { authorization: 'Bearer token-invalido' } };
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next e popula req.usuario com token válido', () => {
    const payload = { id: 'u1', nome: 'João', perfil: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.usuario).toMatchObject(payload);
  });

  it('retorna 401 com token expirado', () => {
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('autorizar', () => {
  it('retorna 401 se req.usuario não estiver definido', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    autorizar('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 403 quando perfil não tem permissão', () => {
    const req = { usuario: { perfil: 'usuario' } };
    const res = mockRes();
    const next = jest.fn();

    autorizar('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Acesso negado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next quando perfil tem permissão', () => {
    const req = { usuario: { perfil: 'admin' } };
    const res = mockRes();
    const next = jest.fn();

    autorizar('admin')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('aceita múltiplos perfis permitidos', () => {
    const req = { usuario: { perfil: 'gerente' } };
    const res = mockRes();
    const next = jest.fn();

    autorizar('admin', 'gerente')(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
