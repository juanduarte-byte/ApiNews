const { DataTypes } = require('sequelize');
const { connection } = require("../config/config.db");
const { Profile } = require('./ProfileModel');

const User = connection.define('user', {
    perfil_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nick: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    UserAlta: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Admin"
    },
    FechaAlta: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    UserMod: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    FechaMod: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:'1990-01-01T00:00:00.000Z'
    },
    UserBaja: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    FechaBaja: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:'1990-01-01T00:00:00.000Z'
    },
});

User.belongsTo(Profile, { as: 'perfil', foreignKey: 'perfil_id' });

module.exports = { User };