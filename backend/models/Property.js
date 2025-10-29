const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  title: {
    type: String,
    maxLength: 100
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxLength: 200
    },
    cloudinaryId: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    notHelpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  reported: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const propertySchema = new mongoose.Schema({
  // Basic Property Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  listingType: {
    type: String,
    enum: ['For Sale', 'For Rent', 'Short Let', 'Lease'],
    default: 'For Sale'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    enum: ['NGN', 'USD', 'GBP', 'EUR', 'ZAR', 'CAD'],
    default: 'NGN'
  },
  category: {
    type: String,
    required: true
  },
  
  // Location Details
  location: {
    country: {
      type: String,
      required: true
    },
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
    lga: {
      type: String
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  
  // Residential-specific fields
  residential: {
    bedrooms: {
      type: Number,
      min: 0
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    toilets: {
      type: Number,
      min: 0
    },
    parking: {
      type: Number,
      min: 0
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Unfurnished', 'Partly Furnished']
    },
    condition: {
      type: String,
      enum: ['Newly Built', 'Renovated', 'Old']
    },
    size: {
      type: String
    },
    amenities: [{
      type: String
    }]
  },
  
  // Land-specific fields
  land: {
    landSize: {
      type: String
    },
    landType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Agricultural']
    },
    topography: {
      type: String,
      enum: ['Flat', 'Sloppy', 'Rocky']
    },
    fencing: {
      type: Boolean,
      default: false
    },
    accessibility: {
      type: String
    },
    documents: [{
      type: String
    }]
  },
  
  // Commercial-specific fields
  commercial: {
    propertyType: {
      type: String,
      enum: ['Office', 'Shop', 'Warehouse', 'Event Center', 'Hotel']
    },
    totalArea: {
      type: String
    },
    floors: {
      type: Number,
      min: 0
    },
    parking: {
      type: Number,
      min: 0
    },
    facilities: [{
      type: String
    }],
    accessibility: {
      type: String
    },
    condition: {
      type: String
    }
  },
  
  // Short Let-specific fields
  shortLet: {
    pricePerNight: {
      type: Number,
      min: 0
    },
    pricePerWeek: {
      type: Number,
      min: 0
    },
    bedrooms: {
      type: Number,
      min: 0
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    amenities: [{
      type: String
    }],
    checkInTime: {
      type: String
    },
    checkOutTime: {
      type: String
    }
  },
  
  // Agricultural-specific fields
  agricultural: {
    landSize: {
      type: String
    },
    soilType: {
      type: String,
      enum: ['Loamy', 'Clay', 'Sandy']
    },
    waterSource: {
      type: String
    },
    accessibility: {
      type: String
    },
    documents: [{
      type: String
    }]
  },
  
  // Agent Information
  agent: {
    name: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    agency: {
      type: String
    }
  },
  
  // Seller/Owner
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Reviews
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  
  // Status & Metadata
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Sold', 'Archived'],
    default: 'Active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [{
    type: String
  }],
  
  // SEO
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
propertySchema.index({ category: 1, status: 1 });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ rating: -1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ isFeatured: -1, createdAt: -1 });
propertySchema.index({ seller: 1 });
propertySchema.index({ slug: 1 });

// Text index for search
propertySchema.index({ 
  name: 'text', 
  description: 'text', 
  'location.address': 'text',
  'location.city': 'text',
  'location.state': 'text'
});

// Pre-save middleware to update timestamps
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state}, ${this.location.country}`;
});

// Method to calculate average rating
propertySchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

// Method to generate slug from name
propertySchema.methods.generateSlug = function() {
  const baseSlug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  this.slug = `${baseSlug}-${this._id.toString().slice(-6)}`;
};

module.exports = mongoose.model('Property', propertySchema);
