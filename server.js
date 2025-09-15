const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple logging utility
const log = {
  info: (message, meta = {}) => console.log(`[INFO] ${new Date().toISOString()} ${message}`, meta),
  error: (message, error = {}) => console.error(`[ERROR] ${new Date().toISOString()} ${message}`, error),
  warn: (message, meta = {}) => console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta)
};

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log.info(`${req.method} ${req.url}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')
    });
  });
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
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
      'GET /api/info': 'Application information',
      'GET /metrics': 'System metrics and performance data'
    }
  });
});

app.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    pid: process.pid,
    version: process.version
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

// Metrics endpoint
app.get('/metrics', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  res.json({
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      human: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
      arrayBuffers: memoryUsage.arrayBuffers
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  log.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.url,
    method: req.method,
    available_endpoints: ['/', '/health', '/api/info', '/metrics']
  });
});

// Error handler
app.use((error, req, res, next) => {
  log.error('Server error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!',
    ...(isDevelopment && { details: error.message, stack: error.stack })
  });
});

// Start server
app.listen(PORT, () => {
  log.info('🚀 Wedonetrepoo server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'production',
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
    startTime: new Date().toISOString()
  });
  
  log.info('📋 Available endpoints:', {
    endpoints: [
      `GET http://localhost:${PORT}/`,
      `GET http://localhost:${PORT}/health`,
      `GET http://localhost:${PORT}/api/info`,
      `GET http://localhost:${PORT}/metrics`
    ]
  });
});

module.exports = app;