const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    // Property inquiry is about
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    
    // Inquirer information
    inquirer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guests to inquire
    },
    
    // Guest inquirer details (if not registered)
    guestInfo: {
        name: {
            type: String,
            required: function() {
                return !this.inquirer;
            }
        },
        email: {
            type: String,
            required: function() {
                return !this.inquirer;
            }
        },
        phone: String
    },
    
    // Inquiry details
    inquiryType: {
        type: String,
        enum: [
            'General Information',
            'Price Inquiry',
            'Schedule Viewing',
            'Financing Options',
            'Property Details',
            'Negotiation',
            'Other'
        ],
        default: 'General Information'
    },
    
    subject: {
        type: String,
        required: true,
        trim: true
    },
    
    message: {
        type: String,
        required: true
    },
    
    // Preferred contact method
    preferredContact: {
        type: String,
        enum: ['Email', 'Phone', 'WhatsApp', 'Any'],
        default: 'Email'
    },
    
    // Best time to contact
    bestTimeToContact: String,
    
    // Budget (for price negotiations)
    proposedBudget: {
        amount: Number,
        currency: {
            type: String,
            default: 'NGN'
        }
    },
    
    // Financing inquiry
    needsFinancing: {
        type: Boolean,
        default: false
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['New', 'In Progress', 'Replied', 'Resolved', 'Closed'],
        default: 'New'
    },
    
    // Priority
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    
    // Agent/Staff handling the inquiry
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedAt: Date,
    
    // Response tracking
    responses: [{
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        respondedByInfo: {
            name: String,
            email: String,
            role: String
        },
        message: {
            type: String,
            required: true
        },
        responseDate: {
            type: Date,
            default: Date.now
        },
        attachments: [{
            url: String,
            filename: String
        }]
    }],
    
    // First response time (SLA tracking)
    firstResponseAt: Date,
    
    // Resolution
    resolvedAt: Date,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolutionNotes: String,
    
    // Follow-up
    followUpRequired: {
        type: Boolean,
        default: false
    },
    followUpDate: Date,
    followUpNotes: String,
    
    // Tags for categorization
    tags: [String],
    
    // Internal notes (not visible to inquirer)
    internalNotes: String,
    
    // Source of inquiry
    source: {
        type: String,
        enum: ['Website', 'Mobile App', 'Phone', 'Email', 'Social Media', 'Walk-in', 'Other'],
        default: 'Website'
    },
    
    // Related appointment (if one was scheduled)
    relatedAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    
    // IP address for spam prevention
    ipAddress: String,
    
    // Mark as spam
    isSpam: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
});

// Indexes
inquirySchema.index({ property: 1, status: 1 });
inquirySchema.index({ inquirer: 1, status: 1 });
inquirySchema.index({ assignedTo: 1, status: 1 });
inquirySchema.index({ status: 1, priority: 1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ 'guestInfo.email': 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
