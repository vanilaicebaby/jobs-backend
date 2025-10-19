const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const app = express();
const PORT = process.env.PORT || 5000;

// DynamoDB klient
const dynamoClient = new DynamoDBClient({ region: 'eu-central-1' });

// Middleware
app.use(cors());
app.use(express.json());

// Route pro všechny joby
app.get('/api/jobs', async (req, res) => {
  try {
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

// Zdravotní test
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API je v provozu'
  });
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});