// controllers/ProfileController.js
const { Profile } = require('../models/ProfileModel');

const get = async (req, res) => {
    try {
        const profiles = await Profile.findAll();
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los perfiles' });
    }
};

module.exports = { get };