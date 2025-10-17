// routes/profiles.js
const express = require('express');
const { get } = require('../controllers/ProfileController');

const router = express.Router();

// Ruta pública para obtener todos los perfiles
router.get('/profiles', get);

module.exports = router;