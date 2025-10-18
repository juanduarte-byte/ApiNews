const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel'); // Although not used directly here, it's good practice if User model includes it
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { nombre, apellidos, nick, correo, contrasena, perfil_id = 2 } = req.body; // Default to Contribuidor
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const newUser = await User.create({
            nombre,
            apellidos,
            nick,
            correo,
            contraseña: hashedPassword, // Save to 'contraseña' field
            perfil_id // Use provided or default
        });

        const userJson = newUser.toJSON();
        delete userJson.contraseña;
        res.status(201).json(userJson);

    } catch (error) {
        console.error(error);
         if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Error: El correo o nick ya está en uso.' });
        }
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const user = await User.findOne({ where: { correo } });

        if (!user || !user.activo) { // Also check if user is active
            return res.status(401).json({ message: 'Credenciales incorrectas o usuario inactivo' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const payload = {
            id: user.id,
            perfil_id: user.perfil_id,
            correo: user.correo
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretkey', // Use environment variable
            { expiresIn: '8h' } // Token expiration
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

const getMe = async (req, res) => {
    try {
        // req.user comes from authenticateToken middleware
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Profile, as: 'perfil', attributes: ['nombre'] }], // Include profile name
            attributes: { exclude: ['contraseña'] } // Exclude password
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
