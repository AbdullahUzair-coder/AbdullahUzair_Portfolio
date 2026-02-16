const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificatesByCategory
} = require('../controllers/certificateController');
const { protectAdmin } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

// Validation rules
const certificateValidation = [
  body('title').trim().notEmpty().withMessage('Certificate title is required'),
  body('issuer').trim().notEmpty().withMessage('Issuer name is required'),
  body('date').notEmpty().withMessage('Issue date is required'),
  body('category')
    .optional()
    .isIn(['coursera', 'udemy', 'linkedin', 'google', 'microsoft', 'aws', 'other'])
    .withMessage('Invalid category')
];

// File upload fields
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

// Public routes
router.get('/', getCertificates);
router.get('/grouped', getCertificatesByCategory);
router.get('/:id', getCertificate);

// Protected routes (Admin only)
router.post('/', protectAdmin, uploadFields, certificateValidation, validate, createCertificate);
router.put('/:id', protectAdmin, uploadFields, certificateValidation, validate, updateCertificate);
router.delete('/:id', protectAdmin, deleteCertificate);

module.exports = router;
