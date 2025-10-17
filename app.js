const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());

// --- ROUTES ---
// Asegúrate de que esta línea esté presente y correcta
const authRoutes = require('./routes/auth'); 
const newsRoutes = require('./routes/news');
const usersRoutes = require('./routes/users');
const profilesRoutes = require('./routes/profiles');
const statesRoutes = require('./routes/states');
const categoriesRoutes = require('./routes/categories');

// Montaje de rutas
// Y asegúrate de que esta línea esté aquí
app.use('/api', authRoutes); 
app.use('/api', newsRoutes);
app.use('/api', usersRoutes);
app.use('/api', profilesRoutes);
app.use('/api', statesRoutes);
app.use('/api', categoriesRoutes);
// --------------

// basic health check
app.get('/', (req, res) => res.json({ message: 'API News - server running' }));

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// global error handler (simple)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});

module.exports = app;
