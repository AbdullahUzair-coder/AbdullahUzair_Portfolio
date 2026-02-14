const Admin = require('../models/Admin');

// @desc    Register new admin
// @route   POST /api/admin/auth/register
// @access  Private (Only existing admin can create new admin)
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email and password'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: 'Admin already exists with this email'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password
    });

    // Generate token
    const token = admin.generateToken();

    // Set secure cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict' // CSRF protection
    };

    res.status(201)
      .cookie('adminToken', token, cookieOptions)
      .json({
        status: 'success',
        message: 'Admin registered successfully',
        data: {
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email
          },
          token
        }
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/admin/auth/login
// @access  Public
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Get admin with password
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = admin.generateToken();

    // Set secure cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('adminToken', token, cookieOptions)
      .json({
        status: 'success',
        message: 'Login successful',
        data: {
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email
          },
          token
        }
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/admin/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          createdAt: admin.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin
// @route   POST /api/admin/auth/logout
// @access  Private
exports.logoutAdmin = async (req, res, next) => {
  try {
    // Clear cookie
    res.cookie('adminToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email.toLowerCase();

    // Check if email already exists
    if (email) {
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.admin.id }
      });
      
      if (existingAdmin) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin password
// @route   PUT /api/admin/auth/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current and new password'
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'New password must be at least 6 characters'
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    // Check current password
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Generate new token
    const token = admin.generateToken();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      data: { token }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify admin token
// @route   GET /api/admin/auth/verify
// @access  Private
exports.verifyToken = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      data: {
        admin: {
          id: req.admin.id,
          name: req.admin.name,
          email: req.admin.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
