const express = require('express');
const { get, getById, create, update, destroy } = require('../controllers/CategoryController');
const { validatorCategoryCreate, validatorCategoryUpdate } = require('../validators/CategoryValidator');
// Importa los middlewares directamente
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/categories', get);
router.get('/categories/:id', getById);
router.post('/categories', authenticateToken, isAdmin, validatorCategoryCreate, create);
router.put('/categories/:id', authenticateToken, isAdmin, validatorCategoryUpdate, update);
router.delete('/categories/:id', authenticateToken, isAdmin, destroy);

module.exports = router;