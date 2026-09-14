const Category = require('../models/categoryModel');
const User = require('../models/userModel');

// Categories that must exist in every environment. Missing ones are inserted on startup;
// existing ones (including ones an admin deactivated) are never changed.
const REQUIRED_CATEGORIES = [
    { name: 'fully-detached-terrace', displayName: 'Fully Detached Terrace' },
    { name: 'semi-detached-terrace', displayName: 'Semi-Detached Terrace' },
    { name: 'fully-detached-duplex', displayName: 'Fully Detached Duplex' },
    { name: 'semi-detached-duplex', displayName: 'Semi-Detached Duplex' }
];

async function ensureRequiredCategories() {
    try {
        const missing = [];
        for (const category of REQUIRED_CATEGORIES) {
            if (!(await Category.exists({ name: category.name }))) missing.push(category);
        }
        if (missing.length === 0) return;

        // createdBy is required on categories
        const admin = await User.findOne({ role: 'ADMIN' }).select('_id');
        if (!admin) return;

        const lastCategory = await Category.findOne().sort({ order: -1 }).select('order');
        let order = lastCategory ? lastCategory.order : 0;

        await Category.insertMany(missing.map(category => ({
            ...category,
            order: ++order,
            isActive: true,
            createdBy: admin._id
        })));
        console.log(`✅ Added categories: ${missing.map(c => c.displayName).join(', ')}`);
    } catch (error) {
        console.log('⚠️  Could not ensure required categories:', error.message);
    }
}

module.exports = { ensureRequiredCategories, REQUIRED_CATEGORIES };
