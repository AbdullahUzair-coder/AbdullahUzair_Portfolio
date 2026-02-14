# Portfolio Backend API

A professional Node.js + Express backend API for a portfolio website with admin dashboard functionality. Built with MVC architecture, MongoDB, and JWT authentication.

## 🚀 Features

- **MVC Architecture** - Clean separation of concerns
- **RESTful API** - Standard HTTP methods and status codes
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **MongoDB & Mongoose** - NoSQL database with elegant ODM
- **Security** - Helmet, CORS, rate limiting, password hashing
- **Validation** - Express-validator for input validation
- **Error Handling** - Centralized error handling middleware
- **File Upload** - Multer for handling file uploads
- **Production Ready** - Environment-based configuration

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Public authentication logic
│   ├── adminAuthController.js # Admin authentication logic
│   ├── projectController.js # Project CRUD operations
│   ├── skillController.js   # Skill management
│   ├── contactController.js # Contact info handling
│   ├── messageController.js # Contact form message handling
│   └── adminController.js   # Admin dashboard operations
├── middleware/
│   ├── adminAuth.js         # JWT authentication & authorization
│   ├── errorHandler.js      # Global error handling
│   ├── validator.js         # Input validation rules
│   └── upload.js            # File upload configuration
├── models/
│   ├── Admin.js             # Admin model with auth methods
│   ├── Project.js           # Project model
│   ├── Skill.js             # Skill model
│   ├── Experience.js        # Work experience model
│   ├── Certificate.js       # Certificate model
│   ├── Contact.js           # Contact information model
│   └── Message.js           # Contact form messages
├── routes/
│   ├── authRoutes.js        # Public authentication routes
│   ├── adminAuthRoutes.js   # Admin authentication routes
│   ├── projectRoutes.js     # Project CRUD routes
│   ├── skillRoutes.js       # Skill routes
│   ├── contactRoutes.js     # Contact information routes
│   ├── messageRoutes.js     # Contact form message routes
│   └── adminRoutes.js       # Admin management routes
├── public/
│   └── uploads/             # Uploaded files directory
├── utils/                   # Utility functions
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── createAdmin.js           # CLI tool to create first admin
├── package.json             # Dependencies and scripts
└── server.js                # Application entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Auto-generated when you run create-admin
   - `PORT` - Server port (default: 5000)
   - `CLIENT_URL` - Frontend URL for CORS
   - `NODE_ENV` - Environment (development/production)

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Create first admin account**
   ```bash
   npm run create-admin
   ```
   Follow the interactive prompts to create your admin account.

6. **Run the application**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 Documentation

For detailed API documentation, see:

- **[API_OVERVIEW.md](./API_OVERVIEW.md)** - Complete API reference with all endpoints
- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md)** - JWT authentication guide
- **[PROJECT_API_DOCS.md](./PROJECT_API_DOCS.md)** - Project CRUD API details
- **[PROJECT_API_TEST.md](./PROJECT_API_TEST.md)** - Testing examples
- **[MESSAGES_API.md](./MESSAGES_API.md)** - Contact form API guide

## 🌐 API Endpoints

### Admin Authentication (`/api/admin/auth`)
- `POST /login` - Admin login
- `GET /me` - Get current admin (protected)
- `POST /logout` - Logout admin (protected)

### Projects (`/api/projects`)
- `GET /` - Get all projects (public, supports search/pagination/sort)
- `GET /:id` - Get single project (public)
- `POST /` - Create project (admin)
- `PUT /:id` - Update project (admin)
- `DELETE /:id` - Delete project (admin)

### Skills (`/api/skills`)
- `GET /` - Get all skills (public)
- `GET /:id` - Get single skill (public)
- `POST /` - Create skill (admin)
- `PUT /:id` - Update skill (admin)
- `DELETE /:id` - Delete skill (admin)

### Messages (`/api/messages`)
- `POST /` - Submit contact form message (public)
- `GET /` - Get all messages (admin)
- `GET /:id` - Get single message (admin)
- `DELETE /:id` - Delete message (admin)

### Admin Management (`/api/admin`)
- `GET /profile` - Get admin profile (admin)
- `PUT /profile` - Update admin profile (admin)
- `PUT /password` - Change password (admin)

**For detailed API documentation with request/response examples, see [API_OVERVIEW.md](./API_OVERVIEW.md)**

## 🔒 Security Features

- **Helmet** - Sets security HTTP headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents brute force attacks
- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Stateless authentication
- **Input Validation** - Validates and sanitizes user input
- **SQL Injection Protection** - Mongoose prevents NoSQL injection

## 📦 Dependencies

### Core Dependencies
- `express` (v4.18.2) - Web framework
- `mongoose` (v8.0.3) - MongoDB ODM
- `dotenv` (v16.3.1) - Environment variables
- `cors` (v2.8.5) - CORS middleware
- `bcryptjs` (v2.4.3) - Password hashing
- `jsonwebtoken` (v9.0.2) - JWT authentication
- `cookie-parser` (v1.4.6) - Cookie parsing middleware

### Security & Middleware
- `helmet` (v7.1.0) - Security headers
- `express-rate-limit` (v7.1.5) - Rate limiting
- `express-validator` (v7.0.1) - Input validation & sanitization
- `morgan` (v1.10.0) - HTTP request logger
- `compression` (v1.7.4) - Response compression

### Utilities
- `multer` (v1.4.5-lts.1) - File upload handling
- `nodemailer` (v6.9.7) - Email sending

### Development
- `nodemon` (v3.0.2) - Auto-restart server

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name portfolio-api
   ```
3. Set up a reverse proxy (Nginx recommended)
4. Use environment variables for sensitive data
5. Enable HTTPS/SSL
6. Set up MongoDB in production (MongoDB Atlas recommended)

## 📝 Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC License

## 👨‍💻 Author

**Abdullah Uzair**

---

For questions or support, please open an issue in the repository.
