// controllers/StateController.js
const { State } = require('../models/StateModel');
const { validationResult } = require('express-validator'); // Importa validationResult

// Obtener todos los estados
const get = async (req, res) => {
    try {
        const states = await State.findAll();
        res.json(states);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los estados' });
    }
};

// Obtener un estado por ID
const getById = async (req, res) => {
    try {
        const state = await State.findByPk(req.params.id);
        if (state) {
            res.json(state);
        } else {
            res.status(404).json({ message: 'Estado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el estado' });
    }
};

// Crear un nuevo estado
const create = async (req, res) => {
    // --- Manejo de errores de validación ---
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // ------------------------------------
    try {
        const newState = await State.create(req.body);
        res.status(201).json(newState);
    } catch (error) {
        console.error(error);
        // Manejo específico para errores de unicidad si es necesario
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Error: Ya existe un estado con ese nombre o abreviación.' });
        }
        res.status(500).json({ message: 'Error al crear el estado' });
    }
};

// Actualizar un estado
const update = async (req, res) => {
    // --- Manejo de errores de validación ---
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // ------------------------------------
    try {
        const [numRowsUpdated] = await State.update(req.body, {
            where: { id: req.params.id }
        });

        if (numRowsUpdated > 0) {
            res.json({ message: 'Estado actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Estado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        // Manejo específico para errores de unicidad si es necesario
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Error: Ya existe un estado con ese nombre o abreviación.' });
        }
        res.status(500).json({ message: 'Error al actualizar el estado' });
    }
};

// Eliminar un estado
const destroy = async (req, res) => {
    try {
        const numRowsDeleted = await State.destroy({
            where: { id: req.params.id }
        });

        if (numRowsDeleted > 0) {
            res.json({ message: 'Estado eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Estado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el estado' });
    }
};

module.exports = {
    get,
    getById,
    create,
    update,
    destroy
};