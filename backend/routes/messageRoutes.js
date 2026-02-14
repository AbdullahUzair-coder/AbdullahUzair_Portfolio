const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createMessage,
  getAllMessages,
  getMessage,
  deleteMessage
} = require('../controllers/messageController');
const { protectAdmin } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validator');

// Validation rules for creating message
const messageValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .escape()
];

// Public routes
router.post('/', messageValidation, validate, createMessage);

// Protected routes (Admin only)
router.get('/', protectAdmin, getAllMessages);
router.get('/:id', protectAdmin, getMessage);
router.delete('/:id', protectAdmin, deleteMessage);

module.exports = router;
