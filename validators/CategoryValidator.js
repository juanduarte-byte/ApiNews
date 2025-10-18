const { check } = require('express-validator');
const { Category } = require('../models/CategoryModel');

const validatorCategoryCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio').isString().isLength({ min: 5, max: 50 }).custom(async (value) => {
        const category = await Category.findOne({ where: { nombre: value } });
        if (category) throw new Error('Ya existe una categoría con el mismo nombre');
    }),
    check('descripcion').notEmpty().withMessage('El campo descripcion es obligatorio').isString().isLength({ min: 5, max: 255 }),
    check('activo').optional().isBoolean(),
];
const validatorCategoryUpdate = [
    check('nombre').optional().isString().isLength({ min: 5, max: 50 }).custom(async (value) => {
        // Podrías añadir lógica para permitir actualizar al mismo nombre
    }),
    check('descripcion').optional().isString().isLength({ min: 5, max: 255 }),
    check('activo').optional().isBoolean(),
];
module.exports = { validatorCategoryCreate, validatorCategoryUpdate };