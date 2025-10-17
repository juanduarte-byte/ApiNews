// controllers/StateController.js
const { State } = require('../models/StateModel');

const get = async (req, res) => {
    try {
        const states = await State.findAll();
        res.json(states);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los estados' });
    }
};

module.exports = { get };