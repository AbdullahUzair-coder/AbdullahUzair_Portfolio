const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file buffer (from multer memory storage) to Cloudinary.
 * @param {Buffer} buffer - The file buffer.
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder to store the file in.
 * @param {'image'|'raw'|'auto'} [options.resourceType='auto'] - Use 'raw' for PDF/DOC, 'image' for images.
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadToCloudinary = (buffer, { folder = 'portfolio', resourceType = 'auto' } = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete a previously uploaded file from Cloudinary by its public_id.
 * Safe to call with a falsy id (no-op).
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
