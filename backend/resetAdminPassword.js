const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin schema (simplified)
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const Admin = mongoose.model('Admin', adminSchema);

async function resetPassword() {
  try {
    // Find the admin by email
    const email = 'abdullahozair000@gmail.com';
    const newPassword = 'admin123';  // This is the new password
    
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      process.exit(1);
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the password
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('✅ Password reset successful!');
    console.log('');
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', newPassword);
    console.log('');
    console.log('You can now login at: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPassword();
