const express = require('express');
const cors = require('cors');

const handler = serverless(app, {
  binary: ['*/*'], // podpora binárních dat
  request: (request, event, context) => {
    // Manuální nastavení CORS hlaviček
    request.headers['origin'] = 'https://workuj.cz';
    request.headers['Access-Control-Allow-Origin'] = 'https://workuj.cz';
    request.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    request.headers['Access-Control-Allow-Headers'] = 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token';
  }
});

module.exports.handler = async (event, context) => {
  // Přidání CORS hlaviček před zpracováním requestu
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://workuj.cz',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      },
      body: ''
    };
  }

  return handler(event, context);
};