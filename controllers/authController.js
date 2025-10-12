const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const passwordField = 'contraseña';

async function register(req, res) {
    try {
        const { nombre, apellidos, nick, correo } = req.body;
        // support both 'contrasena' and 'contraseña' keys from clients
        const rawPassword = req.body.contrasena || req.body[passwordField];
        if (!rawPassword || !correo || !nombre || !apellidos || !nick) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existing = await User.findOne({ where: { correo } });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(rawPassword, 10);

        // Assumption: perfil_id 2 = Contribuidor (adjust later if you seed profiles differently)
        const perfil_id = req.body.perfil_id || 2;

        const created = await User.create({
            perfil_id,
            nombre,
            apellidos,
            nick,
            correo,
            [passwordField]: hashed,
        });

        // remove password before returning
        const result = created.toJSON();
        delete result[passwordField];

        res.status(201).json({ user: result });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function login(req, res) {
    try {
        const { correo } = req.body;
        const rawPassword = req.body.contrasena || req.body[passwordField];
        if (!correo || !rawPassword) return res.status(400).json({ message: 'Missing credentials' });

        const user = await User.findOne({ where: { correo } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(rawPassword, user[passwordField]);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = { id: user.id, perfil_id: user.perfil_id, correo: user.correo };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        const safeUser = user.toJSON();
        delete safeUser[passwordField];

        res.json({ token, user: safeUser });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function me(req, res) {
    // expects auth middleware to attach req.user
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    res.json({ user: req.user });
}

module.exports = { register, login, me };
