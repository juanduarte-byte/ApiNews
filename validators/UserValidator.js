// validators/UserValidator.js

const { check } = require('express-validator');
// Corregido: Importa cada modelo desde su propio archivo
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

const validatorUserCreate = [
    // ... (el resto del código sigue igual)
    check('nombre').notEmpty().isString().isLength({ min: 2, max: 100 }),
    check('apellidos').notEmpty().isString().isLength({ min: 2, max: 100 }),
    check('nick').notEmpty().isString().isLength({ min: 2, max: 20 }),
    check('correo').notEmpty().isEmail().custom(async (value) => {
        const user = await User.findOne({ where: { correo: value } });
        if (user) throw new Error('Ya existe un usuario con el mismo correo');
    }),
    check('contrasena').notEmpty().isString().isLength({ min: 8 }),
    check('perfil_id').notEmpty().isInt().custom(async (value) => {
        const profile = await Profile.findOne({ where: { id: value } });
        if (!profile) throw new Error('No existe un perfil con ese id');
    }),
];

const validatorUserUpdate = [
    check('nombre').optional().isString().isLength({ min: 2, max: 100 }),
    check('apellidos').optional().isString().isLength({ min: 2, max: 100 }),
    check('nick').optional().isString().isLength({ min: 2, max: 20 }),
    check('contrasena').optional().isString().isLength({ min: 8 }),
    check('perfil_id').optional().isInt(),
];

module.exports = { validatorUserCreate, validatorUserUpdate };