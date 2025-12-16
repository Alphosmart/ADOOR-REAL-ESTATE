const Inquiry = require('../models/inquiryModel');
const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const logger = require('../utils/logger');

// Submit inquiry (guest or authenticated - no login required)
const submitInquiry = async (req, res) => {
    try {
        const sessionUser = req.userId; // Will be undefined for guests
        const { property, subject, message, inquiryType, guestInfo, preferredContact, proposedBudget, needsFinancing } = req.body;

        // Verify property exists
        const propertyExists = await Property.findById(property);
        if (!propertyExists) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        const inquiryData = {
            property,
            subject,
            message,
            inquiryType: inquiryType || 'General Information',
            preferredContact: preferredContact || 'Email',
            needsFinancing: needsFinancing || false,
            source: 'Website',
            ipAddress: req.ip
        };

        // For guests, require guestInfo
        if (!sessionUser && !guestInfo) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your contact information'
            });
        }

        // Set inquirer data based on authentication status
        if (sessionUser) {
            inquiryData.inquirer = sessionUser;
        } else {
            inquiryData.guestInfo = guestInfo;
        }

        if (proposedBudget) {
            inquiryData.proposedBudget = proposedBudget;
        }

        const inquiry = new Inquiry(inquiryData);
        const savedInquiry = await inquiry.save();

        // Update property inquiry count
        propertyExists.inquiries = (propertyExists.inquiries || 0) + 1;
        await propertyExists.save();

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully. We will contact you shortly.',
            data: savedInquiry
        });
    } catch (error) {
        logger.error('Submit inquiry error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit inquiry'
        });
    }
};

// Get user's inquiries
const getUserInquiries = async (req, res) => {
    try {
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const { status } = req.query;

        const filter = { inquirer: sessionUser };
        if (status) filter.status = status;

        const inquiries = await Inquiry.find(filter)
            .sort({ createdAt: -1 })
            .populate('property', 'title location images pricing')
            .populate('assignedTo', 'name email phone')
            .populate('responses.respondedBy', 'name email');

        res.json({
            success: true,
            message: 'Inquiries fetched successfully',
            data: inquiries
        });
    } catch (error) {
        logger.error('Get inquiries error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch inquiries'
        });
    }
};

// Get all inquiries (admin/staff)
const getAllInquiries = async (req, res) => {
    try {
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        // Check if user is admin or staff
        const user = await User.findById(sessionUser);
        if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        const { status, priority, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const inquiries = await Inquiry.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('property', 'title location images pricing')
            .populate('inquirer', 'name email phone')
            .populate('assignedTo', 'name email');

        const total = await Inquiry.countDocuments(filter);

        res.json({
            success: true,
            message: 'Inquiries fetched successfully',
            data: inquiries,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Get all inquiries error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch inquiries'
        });
    }
};

// Get single inquiry
const getInquiry = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const inquiry = await Inquiry.findById(inquiryId)
            .populate('property', 'title location images pricing')
            .populate('inquirer', 'name email phone')
            .populate('assignedTo', 'name email phone')
            .populate('responses.respondedBy', 'name email role');

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Check permission
        const user = await User.findById(sessionUser);
        const isOwner = inquiry.inquirer && inquiry.inquirer._id.toString() === sessionUser;
        const isStaff = user.role === 'ADMIN' || user.role === 'STAFF';

        if (!isOwner && !isStaff) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        res.json({
            success: true,
            message: 'Inquiry fetched successfully',
            data: inquiry
        });
    } catch (error) {
        logger.error('Get inquiry error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch inquiry'
        });
    }
};

// Respond to inquiry (admin/staff)
const respondToInquiry = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { message } = req.body;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const user = await User.findById(sessionUser);
        if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        const inquiry = await Inquiry.findById(inquiryId);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        const response = {
            respondedBy: sessionUser,
            respondedByInfo: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            message,
            responseDate: new Date()
        };

        inquiry.responses.push(response);

        // Update status
        if (inquiry.status === 'New') {
            inquiry.status = 'In Progress';
            inquiry.firstResponseAt = new Date();
        } else if (inquiry.status === 'In Progress') {
            inquiry.status = 'Replied';
        }

        // Assign to current user if not assigned
        if (!inquiry.assignedTo) {
            inquiry.assignedTo = sessionUser;
            inquiry.assignedAt = new Date();
        }

        await inquiry.save();

        await inquiry.populate('property', 'title location');
        await inquiry.populate('responses.respondedBy', 'name email');

        res.json({
            success: true,
            message: 'Response added successfully',
            data: inquiry
        });
    } catch (error) {
        logger.error('Respond to inquiry error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to respond to inquiry'
        });
    }
};

// Update inquiry status
const updateInquiryStatus = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { status, priority, assignedTo, resolutionNotes } = req.body;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }

        const user = await User.findById(sessionUser);
        if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        const inquiry = await Inquiry.findById(inquiryId);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (assignedTo) {
            updateData.assignedTo = assignedTo;
            updateData.assignedAt = new Date();
        }

        if (status === 'Resolved' || status === 'Closed') {
            updateData.resolvedAt = new Date();
            updateData.resolvedBy = sessionUser;
            if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
        }

        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            inquiryId,
            updateData,
            { new: true }
        ).populate('property', 'title location')
         .populate('inquirer', 'name email')
         .populate('assignedTo', 'name email');

        res.json({
            success: true,
            message: 'Inquiry updated successfully',
            data: updatedInquiry
        });
    } catch (error) {
        logger.error('Update inquiry error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update inquiry'
        });
    }
};

module.exports = {
    submitInquiry,
    getUserInquiries,
    getAllInquiries,
    getInquiry,
    respondToInquiry,
    updateInquiryStatus
};
