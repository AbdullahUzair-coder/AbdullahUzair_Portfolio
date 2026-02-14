const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  submitContact,
  getContacts,
  getContact,
  replyContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validator');

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

// Public routes
router.post('/', contactValidation, validate, submitContact);

// Protected routes (Admin only)
router.get('/', protectAdmin, getContacts);
router.get('/:id', protectAdmin, getContact);
router.put('/:id/reply', protectAdmin, replyContact);
router.put('/:id/status', protectAdmin, updateContactStatus);
router.delete('/:id', protectAdmin, deleteContact);

module.exports = router;
