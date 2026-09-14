const Product = require("../models/productModel");
const User = require("../models/userModel");
const CurrencyService = require("../services/currencyService");
const { buildPropertyFields, LOCATION_KEYS } = require('../utils/propertyFields');

async function updateProductController(req, res) {
    try {
        const { productId } = req.params;
        const updateData = { ...req.body };

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Get current user information
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check permissions: Admin, staff with edit permissions, or original uploader
        const canEdit = currentUser.role === 'ADMIN' || 
                       (currentUser.role === 'STAFF' && currentUser.permissions?.canEditProducts) ||
                       product.uploadedBy?.toString() === req.userId;

        if (!canEdit) {
            return res.status(403).json({
                message: "Insufficient permissions to edit this product",
                error: true,
                success: false
            });
        }

        // Store previous values for edit history
        const previousValues = {};
        const fieldsToTrack = ['productName', 'brandName', 'category', 'description', 'price', 'sellingPrice', 'stock'];
        
        fieldsToTrack.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== product[field]) {
                previousValues[field] = {
                    oldValue: product[field],
                    newValue: updateData[field]
                };
            }
        });

        // Remove fields that shouldn't be updated directly
        delete updateData.seller;
        delete updateData.sellerInfo;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.uploadedBy;
        delete updateData.uploadedByInfo;
        // Never let a client overwrite social data or history with a stale copy
        ['_id', '__v', 'likes', 'ratings', 'reviews', 'socialShares', 'editHistory', 'companyId',
         'lastEditedBy', 'lastEditedAt', 'analytics', 'pricing', 'displayPricing', 'socialFeatures'].forEach(field => delete updateData[field]);

        // Same property fields as add-product: flat location -> location object, status, details
        LOCATION_KEYS.forEach(field => delete updateData[field]);
        delete updateData.currency;
        Object.assign(updateData, buildPropertyFields(req.body));

        // Keep the structured pricing in sync with the legacy price fields
        if (updateData.price !== undefined && updateData.price !== '') {
            const price = parseFloat(updateData.price);
            const sellingPrice = parseFloat(updateData.sellingPrice || updateData.price);
            updateData.price = price;
            updateData.sellingPrice = sellingPrice;
            updateData['pricing.originalPrice.amount'] = price;
            updateData['pricing.sellingPrice.amount'] = sellingPrice;
        }
        if (req.body.currency) {
            updateData['pricing.originalPrice.currency'] = req.body.currency;
            updateData['pricing.sellingPrice.currency'] = req.body.currency;
        }
        if (typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }

        // Add edit tracking information
        const editInfo = {
            editedBy: req.userId,
            editedByInfo: {
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                editedAt: new Date()
            },
            changes: previousValues
        };

        // Update the product with edit tracking
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { 
                $set: {
                    ...updateData,
                    lastEditedBy: req.userId,
                    lastEditedAt: new Date()
                },
                $push: {
                    editHistory: editInfo
                }
            },
            { new: true, runValidators: true }
        )
        .populate('uploadedBy', 'name email role');

        // Refresh cached currency conversions for the new price
        if (updatedProduct?.pricing?.originalPrice) {
            const plainProduct = updatedProduct.toObject();
            CurrencyService.updateCachedPrices(plainProduct);
            await Product.updateOne({ _id: productId }, { $set: { 'pricing.convertedPrices': plainProduct.pricing.convertedPrices } });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
            error: false,
            success: true
        });

    } catch (err) {
        console.log("Error in updateProduct:", err.message);
        res.status(500).json({
            message: "Failed to update product: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = updateProductController;
