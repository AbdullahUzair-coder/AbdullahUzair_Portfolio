const Settings = require('../models/Settings');
const fs = require('fs');
const path = require('path');

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
    
    // Delete old profile image if exists
    if (settings.profileImage) {
      const oldImagePath = path.join(__dirname, '..', 'public', settings.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update with new image path
    settings.profileImage = `/uploads/${req.file.filename}`;
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
    
    // Delete old CV if exists
    if (settings.cvUrl) {
      const oldCvPath = path.join(__dirname, '..', 'public', settings.cvUrl);
      if (fs.existsSync(oldCvPath)) {
        fs.unlinkSync(oldCvPath);
      }
    }

    // Update with new CV path
    settings.cvUrl = `/uploads/${req.file.filename}`;
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

