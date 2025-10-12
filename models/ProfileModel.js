const { DataTypes } = require('sequelize');
const { connection } = require("../config/config.db");

const Profile = connection.define('profile', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = { Profile };