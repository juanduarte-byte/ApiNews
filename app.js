const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
// Importa la configuración centralizada
const { PORT } = require('./config.js');
const swaggerDocument = require('./swagger-output.json');


const app = express();


// --- MIDDLEWARES ---
// Habilita CORS para todas las rutas
app.use(cors());
// Aumenta el límite de payload para aceptar imágenes en Base64
app.use(express.json({ limit: '5mb' }));
// --- ROUTES ---
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const usersRoutes = require('./routes/users');
const profilesRoutes = require('./routes/profiles');
const statesRoutes = require('./routes/states');
const categoriesRoutes = require('./routes/categories');
// Montaje de rutas
app.use('/api', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', usersRoutes);
app.use('/api', profilesRoutes);
app.use('/api', statesRoutes);
app.use('/api', categoriesRoutes);
// --- DOCUMENTACIÓN Y RUTAS BASE ---
// Ruta de salud de la API
app.get('/', (req, res) => res.json({ message: 'API News - server running' }));
// Ruta de la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// --- MANEJO DE ERRORES ---
// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});
// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
module.exports = app;