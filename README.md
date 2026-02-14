# 🚀 MERN Portfolio - Abdullah Uzair

A full-stack professional portfolio website built with MongoDB, Express.js, React, and Node.js. Features a modern dark-themed UI with Tailwind CSS, admin dashboard for content management, and RESTful API.

![Portfolio Preview](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Production Deployment](#-production-deployment)
  - [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
  - [Backend Deployment (Render)](#2-backend-deployment-to-render)
  - [Frontend Deployment (Vercel)](#3-frontend-deployment-to-vercel)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Public Features
- 🎨 Modern dark-themed UI with Tailwind CSS
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Smooth animations with Framer Motion
- 🔍 Project search functionality
- 📧 Contact form with validation
- 💼 Skills showcase with proficiency levels
- 🎯 Professional portfolio layout

### Admin Features
- 🔐 Secure JWT authentication
- 📊 Dashboard with statistics
- ✏️ Full CRUD operations for projects
- 🎨 Skills management with categories
- 📬 Message management from contact form
- 👤 Profile settings and password change
- 🖼️ Image upload support

---

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.0.11** - Build tool
- **Tailwind CSS 3.4+** - Styling
- **React Router DOM 6.21.1** - Routing
- **Axios 1.6.5** - HTTP client
- **Framer Motion 11.0.3** - Animations
- **React Toastify 10.0.3** - Notifications
- **React Icons 5.0.1** - Icons

### Backend
- **Node.js 18+** - Runtime
- **Express 4.18.2** - Web framework
- **MongoDB & Mongoose 8.0.3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin support
- **Multer** - File uploads

---

## 📁 Project Structure

```
AbdullahUzair_Portfolio/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── uploads/           # File uploads directory
│   ├── .env.example       # Environment template
│   ├── package.json       # Backend dependencies
│   ├── README.md          # Backend documentation
│   └── server.js          # Application entry point
│
├── frontend/               # React + Vite frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images, fonts
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context providers
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── tailwind.css   # Tailwind styles
│   ├── .env.example       # Environment template
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── vite.config.js     # Vite configuration
│
└── README.md              # This file
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/AbdullahUzair-coder/AbdullahUzair_Portfolio.git
cd AbdullahUzair_Portfolio
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
# Required:
#   - MONGODB_URI (local: mongodb://localhost:27017/portfolio)
#   - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
#   - PORT (default: 5000)

# Create admin account
npm run create-admin
# Follow prompts to create your admin credentials

# Start development server
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Environment is already configured in .env file
# VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Test Locally
- **Public Pages**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Health**: http://localhost:5000/api/health
- **Admin Dashboard**: Login with credentials from step 2

---

## 🌐 Production Deployment

### Overview
- **Database**: MongoDB Atlas (Free tier available)
- **Backend**: Render.com (Free tier available)
- **Frontend**: Vercel (Free tier available)

### 1. MongoDB Atlas Setup

#### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Click **"Build a Database"**

#### Step 2: Choose Plan
1. Select **"Shared"** (Free tier - M0)
2. Choose your preferred **Cloud Provider** (AWS recommended)
3. Select **Region** closest to your Render deployment
4. Click **"Create Cluster"**

#### Step 3: Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Enter username: `admin` (or your choice)
5. **Auto-generate password** or create your own
6. **SAVE THIS PASSWORD** - you'll need it!
7. Set **Database User Privileges**: "Read and write to any database"
8. Click **"Add User"**

#### Step 4: Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Safe for production with proper authentication
4. Click **"Confirm"**

#### Step 5: Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Select **Driver**: Node.js, **Version**: 5.5 or later
4. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/portfolio` before the `?`
   ```
   mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

**✅ Save this connection string - you'll need it for Render!**

---

### 2. Backend Deployment to Render

#### Step 1: Prepare Backend
1. Ensure `backend/package.json` has start script:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. Verify `backend/server.js` uses `process.env.PORT`:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

#### Step 2: Push to GitHub
```bash
# From project root
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 3: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with **GitHub** account
3. Authorize Render to access your repositories

#### Step 4: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your **AbdullahUzair_Portfolio** repository
3. Configure:
   - **Name**: `portfolio-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

#### Step 5: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | Your Atlas connection string | From MongoDB Atlas step |
| `JWT_SECRET` | Generate random string | Use: `openssl rand -base64 32` |
| `PORT` | `10000` | Render's default port |
| `NODE_ENV` | `production` | Production mode |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Add after Vercel deploy |

**Generate JWT_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# On Windows (Command Prompt):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build and deployment
3. Your backend URL: `https://portfolio-backend.onrender.com`

#### Step 7: Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/api/health

# Expected response:
# {"status":"ok","message":"Portfolio API is running"}
```

#### Step 8: Create Admin Account
1. Go to Render Dashboard → Your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run create-admin
   ```
4. Follow prompts to create admin credentials
5. **Save your credentials!**

**✅ Backend is now live!**

---

### 3. Frontend Deployment to Vercel

#### Step 1: Update Frontend Environment
Edit `frontend/.env`:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=production
```

Commit changes:
```bash
git add frontend/.env
git commit -m "Update production API URL"
git push origin main
```

#### Step 2: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with **GitHub** account
3. Authorize Vercel to access repositories

#### Step 3: Import Project
1. Click **"Add New..."** → **"Project"**
2. **Import** your `AbdullahUzair_Portfolio` repository
3. Configure:
   - **Project Name**: `abdullah-portfolio` (or your choice)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Step 4: Add Environment Variables
Click **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com` |
| `VITE_API_TIMEOUT` | `10000` |
| `VITE_NODE_ENV` | `production` |

#### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your frontend URL: `https://abdullah-portfolio.vercel.app`

#### Step 6: Update Backend CORS
1. Go back to **Render** → Your backend service
2. Add/Update environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-app.vercel.app`
3. Save and redeploy backend

#### Step 7: Test Frontend
1. Visit your Vercel URL
2. Test public pages (Home, About, Projects, Skills, Contact)
3. Submit contact form
4. Login at `/admin/login`
5. Test admin dashboard

**✅ Frontend is now live!**

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# Authentication
JWT_SECRET=your-super-secret-jwt-token-min-32-characters
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app

# File Upload (Optional)
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email (Optional - for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_API_TIMEOUT=10000

# Environment
VITE_NODE_ENV=production
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "yourpassword"
}

Response: {
  "success": true,
  "data": {
    "token": "jwt-token",
    "admin": { ... }
  }
}
```

### Projects Endpoints

```http
GET    /api/projects           # Get all projects (public)
GET    /api/projects/:id       # Get single project
POST   /api/projects           # Create project (auth required)
PUT    /api/projects/:id       # Update project (auth required)
DELETE /api/projects/:id       # Delete project (auth required)
```

### Skills Endpoints

```http
GET    /api/skills             # Get all skills (public)
POST   /api/skills             # Create skill (auth required)
PUT    /api/skills/:id         # Update skill (auth required)
DELETE /api/skills/:id         # Delete skill (auth required)
```

### Messages Endpoints

```http
POST   /api/messages           # Submit contact message (public)
GET    /api/messages           # Get all messages (auth required)
DELETE /api/messages/:id       # Delete message (auth required)
```

### Admin Endpoints

```http
GET    /api/admin/profile      # Get admin profile (auth required)
PUT    /api/admin/profile      # Update profile (auth required)
PUT    /api/admin/password     # Change password (auth required)
```

**Authentication**: Include JWT token in header:
```http
Authorization: Bearer your-jwt-token
```

---

## 🔒 Security Best Practices

### Implemented Security Features

1. **Authentication**
   - JWT tokens with expiration
   - Bcrypt password hashing (10 rounds)
   - Protected routes with middleware

2. **Input Validation**
   - Express Validator for all inputs
   - Sanitization of user data
   - File type and size restrictions

3. **HTTP Security**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting on auth routes
   - XSS protection

4. **Database Security**
   - MongoDB injection prevention
   - Mongoose schema validation
   - No raw queries

5. **Environment**
   - Secrets in environment variables
   - No credentials in code
   - .gitignore for sensitive files

### Additional Recommendations

1. **Enable HTTPS**
   - Render and Vercel provide SSL by default

2. **Monitor Logs**
   - Check Render logs regularly
   - Set up error alerts

3. **Backup Database**
   - MongoDB Atlas automatic backups
   - Export data periodically

4. **Update Dependencies**
   ```bash
   npm audit
   npm update
   ```

5. **Use Strong JWT Secret**
   - Minimum 32 characters
   - Random and unique

---

## 🐛 Troubleshooting

### Backend Issues

#### Error: Cannot connect to MongoDB
**Solution:**
1. Check MongoDB Atlas connection string
2. Verify IP whitelist includes 0.0.0.0/0
3. Ensure database user has correct permissions
4. Check username and password in connection string

#### Error: JWT token invalid
**Solution:**
1. Clear localStorage in browser
2. Re-login to get new token
3. Verify JWT_SECRET matches in .env

#### Error: Port already in use
**Solution:**
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Frontend Issues

#### Error: Network error / Cannot connect to API
**Solution:**
1. Verify `VITE_API_BASE_URL` in .env
2. Check backend is running
3. Check CORS configuration in backend
4. Ensure backend allows frontend URL

#### Error: 404 on page refresh (Vercel)
**Solution:**
Vercel automatically handles this with Vite/React Router

#### Error: Environment variables not loading
**Solution:**
1. Variables must start with `VITE_`
2. Restart dev server after changes
3. Rebuild for production

### Deployment Issues

#### Render: Build failing
**Solution:**
1. Check Node version (18+)
2. Verify `package.json` scripts
3. Check build logs for errors
4. Ensure all dependencies in `package.json`

#### Vercel: Build failing
**Solution:**
1. Verify root directory is `frontend`
2. Check build command: `npm run build`
3. Ensure output directory: `dist`
4. Check for TypeScript errors

#### MongoDB: Connection timeout
**Solution:**
1. Verify Network Access in Atlas
2. Check connection string format
3. Ensure cluster is not paused (free tier)

---

## 📞 Support

### Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start development
npm start            # Start production
npm run create-admin # Create admin account

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview production build

# Git
git status           # Check status
git add .            # Stage changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
```

### Useful Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Abdullah Uzair**

- GitHub: [@AbdullahUzair-coder](https://github.com/AbdullahUzair-coder)
- LinkedIn: [Abdullah Uzair](https://linkedin.com/in/abdullah-uzair)
- Portfolio: [Live Demo](https://your-portfolio-url.vercel.app)

---

## 🙏 Acknowledgments

- Built with ❤️ using MERN Stack
- Styled with Tailwind CSS
- Deployed on Render & Vercel
- Database hosted on MongoDB Atlas

---

**⭐ If you find this project helpful, please give it a star!**

**🚀 Ready to deploy your own portfolio? Follow the guide above!**

---

*Last Updated: February 2026*
