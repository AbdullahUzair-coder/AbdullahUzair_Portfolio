# Portfolio Frontend - React + Vite

A modern, responsive portfolio website built with React and Vite. Features a public-facing portfolio with an admin dashboard for content management.

---

## 🚀 Features

### Public Features
- **Responsive Design** - Mobile-first, works on all devices
- **Modern UI/UX** - Clean interface with smooth animations
- **Home Page** - Hero section with call-to-action
- **About Page** - Personal information and skills overview
- **Projects Page** - Showcase portfolio projects with search
- **Skills Page** - Display technical skills with proficiency levels
- **Contact Page** - Contact form with validation

### Admin Features
- **Secure Login** - JWT-based authentication
- **Dashboard** - Overview of portfolio statistics
- **Project Management** - Full CRUD operations for projects
- **Skills Management** - Add, edit, delete skills
- **Messages** - View and manage contact form submissions
- **Profile Settings** - Update admin profile and password

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   │   ├── AdminHeader.jsx
│   │   │   └── AdminSidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── layouts/         # Layout components
│   │   ├── AdminLayout.jsx
│   │   └── PublicLayout.jsx
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Skills.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   ├── services/        # API services
│   │   ├── api.js       # Axios instance
│   │   └── apiService.js # API methods
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── .env.example         # Environment variables template
├── .gitignore
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

---

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_API_TIMEOUT=10000
   VITE_NODE_ENV=development
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will open at `http://localhost:3000`

---

## 📦 Dependencies

### Core
- **React** (v18.2.0) - UI library
- **React Router DOM** (v6.21.1) - Routing
- **Axios** (v1.6.5) - HTTP client
- **React Toastify** (v10.0.3) - Notifications
- **Framer Motion** (v11.0.3) - Animations
- **React Icons** (v5.0.1) - Icon library

### Dev Dependencies
- **Vite** (v5.0.11) - Build tool
- **ESLint** - Code linting

---

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## 🌐 Pages Overview

### Public Pages

#### Home (`/`)
- Hero section with introduction
- Featured services
- Call-to-action buttons
- Social media links

#### About (`/about`)
- Personal information
- Experience highlights
- Technologies overview

#### Projects (`/projects`)
- Grid of portfolio projects
- Search functionality
- Project details with tech stack
- Links to GitHub and live demos

#### Skills (`/skills`)
- Skills grouped by category
- Proficiency levels with progress bars
- Icon representation

#### Contact (`/contact`)
- Contact form with validation
- Contact information
- Form submission to backend API

### Admin Pages

#### Login (`/admin/login`)
- Secure authentication
- JWT token management
- Redirect to dashboard on success

#### Dashboard (`/admin/dashboard`)
- Statistics overview
- Quick action links
- Portfolio metrics

#### Projects Management (`/admin/projects`)
- Create new projects
- Edit existing projects
- Delete projects
- Modal forms with validation

#### Skills Management (`/admin/skills`)
- Add skills with proficiency
- Categorize skills
- Edit and delete skills
- Range slider for proficiency

#### Messages (`/admin/messages`)
- View contact submissions
- Message details view
- Reply via email
- Delete messages

#### Profile (`/admin/profile`)
- Update username and email
- Change password
- Tab interface

---

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. Login credentials sent to backend
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in API requests via interceptor
5. Protected routes check for valid token

### Auth Context

`AuthContext` provides:
- `user` - Current user data
- `isAuthenticated` - Authentication status
- `loading` - Loading state
- `login(username, password)` - Login method
- `logout()` - Logout method
- `updateUser(userData)` - Update user data

---

## 🎨 Styling

### CSS Variables

Global CSS variables defined in `index.css`:

```css
--primary-color: #2563eb
--secondary-color: #1e40af
--accent-color: #3b82f6
--text-primary: #1f2937
--text-secondary: #6b7280
/* ... and more */
```

### Utility Classes

Common utility classes:
- `.container` - Max-width container
- `.btn` - Button base
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card component
- `.spinner` - Loading spinner

