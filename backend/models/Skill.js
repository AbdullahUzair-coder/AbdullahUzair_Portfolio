const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'other'],
    default: 'other'
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  icon: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
