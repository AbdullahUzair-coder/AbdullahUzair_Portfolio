const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createFirstAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('\n✅ Connected to MongoDB');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 CREATE FIRST ADMIN ACCOUNT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('⚠️  An admin account already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Created: ${existingAdmin.createdAt}\n`);
      
      const confirm = await question('Do you want to create another admin? (yes/no): ');
      if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        console.log('\n❌ Admin creation cancelled.\n');
        process.exit(0);
      }
      console.log('');
    }

    // Get admin details
    const name = await question('Enter admin name: ');
    if (!name || name.trim() === '') {
      console.log('\n❌ Name is required.\n');
      process.exit(1);
    }

    const email = await question('Enter admin email: ');
    if (!email || email.trim() === '') {
      console.log('\n❌ Email is required.\n');
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('\n❌ Please provide a valid email.\n');
      process.exit(1);
    }

    // Check if email already exists
    const emailExists = await Admin.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      console.log('\n❌ An admin with this email already exists.\n');
      process.exit(1);
    }

    const password = await question('Enter admin password (min 6 characters): ');
    if (!password || password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long.\n');
      process.exit(1);
    }

    const confirmPassword = await question('Confirm password: ');
    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match.\n');
      process.exit(1);
    }

    // Create admin
    const admin = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ADMIN CREATED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📋 Admin Details:`);
    console.log(`   ID: ${admin._id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Created: ${admin.createdAt}`);
    console.log('\n🔐 You can now login with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n❌ Process interrupted.\n');
  process.exit(0);
});

// Run the script
createFirstAdmin();
