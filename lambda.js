const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: ['https://workuj.cz', 'http://localhost:3000'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Importy routes
const jobRoutes = require('./src/routes/jobRoutes');
const rootRoutes = require('./src/routes/rootRoutes');

app.use('/', rootRoutes);
app.use('/api/jobs', jobRoutes);

// Hlavní Lambda handler
exports.handler = async (event, context) => {
  // Simulace Express requestu pro Lambda
  const req = {
    method: event.httpMethod,
    path: event.path,
    query: event.queryStringParameters || {},
    params: event.pathParameters || {}
  };

  const res = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://workuj.cz'
    },
    body: null
  };

  try {
    // Zde by měla být logika pro routing
    if (req.path === '/api/jobs' && req.method === 'GET') {
      const Job = require('./src/models/Job');
      const result = await Job.findAll(req.query);
      res.body = JSON.stringify(result);
    } else if (req.path.startsWith('/api/jobs/') && req.method === 'GET') {
      const Job = require('./src/models/Job');
      const id = req.path.split('/').pop();
      const job = await Job.findById(id);
      res.body = JSON.stringify(job);
    } else {
      res.statusCode = 404;
      res.body = JSON.stringify({ message: 'Endpoint nenalezen' });
    }
  } catch (error) {
    console.error('Chyba v Lambda funkci:', error);
    res.statusCode = 500;
    res.body = JSON.stringify({ 
      message: 'Interní chyba serveru',
      error: error.message 
    });
  }

  return res;
};