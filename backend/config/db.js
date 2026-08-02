const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const User = require('../models/userModel');

async function ensureDefaultAdmin() {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@test.com';
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            logger.info('Default admin already exists', { email: adminEmail });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN'
        });

        logger.info('Created default admin user', { email: adminEmail });
    } catch (error) {
        logger.error('Failed to create default admin user', { error: error.message });
    }
}

async function connectDB() {
    try {
        const startTime = Date.now();
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adoor_real_estate';

        if (!process.env.MONGODB_URI) {
            logger.warn('MONGODB_URI not set, using local fallback', { uri: mongoUri });
        }
        
        // Configure mongoose options for MongoDB Atlas with proper timeouts
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: true, // Enable mongoose buffering to handle commands before connection
            connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
            retryWrites: true, // Enable retryable writes
            w: 'majority' // Write concern
        };

        await mongoose.connect(mongoUri, options);
        
        const connectionTime = Date.now() - startTime;
        logger.info('MongoDB connected successfully', { connectionTime });

        await ensureDefaultAdmin();
        
        // Log database events
        mongoose.connection.on('connected', () => {
            logger.info('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('Mongoose connection error', { error: err.message });
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose disconnected from MongoDB');
        });

        // Log slow queries in development
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                logger.debug('MongoDB Query', {
                    collection: collectionName,
                    method,
                    query,
                    doc
                });
            });
        }

        return true;
    } catch (err) {
        logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
        console.log('Continuing without database connection...');
        return false;
    }    
}

module.exports = connectDB