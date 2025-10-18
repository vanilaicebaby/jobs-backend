const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Načtení konfigurace prostředí
dotenv.config();

// Importy routes
const jobRoutes = require('./src/routes/jobRoutes');

// Konfigurace loggeru
const logger = require('./src/utils/logger');

// Vytvoření Express aplikace
const app = express();

// Middleware
app.use(helmet()); // Bezpečnostní hlavičky
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined')); // Logging requestů
app.use(express.json()); // Parsování JSON
app.use(express.urlencoded({ extended: true }));

// Připojení k MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB připojeno úspěšně'))
.catch((err) => logger.error('Chyba připojení k MongoDB:', err));

// Definice routes
app.use('/api/jobs', jobRoutes);

// Hlavní error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'Něco se pokazilo',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Export pro serverless
module.exports.handler = serverless(app);

// Lokální server pro vývoj
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server běží na portu ${PORT}`);
  });
}