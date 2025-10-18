const express = require('express');
const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Workuj.cz Backend je spuštěn',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  });
});

// Verze API
router.get('/version', (req, res) => {
  res.status(200).json({
    version: '1.0.0',
    name: 'Workuj.cz Backend',
    description: 'Backend pro pracovní portál Workuj.cz'
  });
});

module.exports = router;