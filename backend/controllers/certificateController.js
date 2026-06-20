const Certificate = require('../models/Certificate');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Upload any provided image/pdf files to Cloudinary and merge their URLs/public_ids
// into the given data object.
const applyUploads = async (files, data) => {
  if (!files) return;
  if (files.image) {
    const result = await uploadToCloudinary(files.image[0].buffer, {
      folder: 'portfolio/certificates',
      resourceType: 'image'
    });
    data.image = result.secure_url;
    data.imagePublicId = result.public_id;
  }
  if (files.pdf) {
    const result = await uploadToCloudinary(files.pdf[0].buffer, {
      folder: 'portfolio/certificates',
      resourceType: 'raw'
    });
    data.pdfUrl = result.secure_url;
    data.pdfPublicId = result.public_id;
  }
};

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
    await applyUploads(req.files, certificateData);

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

    const existing = await Certificate.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    // Handle file uploads
    await applyUploads(req.files, certificateData);

    // Delete old Cloudinary assets that are being replaced
    if (certificateData.imagePublicId) {
      await deleteFromCloudinary(existing.imagePublicId, 'image');
    }
    if (certificateData.pdfPublicId) {
      await deleteFromCloudinary(existing.pdfPublicId, 'raw');
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

    // Delete associated Cloudinary assets if they exist
    await deleteFromCloudinary(certificate.imagePublicId, 'image');
    await deleteFromCloudinary(certificate.pdfPublicId, 'raw');

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
