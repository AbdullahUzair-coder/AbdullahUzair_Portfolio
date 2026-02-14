const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin,
  updateProfile,
  updatePassword,
  verifyToken
} = require('../controllers/adminAuthController');
const { protectAdmin, rateLimitLogin } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validator');

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Public routes
router.post('/login', rateLimitLogin, loginValidation, validate, loginAdmin);

// Protected routes
router.post('/register', protectAdmin, registerValidation, validate, registerAdmin);
router.get('/me', protectAdmin, getMe);
router.post('/logout', protectAdmin, logoutAdmin);
router.put('/profile', protectAdmin, updateProfileValidation, validate, updateProfile);
router.put('/password', protectAdmin, updatePasswordValidation, validate, updatePassword);
router.get('/verify', protectAdmin, verifyToken);

module.exports = router;
