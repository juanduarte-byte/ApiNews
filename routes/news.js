const express = require('express');
const { get, getById, create, update, changeState, destroy } = require('../controllers/newsController');
const { validatorNewCreate, validatorNewUpdate } = require('../validators/NewValidator');
// Importa los middlewares directamente
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin, isContributorOrAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/news', get);
router.get('/news/:id', getById);
router.post('/news', authenticateToken, validatorNewCreate, create);
router.put('/news/:id', authenticateToken, isContributorOrAdmin, validatorNewUpdate, update);
router.patch('/news/:id/state', authenticateToken, isAdmin, changeState);
router.delete('/news/:id', authenticateToken, isAdmin, destroy);

module.exports = router;
