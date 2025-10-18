const { Category } = require('../models/CategoryModel');
const { validationResult } = require('express-validator');

const get = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

const getById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) res.json(category);
        else res.status(404).json({ message: 'Categoría no encontrada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la categoría' });
    }
};

const create = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Error: Ya existe una categoría con ese nombre.' });
        }
        res.status(500).json({ message: 'Error al crear la categoría' });
    }
};

const update = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const [numRowsUpdated] = await Category.update(req.body, { where: { id: req.params.id } });
        if (numRowsUpdated > 0) {
            res.json({ message: 'Categoría actualizada correctamente' });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Error: Ya existe una categoría con ese nombre.' });
        }
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
};

const destroy = async (req, res) => {
    try {
        const numRowsDeleted = await Category.destroy({ where: { id: req.params.id } });
        if (numRowsDeleted > 0) {
            res.json({ message: 'Categoría eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
};

module.exports = { get, getById, create, update, destroy };