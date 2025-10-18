const { check } = require('express-validator');
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');

const validatorNewCreate = [
    check('categoria_id').notEmpty().isInt().custom(async (value) => {
        const category = await Category.findOne({ where: { id: value, activo: true } });
        if (!category) throw new Error('No existe una categoria activa con ese id');
    }),
    check('estado_id').notEmpty().isInt().custom(async (value) => {
        const state = await State.findOne({ where: { id: value, activo: true } });
        if (!state) throw new Error('No existe un estado activo con ese id');
    }),
    check('titulo').notEmpty().isLength({ min: 2 }),
    check('descripcion').notEmpty().isLength({ min: 2 }),
    check('imagen').notEmpty().isBase64(),
    check('activo').optional().isBoolean(),
];
const validatorNewUpdate = [
    check('categoria_id').optional().isInt(),
    check('estado_id').optional().isInt(),
    check('titulo').optional().isLength({ min: 2 }),
    check('descripcion').optional().isLength({ min: 2 }),
    check('imagen').optional().isBase64(),
    check('activo').optional().isBoolean(),
];
module.exports = { validatorNewCreate, validatorNewUpdate };