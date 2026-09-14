const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/categoryModel');

// Connect to MongoDB and seed categories
const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
        
        // Check if categories already exist
        const existingCount = await Category.countDocuments({ isActive: true });
        console.log(`📊 Existing categories: ${existingCount}`);
        
        if (existingCount === 0) {
            console.log('🌱 Seeding default categories...');
            
            const defaultCategories = [
                'houses', 'apartments', 'villas', 'condos', 'land', 'commercial', 
                'townhouses', 'duplexes', 'penthouses', 'studios', 'bungalow', 
                'mansion', 'short-let', 'agricultural', 'farm',
                'fully-detached-terrace', 'semi-detached-terrace'
            ];

            // Create admin user ID (you can replace this with actual admin ID)
            const adminUserId = new mongoose.Types.ObjectId();

            const categoriesToInsert = defaultCategories.map((categoryName, index) => ({
                name: categoryName,
                displayName: formatCategoryName(categoryName),
                order: index + 1,
                isActive: true,
                isDefault: true,
                createdBy: adminUserId
            }));

            const result = await Category.insertMany(categoriesToInsert);
            console.log(`✅ Successfully created ${result.length} categories`);
            
            // Display the categories
            console.log('\n📂 Categories created:');
            result.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.displayName} (${cat.name})`);
            });
        } else {
            console.log('📂 Categories already exist, displaying current ones:');
            const categories = await Category.find({ isActive: true }).sort({ order: 1 });
            categories.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.displayName} (${cat.name}) - Order: ${cat.order}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
    } finally {
        mongoose.disconnect();
        console.log('📤 Database connection closed');
    }
};

function formatCategoryName(name) {
    return name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

seedCategories();