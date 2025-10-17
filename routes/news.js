const express = require('express');
const { get, getById, create, update, changeState, destroy } = require('../controllers/newsController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin, isContributorOrAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Rutas públicas
router.get('/news', get);
router.get('/news/:id', getById);

// Rutas protegidas
router.post('/news', authenticateToken, create);
router.put('/news/:id', authenticateToken, isContributorOrAdmin, update);
router.patch('/news/:id/state', authenticateToken, isAdmin, changeState); // Ruta para cambiar estado
router.delete('/news/:id', authenticateToken, isAdmin, destroy);

module.exports = router;
