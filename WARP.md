# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Wedonetrepoo is a simple Node.js web application built with Express.js. It was created using Google AI Studio and is designed for deployment on Azure Web Apps and Render. The application provides basic API endpoints with health checks and application information.

## Architecture

This is a minimal Express.js server application with the following structure:

- **Single-file architecture**: The entire application logic is contained in `server.js`
- **Express.js framework**: Uses Express for routing and middleware
- **JSON API**: All endpoints return JSON responses
- **Environment-aware**: Supports different environments via NODE_ENV
- **Health monitoring**: Built-in health check endpoint for deployment platforms
- **Error handling**: Global error handler and 404 handler

### Core Components

- **Main server**: `server.js` - Contains all routes, middleware, and server configuration
- **Package configuration**: `package.json` - Defines dependencies, scripts, and Node.js version requirements
- **Deployment configurations**: 
  - `render.yaml` - Render.com deployment configuration
  - `.github/workflows/azure-webapps-node.yml` - Azure Web Apps CI/CD pipeline

### API Endpoints

- `GET /` - Welcome message with endpoint documentation
- `GET /health` - Health check with uptime and environment info
- `GET /api/info` - Application metadata and system information
- All other routes return 404 with available endpoints

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Start the server (production mode)
npm start

# Start the server (development mode - same as start)
npm run dev

# Check Node.js version requirement
node --version  # Should be >=20.x
```

### Local Testing

```bash
# Test all endpoints locally (after starting server)
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/info
```

### Deployment

The application supports two deployment platforms:

#### Azure Web Apps
- Automatic deployment via GitHub Actions on push to `main` branch
- Requires `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub repository
- Update `AZURE_WEBAPP_NAME` in `.github/workflows/azure-webapps-node.yml`
- Deployment documentation available in `DEPLOYMENT.md`

#### Render.com
- Configuration in `render.yaml`
- Automatic deployment when connected to repository

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (default: production)

## Node.js Version

This project requires Node.js version 20.x or higher as specified in:
- `package.json` engines field
- `.nvmrc` file
- GitHub Actions workflow
- Render deployment configuration

## Development Notes

- No build step required - this is a simple Node.js application
- No test framework configured - the `npm test` command currently outputs a placeholder
- Static files are served from a `public` directory (though none exist currently)
- Uses standard Express.js patterns for middleware and routing
- Error logging goes to console (suitable for cloud platform log aggregation)

## File Structure

```
├── .github/workflows/azure-webapps-node.yml  # Azure CI/CD pipeline
├── .gitignore                                 # Git ignore patterns
├── .nvmrc                                     # Node.js version specification
├── DEPLOYMENT.md                              # Azure deployment guide
├── README.md                                  # Project description
├── package-lock.json                         # Dependency lock file  
├── package.json                              # Project configuration
├── render.yaml                               # Render.com deployment config
└── server.js                                 # Main application file
```

## Platform-Specific Considerations

### Azure Web Apps
- Uses Linux containers with Node.js 20 LTS runtime
- Health check endpoint available at `/health`
- Automatic scaling and monitoring available
- Logs accessible through Azure Portal

### Render.com
- Free tier deployment configuration
- Health check path configured as `/health`
- Automatic deployments from repository changes