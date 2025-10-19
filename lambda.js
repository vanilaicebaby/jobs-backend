const serverless = require('serverless-http');
const app = require('./server');

exports.handler = async (event, context) => {
  const handler = serverless(app);
  
  // Přidání CORS hlaviček
  const response = await handler(event, context);
  response.headers = {
    ...response.headers,
    'Access-Control-Allow-Origin': 'https://workuj.cz',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
  
  return response;
};