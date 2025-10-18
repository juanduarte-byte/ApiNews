const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');
const { validationResult } = require('express-validator');

const relations = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
];

const get = async (req, res) => {
    try {
        const users = await User.findAll({
            include: relations,
            attributes: { exclude: ['contraseña'] }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

const getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: relations,
            attributes: { exclude: ['contraseña'] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

const update = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        // Prevent password update from this endpoint
        delete req.body.contraseña;
        delete req.body.contrasena; // Also delete the version without ñ

        const [numRowsUpdated] = await User.update(req.body, {
            where: { id: req.params.id }
        });

        if (numRowsUpdated > 0) {
            res.json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
         if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Error: El correo o nick ya está en uso.' });
        }
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

const destroy = async (req, res) => {
    // Soft delete
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ activo: false });
            res.json({ message: 'Usuario desactivado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al desactivar el usuario' });
    }
};

module.exports = { get, getById, update, destroy };
