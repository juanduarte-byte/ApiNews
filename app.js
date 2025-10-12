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

// routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const newsRoutes = require('./routes/news');
app.use('/api/news', newsRoutes);
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

// basic health
app.get('/', (req, res) => res.json({ message: 'API News - server running' }));

// global error handler (simple)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});

module.exports = app;
