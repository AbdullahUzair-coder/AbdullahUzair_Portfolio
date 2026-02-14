const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuth');

// All routes are protected and require admin authentication
router.use(protectAdmin);

// Routes
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
