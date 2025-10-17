// routes/auth.js
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Estandarizamos las rutas para incluir el recurso "auth"
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

module.exports = router;
