const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a certificate title'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'Please provide the issuer name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide the issue date']
  },
  credentialId: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['coursera', 'udemy', 'linkedin', 'google', 'microsoft', 'aws', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
