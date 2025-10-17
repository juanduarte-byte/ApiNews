// controllers/CategoryController.js
const { Category } = require('../models/CategoryModel');

const get = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

module.exports = { get };