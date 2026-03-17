// Standalone admin user creation for Adoo Real Estate
require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Simple User Schema - just what we need
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['GENERAL', 'ADMIN', 'STAFF'],
        default: 'GENERAL'
    },
    profilePic: String
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env file');
            process.exit(1);
        }
        
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB Atlas');
        
        const adminEmail = 'alpho4luv@gmail.com';
        const adminPassword = 'admin123';
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('\n⚠️  Admin user already exists!');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Name:', existingAdmin.name);
            console.log('🔑 Role:', existingAdmin.role);
            
            // Update password and ensure ADMIN role
            const salt = bcryptjs.genSaltSync(10);
            const hashPassword = bcryptjs.hashSync(adminPassword, salt);
            existingAdmin.password = hashPassword;
            existingAdmin.role = 'ADMIN';
            await existingAdmin.save();
            console.log('\n✅ Admin password updated and role confirmed!');
            console.log('🔐 New Password: admin123');
        } else {
            // Create new admin user
            const salt = bcryptjs.genSaltSync(10);
            const hashPassword = bcryptjs.hashSync(adminPassword, salt);
            
            const newAdmin = new User({
                name: 'Alpho4Luv Admin',
                email: adminEmail,
                password: hashPassword,
                role: 'ADMIN'
            });
            
            await newAdmin.save();
            console.log('\n✅ Admin user created successfully!');
            console.log('📧 Email:', adminEmail);
            console.log('🔐 Password:', adminPassword);
            console.log('🔑 Role: ADMIN');
        }
        
        console.log('\n👋 Disconnecting from MongoDB...');
        await mongoose.disconnect();
        console.log('✅ Done!\n');
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

createAdminUser();
