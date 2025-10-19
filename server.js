const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Odstraňte mongoose připojení
dotenv.config();

// Importy routes
const jobRoutes = require('./src/routes/jobRoutes');
const rootRoutes = require('./src/routes/rootRoutes');

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

// Routes
app.use('/', rootRoutes);
app.use('/api/jobs', jobRoutes);

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

module.exports = app;