const jwt = require('jsonwebtoken');

const User = require('../models/User');

/**
 * Middleware para proteger rotas que exigem autenticação
 * Verifica se o token JWT é válido e anexa o usuário ao request
 */
const protect = async (req, res, next) => {
  let token;

  // Verifica se o header Authorization existe e começa com 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token removendo o prefixo 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // Verifica e decodifica o token usando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário no banco usando o ID do token
      // O .select('-password') exclui a senha do resultado
      req.user = await User.findById(decoded.id).select('-password');

      // Verifica se o usuário foi encontrado no banco
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Passa para o próximo middleware ou rota
      next();
    } catch (error) {
      // Captura erros de token inválido, expirado ou outros erros
      console.error('Erro na autenticação:', error.message);
      return res.status(401).json({
        message: 'Não autorizado, token inválido',
        error: error.message,
      });
    }
  } else {
    // Retorna erro se não houver token no header
    return res.status(401).json({
      message: 'Não autorizado, token não fornecido',
    });
  }
};

/**
 * Middleware para restringir acesso apenas a administradores
 * Deve ser usado após o middleware protect
 */
const adminOnly = (req, res, next) => {
  // Verifica se o usuário existe e se tem role de admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Retorna erro 403 (Forbidden) se não for admin
    res.status(403).json({
      message: 'Acesso negado. Apenas administradores',
    });
  }
};

module.exports = { protect, adminOnly };
