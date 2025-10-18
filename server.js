const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

// Import your routes
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Lista povolených domén
    const whitelist = [
      'https://workuj.cz', 
      'http://workuj.cz', 
      'http://localhost:3000', 
      'https://localhost:3000'
    ];

    // Povolit požadavky bez origin (např. mobilní aplikace)
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
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Accept'
  ],
  credentials: true,
  maxAge: 86400 // 24 hodin cache preflight requestů
};

// Middleware
app.use(cors(corsOptions));

// Přidání CORS hlaviček ručně pro jistotu
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Respond to preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Parser pro JSON a URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware (volitelné)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Serverless handler
module.exports = serverless(app);