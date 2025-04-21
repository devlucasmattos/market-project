const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para autenticação básica
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Mais seguro que replace

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Não enviar a senha
    
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = user; // Adiciona o usuário completo à requisição
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ 
      message: 'Token inválido ou expirado',
      ...(error.name === 'TokenExpiredError' && { expired: true })
    });
  }
};

// Middleware para verificar admin
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Acesso negado - Requer privilégios de administrador' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };