const { New } = require('../models/NewModel');
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

// Define las relaciones que se incluirán en las consultas de Usuario
const relationsUser = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
];

// Define las relaciones (incluida la anidada) para las consultas de Noticia
const relations = [
    { model: Category, attributes: ['id', 'nombre', 'descripcion'], as: 'categoria' },
    { model: State, attributes: ['id', 'nombre', 'abreviacion'], as: 'estado' },
    { model: User, attributes: ['id', 'nick', 'nombre'], as: 'usuario', include: relationsUser }
];

// Obtener todas las noticias (con filtros y relaciones)
const get = async (req, res) => {
    try {
        const news = await New.findAll({ include: relations });
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener noticias' });
    }
};

// Obtener una noticia por su ID (con relaciones)
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

// Crear una nueva noticia
const create = async (req, res) => {
    try {
        const newNews = await New.create({
            ...req.body,
            usuario_id: req.user.id, // Asigna el ID del usuario autenticado
            estado_id: 1, // Por defecto, estado "Pendiente"
        });
        res.status(201).json(newNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la noticia' });
    }
};

// Actualizar una noticia
const update = async (req, res) => {
    try {
        const newsItem = await New.findByPk(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        // Solo el dueño o un admin pueden actualizar
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

// Cambiar el estado de una noticia (solo Admin)
const changeState = async (req, res) => {
    try {
        const { estado_id } = req.body;
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

// Eliminar una noticia
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
