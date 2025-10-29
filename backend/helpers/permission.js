const User = require('../models/userModel');

/**
 * Check if user has permission to upload/manage products/properties
 * @param {String} userId - User ID to check permissions for
 * @returns {Promise<Boolean>} - True if user has permission, false otherwise
 */
async function uploadProductPermission(userId) {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return false;
        }

        // Admin users always have permission
        if (user.role === 'ADMIN') {
            return true;
        }

        // Staff users need explicit permission
        if (user.role === 'STAFF' && user.permissions?.canUploadProducts) {
            return true;
        }

        // General users don't have upload permission
        return false;
    } catch (error) {
        console.error('Error checking upload permission:', error);
        return false;
    }
}

module.exports = uploadProductPermission;
