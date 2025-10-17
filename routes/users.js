const express = require('express');
const { get, getById, update, destroy } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Todas las rutas de usuarios requieren ser administrador
router.get('/users', authenticateToken, isAdmin, get);
router.get('/users/:id', authenticateToken, isAdmin, getById);
router.put('/users/:id', authenticateToken, isAdmin, update);
router.delete('/users/:id', authenticateToken, isAdmin, destroy);

module.exports = router;
