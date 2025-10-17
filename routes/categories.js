// routes/categories.js
const express = require('express');
const { get } = require('../controllers/CategoryController');

const router = express.Router();

// Ruta pública para obtener todas las categorías
router.get('/categories', get);

module.exports = router;