// routes/states.js
const express = require('express');
const { get } = require('../controllers/StateController');

const router = express.Router();

// Ruta pública para obtener todos los estados
router.get('/states', get);

module.exports = router;