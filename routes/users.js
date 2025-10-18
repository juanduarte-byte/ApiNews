const express = require('express');
const { get, getById, update, destroy } = require('../controllers/userController');
const { validatorUserUpdate } = require('../validators/UserValidator');
// Importa los middlewares directamente
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/users', authenticateToken, isAdmin, get);
router.get('/users/:id', authenticateToken, isAdmin, getById);
router.put('/users/:id', authenticateToken, isAdmin, validatorUserUpdate, update);
router.delete('/users/:id', authenticateToken, isAdmin, destroy);

module.exports = router;
