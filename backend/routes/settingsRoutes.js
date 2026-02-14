const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const {
  getSettings,
  updateSettings,
  updateExperience,
  uploadProfileImage,
  uploadCV
} = require('../controllers/settingsController');

// Public routes
router.get('/', getSettings);

// Protected routes (admin only)
router.put('/', protectAdmin, updateSettings);
router.put('/experience', protectAdmin, updateExperience);
router.post('/profile-image', protectAdmin, upload.single('profileImage'), uploadProfileImage);
router.post('/cv', protectAdmin, upload.single('cv'), uploadCV);

module.exports = router;
