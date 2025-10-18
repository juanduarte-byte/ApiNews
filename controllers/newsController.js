const { New } = require('../models/NewModel');
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');
const { validationResult } = require('express-validator');

const relationsUser = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
];
const relations = [
    { model: Category, attributes: ['id', 'nombre', 'descripcion'], as: 'categoria' },
    { model: State, attributes: ['id', 'nombre', 'abreviacion'], as: 'estado' },
    { model: User, attributes: ['id', 'nick', 'nombre'], as: 'usuario', include: relationsUser }
];

const get = async (req, res) => {
    try {
        const news = await New.findAll({ include: relations });
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener noticias' });
    }
};

const getById = async (req, res) => {
    try {
        const newsItem = await New.findByPk(req.params.id, { include: relations });
        if (newsItem) {
            res.json(newsItem);
        } else {
            res.status(404).json({ message: 'Noticia no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la noticia' });
    }
};

const create = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const newNews = await New.create({
            ...req.body,
            usuario_id: req.user.id, // Assign logged-in user's ID
            estado_id: 1, // Default to "Pendiente" state
        });
        res.status(201).json(newNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la noticia' });
    }
};

const update = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const newsItem = await New.findByPk(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        // Only owner or admin can update
        if (newsItem.usuario_id !== req.user.id && req.user.perfil_id !== 1) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar esta noticia' });
        }
        await newsItem.update(req.body);
        res.json(newsItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la noticia' });
    }
};

const changeState = async (req, res) => {
    // No validation needed here as only state_id is expected
    try {
        const { estado_id } = req.body;
         // Basic validation for estado_id
        if (typeof estado_id !== 'number') {
             return res.status(400).json({ message: 'El campo estado_id debe ser un número.' });
        }
        const newsItem = await New.findByPk(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        await newsItem.update({ estado_id });
        res.json({ message: 'Estado de la noticia actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar el estado de la noticia' });
    }
};

const destroy = async (req, res) => {
    try {
        const numRowsDeleted = await New.destroy({ where: { id: req.params.id } });
        if (numRowsDeleted > 0) {
            res.json({ message: 'Noticia eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Noticia no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
};

module.exports = { get, getById, create, update, changeState, destroy };
