const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByCategory
} = require('../controllers/skillController');
const { protectAdmin } = require('../middleware/adminAuth');
const { validate } = require('../middleware/validator');

// Validation rules
const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['frontend', 'backend', 'database', 'devops', 'tools', 'other'])
    .withMessage('Invalid category'),
  body('proficiency')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be between 0 and 100'),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string')
];

// Public routes
router.get('/', getSkills);
router.get('/grouped', getSkillsByCategory);
router.get('/:id', getSkill);

// Protected routes (Admin only)
router.post('/', protectAdmin, skillValidation, validate, createSkill);
router.put('/:id', protectAdmin, updateSkill);
router.delete('/:id', protectAdmin, deleteSkill);

module.exports = router;
