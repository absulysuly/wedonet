const express = require('express');
const serverless = require('serverless-http');

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Wedonetrepoo!',
    description: 'Built with AI Studio - The fastest path from prompt to production with Gemini',
    status: 'Running successfully on Netlify Functions',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /': 'This welcome message',
      'GET /health': 'Health check endpoint',
      'GET /api/info': 'Application information'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'netlify-functions',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/info', (req, res) => {
  res.json({
    name: 'Wedonetrepoo',
    version: '1.0.0',
    description: 'A Node.js application built with AI Studio',
    author: 'Built with Google AI Studio',
    platform: 'netlify-functions',
    node_version: process.version
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: ['/', '/health', '/info']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Function error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// Export serverless handler
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // Add any custom logic here if needed
  return await handler(event, context);
};