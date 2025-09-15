# Azure Web Apps Deployment Guide

This repository is configured for automatic deployment to Azure Web Apps using GitHub Actions.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **Azure Web App**: Create an Azure Web App service in the Azure Portal
3. **GitHub Repository**: This repository with the workflow configured

## Setup Instructions

### Step 1: Create Azure Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Web App** resource
3. Configure:
   - **Name**: Choose a unique name (update the workflow file accordingly)
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Linux (recommended)
   - **Region**: Choose your preferred region

### Step 2: Get Publish Profile

1. In your Azure Web App, go to the **Overview** page
2. Click **Get publish profile** (download button)
3. Save the downloaded `.publishsettings` file content

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Create a secret named: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Paste the entire content of the publish profile file as the value

### Step 4: Update Workflow Configuration

1. Open `.github/workflows/azure-webapps-node.yml`
2. Update the `AZURE_WEBAPP_NAME` environment variable:
   ```yaml
   env:
     AZURE_WEBAPP_NAME: your-actual-app-name  # Replace with your Azure Web App name
   ```

### Step 5: Deploy

1. Push changes to the `main` branch
2. The GitHub Action will automatically trigger
3. Monitor the deployment in the **Actions** tab
4. Once successful, your app will be available at: `https://your-app-name.azurewebsites.net`

## Troubleshooting

### Common Issues:

1. **Build fails with "npm install" error**
   - ✅ Fixed: `package.json` now included

2. **Missing application files**
   - ✅ Fixed: `server.js` now included

3. **Invalid app name**
   - ❗ Action Required: Update `AZURE_WEBAPP_NAME` in the workflow file

4. **Missing publish profile secret**
   - ❗ Action Required: Add `AZURE_WEBAPP_PUBLISH_PROFILE` secret

5. **Node version mismatch**
   - The workflow uses Node 20.x which matches the package.json engines requirement

### Verification Steps:

1. Check that all required files exist:
   - ✅ `package.json`
   - ✅ `server.js`
   - ✅ `.github/workflows/azure-webapps-node.yml`

2. Verify GitHub secrets are configured:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`

3. Confirm Azure Web App settings:
   - Runtime: Node 20 LTS
   - Always On: Enabled (recommended)

## Testing Locally

```bash
# Install dependencies
npm install

# Run the application
npm start

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/info
```

## API Endpoints

- `GET /` - Welcome message and available endpoints
- `GET /health` - Health check endpoint
- `GET /api/info` - Application information and system details

## Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify Azure Web App logs in the Azure Portal
3. Ensure all secrets and configuration values are correct