const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Contact = require('../models/Contact');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({ isPublished: true });
    const totalSkills = await Skill.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ isRead: false });
    const totalUsers = await User.countDocuments();

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get popular projects
    const popularProjects = await Project.find({ isPublished: true })
      .sort({ views: -1, likes: -1 })
      .limit(5);

    // Get project views total
    const projectViewsResult = await Project.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = projectViewsResult.length > 0 ? projectViewsResult[0].totalViews : 0;

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalProjects,
          publishedProjects,
          totalSkills,
          totalContacts,
          unreadContacts,
          totalUsers,
          totalViews
        },
        recentContacts,
        popularProjects
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      status: 'success',
      count: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
