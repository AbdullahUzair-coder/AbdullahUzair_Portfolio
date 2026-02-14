const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Personal Info
  name: {
    type: String,
    default: 'Abdullah Uzair'
  },
  title: {
    type: String,
    default: 'Full Stack Developer'
  },
  bio: {
    type: String,
    default: 'A passionate Full Stack Developer crafting beautiful and functional web applications.'
  },
  shortBio: {
    type: String,
    default: ''
  },
  
  // Contact Info
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  
  // Social Links
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  
  // Status
  availability: {
    type: Boolean,
    default: true
  },
  
  // Profile Image
  profileImage: {
    type: String,
    default: ''
  },
  
  // CV/Resume
  cvUrl: {
    type: String,
    default: ''
  },
  
  // Experience/Timeline
  experience: [{
    year: String,
    title: String,
    company: String,
    description: String
  }],
  
  // Hero section content
  heroTitle: {
    type: String,
    default: ''
  },
  heroSubtitle: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
