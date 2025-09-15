const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Wedonetrepoo!',
    description: 'Built with AI Studio - The fastest path from prompt to production with Gemini',
    status: 'Running successfully on Azure Web Apps',
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
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Wedonetrepoo',
    version: '1.0.0',
    description: 'A Node.js application built with AI Studio',
    author: 'Built with Google AI Studio',
    node_version: process.version,
    platform: process.platform,
    memory_usage: process.memoryUsage()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: ['/', '/health', '/api/info']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Wedonetrepoo server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

module.exports = app;