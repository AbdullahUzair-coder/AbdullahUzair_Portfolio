const Certificate = require('../models/Certificate');
const path = require('path');
const fs = require('fs');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
exports.getCertificates = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    
    let query = {};
    
    // If 'all' param is not set, only show active certificates (for public)
    if (!all) {
      query.isActive = true;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const certificates = await Certificate.find(query)
      .sort({ date: -1 });

    res.status(200).json({
      status: 'success',
      results: certificates.length,
      data: { certificates }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
exports.getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private/Admin
exports.createCertificate = async (req, res, next) => {
  try {
    const certificateData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        certificateData.image = '/uploads/' + req.files.image[0].filename;
      }
      if (req.files.pdf) {
        certificateData.pdfUrl = '/uploads/' + req.files.pdf[0].filename;
      }
    }

    const certificate = await Certificate.create(certificateData);

    res.status(201).json({
      status: 'success',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
exports.updateCertificate = async (req, res, next) => {
  try {
    const certificateData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        certificateData.image = '/uploads/' + req.files.image[0].filename;
      }
      if (req.files.pdf) {
        certificateData.pdfUrl = '/uploads/' + req.files.pdf[0].filename;
      }
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      certificateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    // Delete associated files if they exist
    if (certificate.image) {
      const imagePath = path.join(__dirname, '../public', certificate.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    if (certificate.pdfUrl) {
      const pdfPath = path.join(__dirname, '../public', certificate.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificates grouped by category
// @route   GET /api/certificates/grouped
// @access  Public
exports.getCertificatesByCategory = async (req, res, next) => {
  try {
    const certificates = await Certificate.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          certificates: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { certificates }
    });
  } catch (error) {
    next(error);
  }
};
