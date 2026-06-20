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
const upload = require('../middleware/upload');

// When the form is sent as multipart/form-data (file upload), array fields like
// techStack arrive as a JSON string. Parse it back into an array before validation.
const parseProjectBody = (req, res, next) => {
  if (typeof req.body.techStack === 'string') {
    try {
      const parsed = JSON.parse(req.body.techStack);
      if (Array.isArray(parsed)) req.body.techStack = parsed;
    } catch (e) {
      // leave as-is; validation will surface the error
    }
  }
  next();
};

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
  body('videoUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid video URL'),
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
  body('videoUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid video URL'),
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
router.post('/', protectAdmin, upload.single('image'), parseProjectBody, createProjectValidation, validate, createProject);
router.put('/:id', protectAdmin, upload.single('image'), parseProjectBody, updateProjectValidation, validate, updateProject);
router.delete('/:id', protectAdmin, deleteProject);

module.exports = router;
