const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @desc    Protect admin routes - verify JWT token
exports.protectAdmin = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token has expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.'
        });
      }

      // Get admin from token
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({
          status: 'error',
          message: 'Admin not found. Authorization failed.'
        });
      }

      next();
    } catch (error) {
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token. Please login again.'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.'
        });
      }

      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Optional admin authentication - doesn't fail if no token
exports.optionalAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select('-password');
      } catch (error) {
        // Token validation failed, continue without admin
        req.admin = null;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// @desc    Rate limiting for authentication attempts
const loginAttempts = new Map();

exports.rateLimitLogin = (req, res, next) => {
  const identifier = req.body.email || req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!loginAttempts.has(identifier)) {
    loginAttempts.set(identifier, []);
  }

  const attempts = loginAttempts.get(identifier);
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many login attempts. Please try again after 15 minutes.'
    });
  }

  // Add current attempt
  recentAttempts.push(now);
  loginAttempts.set(identifier, recentAttempts);

  next();
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  
  for (const [identifier, attempts] of loginAttempts.entries()) {
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    if (recentAttempts.length === 0) {
      loginAttempts.delete(identifier);
    } else {
      loginAttempts.set(identifier, recentAttempts);
    }
  }
}, 60 * 1000); // Clean up every minute
