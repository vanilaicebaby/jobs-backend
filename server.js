const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Načtení konfigurace prostředí
dotenv.config();

// Importy routes
const jobRoutes = require('./src/routes/jobRoutes');

// Vytvoření Express aplikace
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Připojení k MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // Odstraněno nastavení authMechanism, protože pravděpodobně není vyžadováno pro standardní připojení
})
.then(() => console.log('Úspěšně připojeno k MongoDB'))
.catch((error) => console.error('Chyba při připojování k MongoDB:', error));

// Definice routes
app.use('/api/jobs', jobRoutes);

// Hlavní error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Něco se pokazilo',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Spuštění serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

module.exports = app;