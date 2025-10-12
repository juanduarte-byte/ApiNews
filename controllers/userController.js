const { User } = require('../models/UserModel');

const passwordField = 'contraseña';

async function index(req, res) {
    try {
        const users = await User.findAll({ attributes: { exclude: [passwordField] } });
        res.json({ users });
    } catch (err) {
        console.error('Users index error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: { exclude: [passwordField] } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        console.error('Users show error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Only admin can modify (as requested)
        // Apply allowed updates
        const allowed = ['perfil_id','nombre','apellidos','nick','correo','activo'];
        allowed.forEach(field => {
            if (field in req.body) user[field] = req.body[field];
        });
        await user.save();
        const safe = user.toJSON();
        delete safe[passwordField];
        res.json({ user: safe });
    } catch (err) {
        console.error('Users update error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function destroy(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.activo = false;
        await user.save();
        res.json({ message: 'User deactivated' });
    } catch (err) {
        console.error('Users destroy error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { index, show, update, destroy };
