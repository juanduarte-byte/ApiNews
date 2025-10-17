// controllers/authController.js
const { User } = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { nombre, apellidos, nick, correo, contrasena } = req.body;
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const newUser = await User.create({
            nombre,
            apellidos,
            nick,
            correo,
            contraseña: hashedPassword,
            perfil_id: 2 // Por defecto, el perfil de "Contribuidor"
        });

        // No devolver la contraseña en la respuesta
        const userJson = newUser.toJSON();
        delete userJson.contraseña;

        res.status(201).json(userJson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const user = await User.findOne({ where: { correo } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const payload = {
            id: user.id,
            perfil_id: user.perfil_id,
            correo: user.correo
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

const getMe = async (req, res) => {
    try {
        // req.user es añadido por el middleware authenticateToken
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['contraseña'] } // Nunca devolver la contraseña
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
};

module.exports = { register, login, getMe };