---

## 🔌 API Integration

### API Service (`apiService.js`)

Organized by resource:

```javascript
import { authAPI, projectsAPI, skillsAPI, messagesAPI, adminAPI } from './services/apiService'

// Authentication
await authAPI.login(username, password)
await authAPI.getCurrentAdmin()
await authAPI.logout()

// Projects
await projectsAPI.getAll(params)
await projectsAPI.create(projectData)
await projectsAPI.update(id, projectData)
await projectsAPI.delete(id)

// Skills
await skillsAPI.getAll()
await skillsAPI.create(skillData)

// Messages
await messagesAPI.submit(messageData)
await messagesAPI.getAll()
await messagesAPI.delete(id)

// Admin
await adminAPI.getProfile()
await adminAPI.updateProfile(data)
await adminAPI.changePassword(data)
```

### Axios Interceptors

**Request Interceptor:**
- Adds JWT token to Authorization header
- Includes cookies in requests

**Response Interceptor:**
- Handles errors globally
- Shows toast notifications
- Redirects to login on 401

---

## 🎯 Key Features Implementation

### Protected Routes

```javascript
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute>
}>
  {/* Admin routes */}
</Route>
```

### Form Validation

- Client-side validation
- Server-side validation via backend
- Error messages displayed via toast

### Search & Filter

Projects page includes:
- Real-time search
- Debounced API calls
- Loading states

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 968px
- Flexible grid layouts
- Hamburger menu on mobile

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Environment Variables

Set these in your hosting platform:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_NODE_ENV=production
```

### Deployment Platforms

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
- Update `vite.config.js` with base path
- Build and deploy to `gh-pages` branch

---

## 🧪 Testing

### Manual Testing Checklist

**Public Pages:**
- [ ] Home page loads correctly
- [ ] Navigation works on all pages
- [ ] Projects load from API
- [ ] Skills display with categories
- [ ] Contact form submits successfully
- [ ] Responsive on mobile devices

**Admin Pages:**
- [ ] Login with valid credentials
- [ ] Dashboard shows statistics
- [ ] Can create/edit/delete projects
- [ ] Can manage skills
- [ ] Messages display correctly
- [ ] Profile updates work
- [ ] Password change works
- [ ] Logout clears session

---

## 🔒 Security Best Practices

✅ **Implemented:**
- JWT tokens with expiration
- HTTP-only cookies support
- Protected admin routes
- XSS prevention (React escapes by default)
- CSRF protection via tokens
- Input validation
- Secure password requirements

❗ **Additional Recommendations:**
- Use HTTPS in production
- Implement rate limiting
- Add CAPTCHA to contact form
- Regular security audits

---

## 🎨 Customization

### Change Color Scheme

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... */
}
```

### Update Content

1. **Logo/Name:** Edit `Navbar.jsx`
2. **Hero Section:** Edit `pages/Home.jsx`
3. **About Info:** Edit `pages/About.jsx`
4. **Contact Info:** Edit `pages/Contact.jsx`
5. **Footer Links:** Edit `components/Footer.jsx`

---

## 🐛 Troubleshooting

### Issue: API calls failing

**Solution:**
- Check backend is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for errors
- Verify CORS settings in backend

### Issue: Login not working

**Solution:**
- Check credentials are correct
- Verify backend API is accessible
- Clear localStorage: `localStorage.clear()`
- Check token in browser DevTools

### Issue: Build errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

ISC License

---

## 👨‍💻 Author

**Abdullah Uzair**

- Portfolio: [Your Portfolio URL]
- GitHub: [@AbdullahUzair-coder](https://github.com/AbdullahUzair-coder)
- LinkedIn: [Abdullah Uzair](https://linkedin.com/in/abdullah-uzair)
- Email: contact@abdullahuzair.com

---

## 🙏 Acknowledgments

- React team for the amazing library
- Vite team for the blazing-fast build tool
- Open source community

---

**Happy Coding! 🚀**
