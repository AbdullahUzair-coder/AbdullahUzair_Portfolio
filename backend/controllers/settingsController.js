const Settings = require('../models/Settings');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get portfolio settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      status: 'success',
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    }
    
    res.status(200).json({
      status: 'success',
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update experience/timeline
// @route   PUT /api/settings/experience
// @access  Private/Admin
exports.updateExperience = async (req, res, next) => {
  try {
    const { experience } = req.body;
    
    let settings = await Settings.getSettings();
    settings.experience = experience;
    await settings.save();
    
    res.status(200).json({
      status: 'success',
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile image
// @route   POST /api/settings/profile-image
// @access  Private/Admin
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image file'
      });
    }

    let settings = await Settings.getSettings();

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'portfolio/profile',
      resourceType: 'image'
    });

    // Delete old profile image from Cloudinary if exists
    await deleteFromCloudinary(settings.profileImagePublicId, 'image');

    // Update with new image URL
    settings.profileImage = result.secure_url;
    settings.profileImagePublicId = result.public_id;
    await settings.save();

    res.status(200).json({
      status: 'success',
      data: {
        settings,
        imageUrl: settings.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload CV/Resume
// @route   POST /api/settings/cv
// @access  Private/Admin
exports.uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a PDF file'
      });
    }

    let settings = await Settings.getSettings();

    // Upload new CV to Cloudinary (raw resource type for PDF/DOC files)
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'portfolio/cv',
      resourceType: 'raw'
    });

    // Delete old CV from Cloudinary if exists
    await deleteFromCloudinary(settings.cvPublicId, 'raw');

    // Update with new CV URL
    settings.cvUrl = result.secure_url;
    settings.cvPublicId = result.public_id;
    await settings.save();

    res.status(200).json({
      status: 'success',
      data: {
        settings,
        cvUrl: settings.cvUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

