const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    // Link to User account
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Professional Information
    licenseNumber: {
        type: String,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        min: 0
    },
    specialization: [{
        type: String,
        enum: [
            'Residential Sales',
            'Commercial Sales', 
            'Luxury Properties',
            'Rentals',
            'Land',
            'Property Management',
            'Investment Properties',
            'First-Time Buyers'
        ]
    }],
    
    // Profile
    bio: {
        type: String,
        maxlength: 1000
    },
    profileImage: String,
    
    // Certifications & Awards
    certifications: [{
        name: String,
        issuedBy: String,
        dateIssued: Date,
        expiryDate: Date
    }],
    awards: [{
        title: String,
        year: Number,
        description: String
    }],
    
    // Contact Preferences
    contactInfo: {
        officePhone: String,
        mobilePhone: String,
        whatsapp: String,
        email: String,
        website: String,
        socialMedia: {
            linkedin: String,
            facebook: String,
            instagram: String,
            twitter: String
        }
    },
    
    // Service Areas
    serviceAreas: [{
        city: String,
        state: String,
        neighborhoods: [String]
    }],
    
    // Statistics
    stats: {
        totalListings: {
            type: Number,
            default: 0
        },
        activeListings: {
            type: Number,
            default: 0
        },
        soldProperties: {
            type: Number,
            default: 0
        },
        rentedProperties: {
            type: Number,
            default: 0
        },
        totalSalesValue: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    
    // Reviews from clients
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Availability
    availability: {
        isActive: {
            type: Boolean,
            default: true
        },
        workingHours: {
            monday: { start: String, end: String },
            tuesday: { start: String, end: String },
            wednesday: { start: String, end: String },
            thursday: { start: String, end: String },
            friday: { start: String, end: String },
            saturday: { start: String, end: String },
            sunday: { start: String, end: String }
        }
    },
    
    // Languages spoken
    languages: [{
        type: String,
        default: ['English']
    }],
    
    // Company/Brokerage
    brokerage: {
        name: String,
        address: String,
        phone: String,
        website: String
    },
    
    // Verification status
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: Date,
    
    // Account status
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    }
    
}, {
    timestamps: true
});

// Index for search
agentSchema.index({ 'userId': 1 });
agentSchema.index({ 'serviceAreas.city': 1, 'serviceAreas.state': 1 });
agentSchema.index({ specialization: 1 });
agentSchema.index({ 'stats.averageRating': -1 });

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
