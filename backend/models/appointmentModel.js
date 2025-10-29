const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Property being viewed
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    
    // Client information
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientInfo: {
        name: String,
        email: String,
        phone: String
    },
    
    // Agent handling the appointment
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Appointment details
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 60, // minutes
        min: 15
    },
    
    // Type of viewing
    viewingType: {
        type: String,
        enum: ['In-Person', 'Virtual', 'Video Call'],
        default: 'In-Person'
    },
    
    // Meeting location/link
    meetingLocation: String,
    virtualMeetingLink: String,
    
    // Additional information
    notes: String,
    specialRequests: String,
    numberOfAttendees: {
        type: Number,
        default: 1,
        min: 1
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'],
        default: 'Pending'
    },
    
    // Confirmation
    confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    confirmedAt: Date,
    
    // Cancellation
    cancellationReason: String,
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cancelledAt: Date,
    
    // Rescheduling history
    rescheduledFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    rescheduledTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    
    // Reminders sent
    remindersSent: [{
        type: {
            type: String,
            enum: ['Email', 'SMS', 'WhatsApp']
        },
        sentAt: Date
    }],
    
    // Feedback after viewing
    feedback: {
        clientRating: {
            type: Number,
            min: 1,
            max: 5
        },
        clientComments: String,
        agentNotes: String,
        interest: {
            type: String,
            enum: ['Very Interested', 'Interested', 'Maybe', 'Not Interested'],
            default: null
        }
    }
    
}, {
    timestamps: true
});

// Indexes
appointmentSchema.index({ property: 1, appointmentDate: 1 });
appointmentSchema.index({ client: 1, status: 1 });
appointmentSchema.index({ agent: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
