# 🚀 Comprehensive Deployment Guide

This guide covers deployment of the Wedonetrepoo application across multiple platforms including Azure, Heroku, Vercel, Netlify, Railway, and Docker.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Azure Web Apps](#azure-web-apps)
- [Heroku](#heroku)
- [Vercel](#vercel)
- [Netlify Functions](#netlify-functions)
- [Railway](#railway)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Testing Deployments](#testing-deployments)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **Node.js 20+** installed locally
2. **Git** repository with your code
3. **GitHub account** (for GitHub Actions)
4. **Platform accounts** (Azure, Heroku, Vercel, etc.)

## 🔵 Azure Web Apps

### Setup Steps

1. **Create Azure Web App**
   ```bash
   # Using Azure CLI
   az webapp create \
     --resource-group your-resource-group \
     --plan your-app-service-plan \
     --name wedonetrepoo-app \
     --runtime "NODE:20-lts"
   ```

2. **Configure GitHub Actions**
   - Get publish profile: Azure Portal → Your Web App → Overview → Get publish profile
   - Add secret `AZURE_WEBAPP_PUBLISH_PROFILE` in GitHub repository settings
   - Update `AZURE_WEBAPP_NAME` in `.github/workflows/azure-webapps-node.yml`

3. **Environment Variables**
   - Set in Azure Portal → Configuration → Application settings
   - Required: `NODE_ENV=production`

### Manual Deployment
```bash
# Deploy via Azure CLI
az webapp deploy --resource-group your-rg --name your-app --src-path .
```

## 🟣 Heroku

### Setup Steps

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create wedonetrepoo-app
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### One-Click Deploy
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

## ⚫ Vercel

### Setup Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### GitHub Integration
1. Connect your GitHub repository at [vercel.com](https://vercel.com)
2. Import project
3. Deploy automatically on every push to main

### Environment Variables
- Set in Vercel Dashboard → Project → Settings → Environment Variables
- Required: `NODE_ENV=production`

## 🟠 Netlify Functions

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install serverless-http
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

### Manual Deploy
1. Drag and drop your project folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repository for automatic deployments

### Environment Variables
- Set in Netlify Dashboard → Site settings → Environment variables
- Required: `NODE_ENV=production`

## 🟪 Railway

### Setup Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**
   ```bash
   railway deploy
   ```

### GitHub Integration
1. Connect repository at [railway.app](https://railway.app)
2. Import project
3. Automatic deployments on push

### Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
```

## 🔷 Docker

### Local Development
```bash
# Build image
docker build -t wedonetrepoo .

# Run container
docker run -p 3000:3000 wedonetrepoo
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build and push to registry
docker build -t your-registry/wedonetrepoo:latest .
docker push your-registry/wedonetrepoo:latest

# Deploy to your orchestration platform (Kubernetes, Docker Swarm, etc.)
```

## 🔧 Environment Variables

### Required Variables
```env
NODE_ENV=production
PORT=3000
```

### Optional Variables
```env
# Security
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Database (if added)
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# External APIs
API_KEY=your-api-key
```

### Platform-Specific Setup

| Platform | Method |
|----------|--------|
| Azure | Portal → Configuration → Application settings |
| Heroku | `heroku config:set KEY=VALUE` |
| Vercel | Dashboard → Environment Variables |
| Netlify | Dashboard → Environment variables |
| Railway | `railway variables set KEY=VALUE` |
| Docker | Environment variables in container |

## 🧪 Testing Deployments

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app.com/health

# Application info
curl https://your-app.com/api/info

# Metrics
curl https://your-app.com/metrics

# Root endpoint
curl https://your-app.com/
```

Expected responses:
- `/health` → Status 200, system health data
- `/api/info` → Status 200, application information
- `/metrics` → Status 200, performance metrics
- `/` → Status 200, welcome message with endpoints

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
**Problem**: NPM install fails
**Solution**: 
- Check Node.js version in `package.json` engines
- Verify all dependencies are in `package.json`
- Clear npm cache: `npm cache clean --force`

#### 2. Port Issues
**Problem**: Application doesn't start
**Solution**:
- Ensure `PORT` environment variable is used: `process.env.PORT`
- Check platform-specific port requirements
- Verify no port conflicts

#### 3. Environment Variables Not Loading
**Problem**: App can't access environment variables
**Solution**:
- Verify variables are set in platform dashboard
- Check variable names (case-sensitive)
- Restart application after setting variables

#### 4. Timeout Errors
**Problem**: Function timeout on serverless platforms
**Solution**:
- Check function timeout limits (Vercel: 30s, Netlify: 10s)
- Optimize slow operations
- Add proper error handling

### Platform-Specific Troubleshooting

#### Azure
- Check Application Insights for errors
- Review deployment logs in Deployment Center
- Verify Web App runtime version

#### Heroku
- Check logs: `heroku logs --tail`
- Verify dyno is running: `heroku ps`
- Check resource usage: `heroku ps:scale`

#### Vercel
- Check function logs in Vercel Dashboard
- Verify serverless function configuration
- Check build logs

#### Netlify
- Review function logs in Netlify Dashboard
- Check build and deploy logs
- Verify netlify.toml configuration

#### Railway
- Check deployment logs in Railway Dashboard
- Verify service configuration
- Monitor resource usage

#### Docker
- Check container logs: `docker logs container-name`
- Verify port mapping: `-p 3000:3000`
- Check resource limits and health checks

### Debug Mode

Enable debug mode by setting:
```env
NODE_ENV=development
```

This will show detailed error messages and stack traces.

## 📊 Monitoring & Maintenance

### Health Monitoring
Set up monitoring for these endpoints:
- `/health` - Basic health check
- `/metrics` - Performance metrics

### Log Monitoring
The application logs:
- HTTP requests with response times
- Errors with stack traces  
- System metrics and warnings

### Performance Optimization
- Monitor memory usage via `/metrics`
- Check response times in logs
- Scale resources based on usage patterns

## 🔐 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Always use HTTPS in production
3. **Headers**: Security headers are configured in `vercel.json`
4. **Dependencies**: Regularly update dependencies
5. **Monitoring**: Set up error tracking (Sentry, etc.)

## 📚 Additional Resources

- [Azure Web Apps Documentation](https://docs.microsoft.com/azure/app-service/)
- [Heroku Node.js Documentation](https://devcenter.heroku.com/articles/nodejs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Railway Documentation](https://docs.railway.app/)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review platform-specific documentation
3. Check application logs
4. Verify environment variables
5. Test locally first

---

**Happy Deploying! 🚀**