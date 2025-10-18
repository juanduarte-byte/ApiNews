// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Exporta un objeto con todas las variables de configuración
module.exports = {
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'db_news01', // base de datos en MySQL 
    JWT_SECRET: process.env.JWT_SECRET || 'secretkey' // Clave para los tokens
};