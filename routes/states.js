// routes/states.js
const express = require('express');
// Importa todas las funciones del controlador
const { get, getById, create, update, destroy } = require('../controllers/StateController');
// Importa los validadores
const { validatorStateRequire, validatorStateOptional } = require('../validators/StateValidator');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Necesario para proteger
const { isAdmin } = require('../middlewares/roleMiddleware'); // Necesario para proteger

const router = express.Router();

// Rutas públicas
router.get('/states', get);
router.get('/states/:id', getById); // Asumiendo que tendrás esta función en el controlador

// Rutas protegidas (solo Admin) y con validación
router.post('/states', authenticateToken, isAdmin, validatorStateRequire, create);
router.put('/states/:id', authenticateToken, isAdmin, validatorStateOptional, update);
router.delete('/states/:id', authenticateToken, isAdmin, destroy);

module.exports = router;