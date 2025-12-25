# 🚀 Backend Deployment Checklist

## Pre-Deployment ✅
- [x] All configuration files created
- [x] PostgreSQL dependency added to pom.xml
- [x] Application profiles configured (dev/prod)
- [x] Health check endpoint created
- [x] Build script with permission fixes
- [x] Render.yaml configuration ready
- [x] Changes committed to GitHub

## Render.com Deployment Steps 📋

### 1. Database Setup
- [ ] Create Render account at render.com
- [ ] Create new PostgreSQL database
- [ ] Name: `neenu-natural-db`
- [ ] Plan: Free
- [ ] Save connection details

### 2. Backend Service Setup
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory: `backend`
- [ ] Runtime: Java
- [ ] Build command: `chmod +x ./mvnw && ./mvnw clean package -DskipTests`
- [ ] Start command: `java -Dserver.port=$PORT -jar target/sanathana-parampara-0.0.1-SNAPSHOT.jar`
- [ ] Plan: Free

### 3. Environment Variables
Add these in Render service settings:
- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `SPRING_DATASOURCE_URL=<your-postgres-url>`
- [ ] `SPRING_DATASOURCE_USERNAME=<your-postgres-username>`
- [ ] `SPRING_DATASOURCE_PASSWORD=<your-postgres-password>`

### 4. Testing
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Check deployment logs for errors
- [ ] Test health endpoint: `https://your-service.onrender.com/api/health`
- [ ] Test your API endpoints

### 5. Frontend Integration
- [ ] Update Vercel environment variable: `VITE_API_BASE_URL`
- [ ] Set to: `https://your-backend.onrender.com/api`
- [ ] Redeploy frontend
- [ ] Test full application flow

## 🆘 Quick Fixes for Common Issues

### Build Failed - Permission Denied
```bash
# Already fixed with build.sh script
chmod +x ./mvnw && ./mvnw clean package -DskipTests
```

### Database Connection Error
- Check environment variables are exactly correct
- Ensure database is in same region as service
- Verify connection string format

### Memory Issues
```bash
# Already optimized in start.sh
java -Xmx512m -Xms256m -jar target/sanathana-parampara-0.0.1-SNAPSHOT.jar
```

### CORS Issues
- Update allowed origins in application-prod.properties
- Add your frontend domain

## 📞 Support
- Render Docs: https://render.com/docs
- Spring Boot Docs: https://spring.io/guides
- PostgreSQL Docs: https://www.postgresql.org/docs/

## 🎯 Success Criteria
✅ Backend deployed and accessible
✅ Health check returns 200 OK
✅ Database connected successfully
✅ Frontend can communicate with backend
✅ Full application workflow tested

---
**File Location**: `C:\Users\nishm\sanathana-parampara\Neenu_Natural2-nishmithaNew\`