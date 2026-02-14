const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide a role/position'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Please provide the duration'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
