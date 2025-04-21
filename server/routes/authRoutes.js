const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas protegidas para teste
router.get('/test-auth', authMiddleware, (req, res) => {
  res.json({ message: 'Você está autenticado', user: req.user });
});

router.get('/test-admin', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ 
    message: 'Você é um admin!',
    user: req.user 
  });
});

module.exports = router;