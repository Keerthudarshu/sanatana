# Docker Deployment Guide for Render

This guide will help you deploy your Spring Boot + React application to Render using Docker.

## Files Created/Modified

### 1. Dockerfile (Root Directory)
- **Multi-stage build** that compiles both frontend and backend
- **Stage 1**: Builds React frontend using Node.js
- **Stage 2**: Builds Spring Boot backend using OpenJDK 21
- **Stage 3**: Production runtime with OpenJDK 21 JRE
- Includes health checks and security best practices

### 2. .dockerignore (Root Directory)
- Excludes build artifacts, node_modules, and unnecessary files
- Improves build performance and reduces image size

### 3. render.yaml (Root Directory)
- Updated to use Docker instead of native Java build
- Uses `env: docker` and specifies Dockerfile path
- Maintains database configuration and environment variables

### 4. Backend Configuration Updates
- **WebConfig.java**: Updated to serve frontend static files and handle CORS for Render
- **FrontendController.java**: New controller for SPA routing fallback

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes** to your Git repository:
   ```bash
   git add .
   git commit -m "Add Docker configuration for Render deployment"
   git push origin main
   ```

### Step 2: Set Up Render Service

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository branch (usually `main`)

3. **Configure the Service**:
   - **Name**: `neenu-natural-fullstack` (or your preferred name)
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: Leave empty (Docker handles build)
   - **Start Command**: Leave empty (Docker handles start)

### Step 3: Configure Environment Variables

In Render service settings, add these environment variables:

#### Required Environment Variables:
```
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
```

#### Database Variables (Auto-configured if using Render PostgreSQL):
```
SPRING_DATASOURCE_URL=${DATABASE_URL}
SPRING_DATASOURCE_USERNAME=${DATABASE_USER}
SPRING_DATASOURCE_PASSWORD=${DATABASE_PASSWORD}
```

### Step 4: Set Up Database (if needed)

1. **Create PostgreSQL Database**:
   - In Render Dashboard: "New +" → "PostgreSQL"
   - Choose free tier
   - Name: `neenu-natural-db`

2. **Link Database to Web Service**:
   - In your web service settings
   - Go to "Environment" tab
   - Connect the database you created

### Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain and configure DNS

### Step 6: Deploy

1. **Trigger Deployment**:
   - Render will automatically deploy when you push to your connected branch
   - Or manually trigger from Render dashboard

2. **Monitor Deployment**:
   - Check the "Events" tab for build progress
   - Watch for any errors in the logs

## Health Check

Your application includes a health check endpoint at `/api/health`. Render will use this to ensure your application is running properly.

## CORS Configuration

The backend is configured to accept requests from:
- `localhost:3000` (development)
- `*.onrender.com` (Render domains)
- Your custom domain (update in WebConfig.java if needed)

## File Storage

For file uploads, the application now uses an environment-configurable upload directory. In production, you may want to:

1. **Use Render Persistent Disks** for file storage
2. **Use external storage** like AWS S3, Cloudinary, etc.
3. **Mount a volume** in Docker for persistent storage

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Dockerfile syntax
   - Ensure all files are committed to Git
   - Check build logs for specific errors

2. **Application Won't Start**:
   - Verify environment variables
   - Check database connection
   - Review application logs

3. **Frontend Not Loading**:
   - Ensure frontend build was successful
   - Check WebConfig.java resource handler configuration
   - Verify FrontendController.java is properly configured

4. **Database Connection Issues**:
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is running and accessible

### Useful Commands for Local Testing:

```bash
# Build Docker image locally
docker build -t neenu-natural .

# Run locally with environment variables
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/yourdb" \
  -e SPRING_DATASOURCE_USERNAME="yourusername" \
  -e SPRING_DATASOURCE_PASSWORD="yourpassword" \
  neenu-natural

# Check if container is running
docker ps

# View container logs
docker logs <container-id>
```

## Performance Optimization

### For Production:

1. **Enable Gzip Compression** (add to application.properties):
   ```properties
   server.compression.enabled=true
   server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain,application/javascript,text/css
   ```

2. **Configure Caching** for static resources

3. **Use CDN** for static assets if needed

4. **Monitor Resource Usage** in Render dashboard

## Security Considerations

1. **Never commit sensitive data** to Git
2. **Use environment variables** for all secrets
3. **Keep dependencies updated**
4. **Enable HTTPS** (Render provides this automatically)
5. **Configure proper CORS origins**

## Scaling

- **Render Free Tier**: Limited resources, sleeps after inactivity
- **Paid Tiers**: More resources, no sleeping, better performance
- **Consider upgrading** if you need consistent uptime

---

## Quick Checklist

- [ ] All files committed and pushed to Git
- [ ] Render service created and configured
- [ ] Environment variables set
- [ ] Database created and linked (if needed)
- [ ] Health check endpoint working
- [ ] CORS configured for your domain
- [ ] File upload directory configured
- [ ] DNS configured (for custom domain)

Your application should now be accessible at your Render URL!