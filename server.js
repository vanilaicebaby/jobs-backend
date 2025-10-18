const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');

// Načtení konfigurace prostředí
dotenv.config();

// Importy routes
const jobRoutes = require('./src/routes/jobRoutes');

// Vytvoření Express aplikace
const app = express();

// CORS konfigurace
const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'https://workuj.cz', 
      'http://workuj.cz', 
      'http://localhost:3000', 
      'https://localhost:3000'
    ];

    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With'
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Připojení k MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Připojeno k MongoDB'))
.catch((error) => console.error('Chyba připojení k MongoDB:', error));

// Routes
app.use('/api/jobs', jobRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Workuj.cz Backend API',
    status: 'OK'
  });
});

// Globální error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Něco se pokazilo' 
      : err.message
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint nenalezen'
  });
});

// Serverless handler
module.exports = serverless(app);