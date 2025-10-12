const jwt = require('jsonwebtoken');
const { User } = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader) return res.status(401).json({ message: 'No token provided' });

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid token format' });

        const token = parts[1];
        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Attach minimal user info to req. Try to load user to get current perfil_id and correo
        const user = await User.findByPk(payload.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        // sanitize
        const safeUser = {
            id: user.id,
            perfil_id: user.perfil_id,
            nombre: user.nombre,
            correo: user.correo,
        };

        req.user = safeUser;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { authenticateToken };
