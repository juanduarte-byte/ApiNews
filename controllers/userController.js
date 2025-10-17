const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

const relations = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
];

// Obtener todos los usuarios
const get = async (req, res) => {
    try {
        const users = await User.findAll({ 
            include: relations,
            attributes: { exclude: ['contraseña'] } // Excluir siempre la contraseña
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario por su ID
const getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { 
            include: relations,
            attributes: { exclude: ['contraseña'] } // Excluir siempre la contraseña
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

// Actualizar un usuario (solo Admin)
const update = async (req, res) => {
    try {
        // No permitir que se actualice la contraseña desde este endpoint
        delete req.body.contraseña;
        
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
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario (soft delete)
const destroy = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ activo: false }); // Cambia el estado a inactivo
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
