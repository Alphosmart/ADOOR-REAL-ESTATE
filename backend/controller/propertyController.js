const Property = require('../models/propertyModel');
const uploadProductPermission = require('../helpers/permission');
const logger = require('../utils/logger');

// Get all properties (public endpoint)
const getPropertyController = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            propertyType,
            listingType,
            city,
            state,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            minArea,
            maxArea,
            status = 'Available',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search
        } = req.query;

        const skip = (page - 1) * limit;

        // Build filter
        const filter = { isPublished: true };
        
        if (propertyType) filter.propertyType = propertyType;
        if (listingType) filter.listingType = listingType;
        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (state) filter['location.state'] = new RegExp(state, 'i');
        if (status) filter.status = status;
        
        // Price range
        if (minPrice || maxPrice) {
            filter['pricing.amount'] = {};
            if (minPrice) filter['pricing.amount'].$gte = Number(minPrice);
            if (maxPrice) filter['pricing.amount'].$lte = Number(maxPrice);
        }
        
        // Bedrooms/bathrooms
        if (bedrooms) filter['specifications.bedrooms'] = Number(bedrooms);
        if (bathrooms) filter['specifications.bathrooms'] = { $gte: Number(bathrooms) };
        
        // Area range
        if (minArea || maxArea) {
            filter['specifications.area.size'] = {};
            if (minArea) filter['specifications.area.size'].$gte = Number(minArea);
            if (maxArea) filter['specifications.area.size'].$lte = Number(maxArea);
        }
        
        // Search in title and description
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { 'location.address': new RegExp(search, 'i') },
                { 'location.neighborhood': new RegExp(search, 'i') }
            ];
        }

        // Sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const properties = await Property.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .populate('agent', 'name email phone profilePic')
            .lean();

        const total = await Property.countDocuments(filter);

        res.json({
            success: true,
            message: 'Properties fetched successfully',
            data: properties,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Get properties error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch properties'
        });
    }
};

// Get single property by ID
const getSinglePropertyController = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const property = await Property.findById(propertyId)
            .populate('agent', 'name email phone profilePic address')
            .populate('uploadedBy', 'name email role')
            .populate('reviews.user', 'name profilePic');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Increment view count
        property.views = (property.views || 0) + 1;
        await property.save();

        res.json({
            success: true,
            message: 'Property fetched successfully',
            data: property
        });
    } catch (error) {
        logger.error('Get single property error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch property'
        });
    }
};

// Add new property (authenticated users)
const addPropertyController = async (req, res) => {
    try {
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login to add property'
            });
        }

        const hasPermission = await uploadProductPermission(sessionUser);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied. Only admins and staff can add properties'
            });
        }

        const propertyData = {
            ...req.body,
            agent: req.body.agent || sessionUser,
            companyId: sessionUser,
            uploadedBy: sessionUser
        };

        const property = new Property(propertyData);
        const savedProperty = await property.save();

        res.status(201).json({
            success: true,
            message: 'Property added successfully',
            data: savedProperty
        });
    } catch (error) {
        logger.error('Add property error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add property'
        });
    }
};

// Update property
const updatePropertyController = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login to update property'
            });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check permission
        const hasPermission = await uploadProductPermission(sessionUser);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty
        });
    } catch (error) {
        logger.error('Update property error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update property'
        });
    }
};

// Delete property
const deletePropertyController = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login to delete property'
            });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        const hasPermission = await uploadProductPermission(sessionUser);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        await Property.findByIdAndDelete(propertyId);

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        logger.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete property'
        });
    }
};

// Get user's properties
const getUserPropertiesController = async (req, res) => {
    try {
        const sessionUser = req.userId;

        if (!sessionUser) {
            return res.status(401).json({
                success: false,
                message: 'Please login to view your properties'
            });
        }

        const properties = await Property.find({
            $or: [
                { agent: sessionUser },
                { uploadedBy: sessionUser }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('agent', 'name email phone');

        res.json({
            success: true,
            message: 'User properties fetched successfully',
            data: properties
        });
    } catch (error) {
        logger.error('Get user properties error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user properties'
        });
    }
};

module.exports = {
    getPropertyController,
    getSinglePropertyController,
    addPropertyController,
    updatePropertyController,
    deletePropertyController,
    getUserPropertiesController
};
