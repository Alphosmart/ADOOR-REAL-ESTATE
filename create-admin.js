// Quick admin user creation for Adoo Real Estate
require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const userModel = require('./backend/models/userModel');

async function createAdminUser() {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env file');
            process.exit(1);
        }
        
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        
        const adminEmail = 'alpho4luv@gmail.com';
        
        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            console.log('Name:', existingAdmin.name);
            
            // Update password if needed
            const salt = bcryptjs.genSaltSync(10);
            const hashPassword = bcryptjs.hashSync('admin123', salt);
            existingAdmin.password = hashPassword;
            existingAdmin.role = 'ADMIN';
            await existingAdmin.save();
            console.log('✅ Admin password updated successfully!');
            
            await mongoose.disconnect();
            return;
        }
        
        // Create new admin user
        const salt = bcryptjs.genSaltSync(10);
        const hashPassword = bcryptjs.hashSync('admin123', salt);
        
        const newAdmin = new userModel({
            name: 'Alpho4Luv Admin',
            email: adminEmail,
            password: hashPassword,
            role: 'ADMIN'
        });
        
        await newAdmin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password: admin123');
        console.log('Role: ADMIN');
        
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createAdminUser();
