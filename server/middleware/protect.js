const jwt = require('jsonwebtoken');

/**
 * Middleware que valida o token JWT no header Authorization.
 * Uso: adicionar nas rotas que precisam de autenticação.
 * Ex: router.get('/', autenticar, (req, res) => { ... })
 */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1]; // formato: "Bearer <token>"

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
}

/**
 * Middleware que verifica se o usuário tem o perfil necessário.
 * Uso: autorizar('gerente') ou autorizar('gerente', 'admin')
 */
function autorizar(...perfis) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensagem: 'Não autenticado' });
    }
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
