const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { ResponseHandler, catchAsync } = require('../utils/responseHandler');
const { AuthenticationError, ValidationError } = require('../utils/errors');
const { validateUserLogin, handleValidationErrors } = require('../middleware/validation');

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const bootstrapAdminIfNeeded = async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const configuredEmail = normalizeEmail(process.env.DEFAULT_ADMIN_EMAIL || 'admin@test.com');
    const configuredPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    if (normalizedEmail !== configuredEmail) {
        return null;
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        return existingUser;
    }

    const totalUsers = await User.countDocuments({});
    if (totalUsers > 0) {
        return null;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || configuredPassword, salt);

    return User.create({
        name: 'System Admin',
        email: normalizedEmail,
        password: hashedPassword,
        role: 'ADMIN'
    });
};

const userSignInController = catchAsync(async (req, res) => {
    // Run validation
    await Promise.all(validateUserLogin.map(validation => validation.run(req)));
    
    // Handle validation errors
    const validationResult = handleValidationErrors(req, res);
    if (validationResult) return validationResult;

    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Find user in database using a case-insensitive email match
    const user = await User.findOne({
        email: { $regex: `^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });

    let authenticatedUser = user;
    if (!authenticatedUser) {
        authenticatedUser = await bootstrapAdminIfNeeded(normalizedEmail, password);
    }
    
    if (!authenticatedUser) {
        console.log('❌ User not found for email:', normalizedEmail);
        throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, authenticatedUser.password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT token
    const tokenData = {
        _id: authenticatedUser._id,
        email: authenticatedUser.email,
    };
    
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

    // Set secure cookie with proper production settings
    const isProduction = process.env.NODE_ENV === 'production';
    const tokenOptions = {
        httpOnly: true,
        secure: isProduction, // Use secure cookies in production (HTTPS)
        sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production, 'lax' for localhost
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
    };

    res.cookie("token", token, tokenOptions);

    // Return success response without sensitive data
    return ResponseHandler.success(res, {
        user: {
            _id: authenticatedUser._id,
            name: authenticatedUser.name,
            email: authenticatedUser.email,
            profilePic: authenticatedUser.profilePic,
            role: authenticatedUser.role
        }
    }, 'Login successful');
});

module.exports = userSignInController;