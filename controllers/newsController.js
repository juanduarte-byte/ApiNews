const { New } = require('../models/NewModel');
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');

async function index(req, res) {
    try {
        const news = await New.findAll({
            where: { activo: true },
            include: [
                { model: Category, as: 'categoria' },
                { model: State, as: 'estado' },
                { model: User, as: 'usuario', attributes: ['id', 'nombre', 'apellidos', 'nick', 'correo'] },
            ],
        });
        res.json({ news });
    } catch (err) {
        console.error('News index error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const { id } = req.params;
        const noticia = await New.findByPk(id, {
            include: [
                { model: Category, as: 'categoria' },
                { model: State, as: 'estado' },
                { model: User, as: 'usuario', attributes: ['id', 'nombre', 'apellidos', 'nick', 'correo'] },
            ],
        });
        if (!noticia) return res.status(404).json({ message: 'Not found' });
        res.json({ noticia });
    } catch (err) {
        console.error('News show error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function create(req, res) {
    try {
        const { categoria_id, estado_id, titulo, fecha_publicacion, descripcion, imagen } = req.body;
        if (!categoria_id || !estado_id || !titulo || !fecha_publicacion || !descripcion) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const usuario_id = req.user.id;
        const created = await New.create({ categoria_id, estado_id, usuario_id, titulo, fecha_publicacion, descripcion, imagen });
        res.status(201).json({ noticia: created });
    } catch (err) {
        console.error('News create error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const noticia = await New.findByPk(id);
        if (!noticia) return res.status(404).json({ message: 'Not found' });

        // only owner or admin
        const isOwner = Number(req.user.id) === Number(noticia.usuario_id);
        const isAdmin = Number(req.user.perfil_id) === 1;
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

        const allowed = ['categoria_id','estado_id','titulo','fecha_publicacion','descripcion','imagen','activo'];
        allowed.forEach(field => {
            if (field in req.body) noticia[field] = req.body[field];
        });
        await noticia.save();
        res.json({ noticia });
    } catch (err) {
        console.error('News update error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function changeState(req, res) {
    try {
        const { id } = req.params;
        const { estado_id } = req.body;
        if (!estado_id) return res.status(400).json({ message: 'Missing estado_id' });
        const noticia = await New.findByPk(id);
        if (!noticia) return res.status(404).json({ message: 'Not found' });
        noticia.estado_id = estado_id;
        await noticia.save();
        res.json({ noticia });
    } catch (err) {
        console.error('News changeState error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function destroy(req, res) {
    try {
        const { id } = req.params;
        const noticia = await New.findByPk(id);
        if (!noticia) return res.status(404).json({ message: 'Not found' });
        // soft delete: set activo = false
        noticia.activo = false;
        await noticia.save();
        res.json({ message: 'Deleted (soft)', noticia });
    } catch (err) {
        console.error('News destroy error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { index, show, create, update, changeState, destroy };
