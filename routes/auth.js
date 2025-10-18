const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validatorUserCreate } = require('../validators/UserValidator');
// Importa el middleware directamente
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/auth/register', validatorUserCreate, register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

module.exports = router;
