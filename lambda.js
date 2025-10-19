const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route pro všechny joby
app.get('/api/jobs', async (req, res) => {
  try {
    const dynamoClient = new DynamoDBClient({ region: 'eu-central-1' });
    const command = new ScanCommand({
      TableName: 'Jobs',
      Limit: 50
    });

    const { Items } = await dynamoClient.send(command);
    
    const jobs = Items 
      ? Items.map(item => unmarshall(item)) 
      : [];

    res.json({
      jobs,
      totalJobs: jobs.length
    });
  } catch (error) {
    console.error('Chyba při načítání jobů', error);
    res.status(500).json({ 
      message: 'Chyba při načítání pracovních nabídek', 
      error: error.message 
    });
  }
});

// Route pro jeden job
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const dynamoClient = new DynamoDBClient({ region: 'eu-central-1' });
    const command = new GetItemCommand({
      TableName: 'Jobs',
      Key: { 
        'id': { S: req.params.id } 
      }
    });

    const { Item } = await dynamoClient.send(command);
    
    if (!Item) {
      return res.status(404).json({ message: 'Job nenalezen' });
    }

    res.json(unmarshall(Item));
  } catch (error) {
    console.error('Chyba při načítání jobu', error);
    res.status(500).json({ 
      message: 'Chyba při načítání detailu jobu', 
      error: error.message 
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API je v provozu'
  });
});

// Lambda handler
exports.handler = async (event, context) => {
  const path = event.path || event.rawPath;
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;

  // Příprava požadavku pro Express
  const req = {
    method: httpMethod,
    path: path,
    params: event.pathParameters || {},
    query: event.queryStringParameters || {}
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
    // Simulace Express routování
    if (path === '/api/jobs' && httpMethod === 'GET') {
      const dynamoClient = new DynamoDBClient({ region: 'eu-central-1' });
      const command = new ScanCommand({
        TableName: 'Jobs',
        Limit: 50
      });

      const { Items } = await dynamoClient.send(command);
      
      const jobs = Items 
        ? Items.map(item => unmarshall(item)) 
        : [];

      res.body = JSON.stringify({
        jobs,
        totalJobs: jobs.length
      });
    } else if (path.startsWith('/api/jobs/') && httpMethod === 'GET') {
      const id = path.split('/').pop();
      const dynamoClient = new DynamoDBClient({ region: 'eu-central-1' });
      const command = new GetItemCommand({
        TableName: 'Jobs',
        Key: { 
          'id': { S: id } 
        }
      });

      const { Item } = await dynamoClient.send(command);
      
      if (!Item) {
        res.statusCode = 404;
        res.body = JSON.stringify({ message: 'Job nenalezen' });
        return res;
      }

      res.body = JSON.stringify(unmarshall(Item));
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