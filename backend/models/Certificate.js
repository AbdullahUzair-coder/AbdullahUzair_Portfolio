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
  date: {
    type: Date,
    required: [true, 'Please provide the issue date']
  },
  link: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
