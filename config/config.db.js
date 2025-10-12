const Sequelize = require('sequelize');

// Asegúrate de cambiar 'db_news01' por el nombre de tu base de datos, 'root' por tu usuario y '' por tu contraseña si la tienes.
const connection = new Sequelize('db_news01', 'root', '', {
    host: 'localhost',
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