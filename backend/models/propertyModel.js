const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    // Basic Property Information
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Commercial', 'Villa', 'Studio'],
        required: true
    },
    listingType: {
        type: String,
        enum: ['For Sale', 'For Rent', 'For Lease'],
        required: true
    },
    
    // Pricing
    pricing: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'NGN'
        },
        // For rentals
        rentPeriod: {
            type: String,
            enum: ['Monthly', 'Yearly', 'Weekly', 'Daily', null],
            default: null
        },
        // Price per square meter/foot
        pricePerUnit: Number,
        // Converted prices for common currencies
        convertedPrices: {
            USD: {
                amount: Number,
                lastUpdated: Date
            },
            EUR: {
                amount: Number,
                lastUpdated: Date
            },
            GBP: {
                amount: Number,
                lastUpdated: Date
            }
        }
    },
    
    // Location Details
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'Nigeria'
        },
        zipCode: String,
        neighborhood: String,
        // Geographic coordinates for map display
        coordinates: {
            latitude: {
                type: Number,
                required: false
            },
            longitude: {
                type: Number,
                required: false
            }
        }
    },
    
    // Property Specifications
    specifications: {
        bedrooms: {
            type: Number,
            min: 0
        },
        bathrooms: {
            type: Number,
            min: 0
        },
        area: {
            size: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                enum: ['sqft', 'sqm'],
                default: 'sqm'
            }
        },
        lotSize: {
            size: Number,
            unit: {
                type: String,
                enum: ['sqft', 'sqm', 'acres', 'hectares'],
                default: 'sqm'
            }
        },
        yearBuilt: Number,
        floors: Number,
        parkingSpaces: {
            type: Number,
            default: 0
        },
        furnished: {
            type: String,
            enum: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'],
            default: 'Unfurnished'
        }
    },
    
    // Amenities and Features
    amenities: [{
        type: String
    }],
    
    // Common amenities checklist
    features: {
        airConditioning: { type: Boolean, default: false },
        heating: { type: Boolean, default: false },
        pool: { type: Boolean, default: false },
        gym: { type: Boolean, default: false },
        garden: { type: Boolean, default: false },
        balcony: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
        security: { type: Boolean, default: false },
        fireplace: { type: Boolean, default: false },
        petFriendly: { type: Boolean, default: false },
        wheelchairAccessible: { type: Boolean, default: false }
    },
    
    // Media
    images: [{
        url: String,
        publicId: String, // For Cloudinary
        caption: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    virtualTourUrl: String,
    videoUrl: String,
    
    // Agent/Seller Information
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentInfo: {
        name: String,
        email: String,
        phone: String,
        role: String
    },
    
    // Company reference
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Property Status
    status: {
        type: String,
        enum: ['Available', 'Pending', 'Sold', 'Rented', 'Off Market'],
        default: 'Available'
    },
    
    // Visibility
    isPublished: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Social features (inherited from product model)
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    
    reviews: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        review: { 
            type: String, 
            required: true 
        },
        rating: { 
            type: Number, 
            min: 1, 
            max: 5, 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        likes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]
    }],
    
    socialShares: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        platform: { 
            type: String, 
            enum: ['facebook', 'twitter', 'whatsapp', 'linkedin', 'instagram'] 
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }],
    
    // Analytics
    views: {
        type: Number,
        default: 0
    },
    inquiries: {
        type: Number,
        default: 0
    },
    
    // Additional Details
    category: {
        type: String,
        default: 'Real Estate'
    },
    
    // For compatibility with existing routes
    productName: {
        type: String
    },
    productImage: [String],
    
    // Upload tracking
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedByInfo: {
        name: String,
        email: String,
        role: String
    }
    
}, {
    timestamps: true
});

// Indexes for search and filtering
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ propertyType: 1, listingType: 1 });
propertySchema.index({ 'pricing.amount': 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

// Virtual for compatibility with product routes
propertySchema.virtual('brandName').get(function() {
    return this.location?.neighborhood || this.location?.city || 'Property';
});

// Pre-save middleware to sync productName with title
propertySchema.pre('save', function(next) {
    if (this.title && !this.productName) {
        this.productName = this.title;
    }
    
    // Sync agent info
    if (this.agent && !this.agentInfo?.name) {
        // Will need to populate agent separately in controller
    }
    
    // Update uploaded by info
    if (this.uploadedBy && !this.uploadedByInfo?.name) {
        // Will need to populate in controller
    }
    
    next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
