# ⚡ RENDER DEPLOYMENT QUICK CHECKLIST

## 📋 Pre-Deployment Checklist
- [ ] All code committed to GitHub
- [ ] Repository: `Nishukvgce/sanathana-parampara` is accessible
- [ ] Files present: `backend/pom.xml`, `backend/build.sh`, `backend/render.yaml`

## 🗄️ Database Setup (5 mins)
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub account
- [ ] Click "New +" → "PostgreSQL"
- [ ] Name: `neenu-natural-db`
- [ ] Region: Oregon (US West)
- [ ] Plan: FREE
- [ ] Click "Create Database"
- [ ] **WAIT 3 minutes** for creation
- [ ] Copy connection details (keep tab open)

## 🚀 Backend Deployment (10 mins)
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `Nishukvgce/sanathana-parampara`
- [ ] Name: `neenu-natural-backend`
- [ ] Region: Oregon (US West) **SAME as database**
- [ ] Root Directory: `backend`
- [ ] Build Command: `chmod +x ./mvnw && ./mvnw clean package -DskipTests`
- [ ] Start Command: `java -Dserver.port=$PORT -jar target/sanathana-parampara-0.0.1-SNAPSHOT.jar`
- [ ] Plan: FREE

## 🔑 Environment Variables (CRITICAL)
Add these 4 variables:

1. **SPRING_PROFILES_ACTIVE**
   - Value: `prod`

2. **SPRING_DATASOURCE_URL**
   - Get from database → Connections
   - Format: `jdbc:postgresql://hostname:port/database`
   - Example: `jdbc:postgresql://dpg-xyz123.oregon-postgres.render.com:5432/neenu_natural`

3. **SPRING_DATASOURCE_USERNAME**
   - Get from database connection string
   - Example: `user123`

4. **SPRING_DATASOURCE_PASSWORD**
   - Get from database connection string
   - Example: `pass456`

## ✅ Deployment & Testing
- [ ] Click "Create Web Service"
- [ ] **WAIT 10 minutes** for first deployment
- [ ] Monitor logs for success messages
- [ ] Test health endpoint: `https://your-app.onrender.com/api/health`
- [ ] Should return: `{"status": "UP", "service": "Neenu Natural Backend"}`

## 🌐 Update Frontend
- [ ] Go to Vercel dashboard
- [ ] Update environment variable:
   - **VITE_API_BASE_URL**: `https://your-app.onrender.com/api`
- [ ] Redeploy frontend

## 🎯 Final URLs
- **Backend**: `https://neenu-natural-backend.onrender.com`
- **Health Check**: `https://neenu-natural-backend.onrender.com/api/health`
- **API Base**: `https://neenu-natural-backend.onrender.com/api`

## 🐛 Common Issues
- **Build fails**: Check build command has `chmod +x ./mvnw`
- **DB connection fails**: Verify environment variables are exact
- **Slow start**: First start takes 2-3 minutes (normal)
- **App sleeps**: Free tier sleeps after 15 minutes (normal)

---

**🎉 SUCCESS**: When health endpoint returns `{"status": "UP"}`, your backend is live!