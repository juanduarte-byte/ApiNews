const Sequelize = require('sequelize');
// Importa las variables desde el archivo de configuración central
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = require('../config.js');

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});

connection.authenticate()
    .then(() => {
        console.log('Se ha establecido conexión con la base de datos de forma exitosa.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = { connection };