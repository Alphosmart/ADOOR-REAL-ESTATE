const Appointment = require('../models/appointmentModel');
const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const logger = require('../utils/logger');

// Create appointment (guest or authenticated - no login required)
const createAppointment = async (req, res) => {
    try {
        const sessionUser = req.userId; // Will be undefined for guests

        const { property, appointmentDate, appointmentTime, viewingType, notes, numberOfAttendees, guestInfo } = req.body;

        // Verify property exists
        const propertyExists = await Property.findById(property);
        if (!propertyExists) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        let clientInfo;

        if (sessionUser) {
            // Get client info from user account (admin/staff)
            const client = await User.findById(sessionUser);
            clientInfo = {
                name: client.name,
                email: client.email,
                phone: client.phone
            };
        } else if (guestInfo) {
            // Use guest provided info
            clientInfo = guestInfo;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide your contact information'
            });
        }

        const appointment = new Appointment({
            property,
            client: sessionUser || null, // null for guests
            clientInfo,
            agent: propertyExists.agent,
            appointmentDate,
            appointmentTime,
            viewingType: viewingType || 'In-Person',
            notes,
            numberOfAttendees: numberOfAttendees || 1,
            status: 'Pending'
        });

        const savedAppointment = await appointment.save();

        // Populate references for response
        await savedAppointment.populate('property', 'title location images');
        if (savedAppointment.agent) {
            await savedAppointment.populate('agent', 'name email phone');
        }

        res.status(201).json({
            success: true,
            message: 'Appointment scheduled successfully. We will contact you to confirm.',
            data: savedAppointment
        });
    } catch (error) {
        logger.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to schedule appointment'
        });
    }
};

// Get user's appointments
const getUserAppointments = async (req, res) => {
    try {
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const { status, upcoming } = req.query;

        const filter = { client: sessionUser };
        if (status) filter.status = status;
        if (upcoming === 'true') {
            filter.appointmentDate = { $gte: new Date() };
        }

        const appointments = await Appointment.find(filter)
            .sort({ appointmentDate: 1 })
            .populate('property', 'title location images pricing')
            .populate('agent', 'name email phone profilePic');

        res.json({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments
        });
    } catch (error) {
        logger.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch appointments'
        });
    }
};

// Get agent's appointments
const getAgentAppointments = async (req, res) => {
    try {
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const { status, date } = req.query;

        const filter = { agent: sessionUser };
        if (status) filter.status = status;
        if (date) {
            const queryDate = new Date(date);
            filter.appointmentDate = {
                $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
                $lt: new Date(queryDate.setHours(23, 59, 59, 999))
            };
        }

        const appointments = await Appointment.find(filter)
            .sort({ appointmentDate: 1, appointmentTime: 1 })
            .populate('property', 'title location images')
            .populate('client', 'name email phone');

        res.json({
            success: true,
            message: 'Agent appointments fetched successfully',
            data: appointments
        });
    } catch (error) {
        logger.error('Get agent appointments error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch appointments'
        });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, cancellationReason, feedback } = req.body;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check permission
        if (appointment.client.toString() !== sessionUser && appointment.agent.toString() !== sessionUser) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        const updateData = { status };

        if (status === 'Confirmed') {
            updateData.confirmedBy = sessionUser;
            updateData.confirmedAt = new Date();
        }

        if (status === 'Cancelled') {
            updateData.cancelledBy = sessionUser;
            updateData.cancelledAt = new Date();
            if (cancellationReason) updateData.cancellationReason = cancellationReason;
        }

        if (feedback) {
            updateData.feedback = feedback;
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            updateData,
            { new: true }
        ).populate('property', 'title location')
         .populate('client', 'name email phone')
         .populate('agent', 'name email phone');

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: updatedAppointment
        });
    } catch (error) {
        logger.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update appointment'
        });
    }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { appointmentDate, appointmentTime } = req.body;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check permission
        if (appointment.client.toString() !== sessionUser && appointment.agent.toString() !== sessionUser) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        // Create new appointment with new date/time
        const newAppointment = new Appointment({
            ...appointment.toObject(),
            _id: undefined,
            appointmentDate,
            appointmentTime,
            status: 'Pending',
            rescheduledFrom: appointmentId,
            createdAt: undefined,
            updatedAt: undefined
        });

        const savedAppointment = await newAppointment.save();

        // Update old appointment
        appointment.status = 'Rescheduled';
        appointment.rescheduledTo = savedAppointment._id;
        await appointment.save();

        await savedAppointment.populate('property', 'title location images');
        await savedAppointment.populate('agent', 'name email phone');

        res.json({
            success: true,
            message: 'Appointment rescheduled successfully',
            data: savedAppointment
        });
    } catch (error) {
        logger.error('Reschedule appointment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reschedule appointment'
        });
    }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    getAgentAppointments,
    updateAppointmentStatus,
    rescheduleAppointment
};
