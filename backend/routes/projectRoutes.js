const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protectAdmin } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validator');

// Validation rules for creating project
const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('techStack')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required')
    .custom((value) => {
      if (value.some(tech => typeof tech !== 'string' || tech.trim() === '')) {
        throw new Error('All technologies must be non-empty strings');
      }
      return true;
    }),
  body('githubLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('liveLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid live demo URL'),
  body('image')
    .optional()
    .trim()
    .isString()
    .withMessage('Image must be a string')
];

// Validation rules for updating project (all fields optional)
const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('techStack')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one technology is required')
    .custom((value) => {
      if (value.some(tech => typeof tech !== 'string' || tech.trim() === '')) {
        throw new Error('All technologies must be non-empty strings');
      }
      return true;
    }),
  body('githubLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('liveLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid live demo URL'),
  body('image')
    .optional()
    .trim()
    .isString()
    .withMessage('Image must be a string')
];

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes (Admin only)
router.post('/', protectAdmin, createProjectValidation, validate, createProject);
router.put('/:id', protectAdmin, updateProjectValidation, validate, updateProject);
router.delete('/:id', protectAdmin, deleteProject);

module.exports = router;
