const Product = require("../models/productModel");
const User = require("../models/userModel");

// Loads a listing for the edit form. Unlike the public /product/:id endpoint, this returns
// listings of any status (Pending/Sold/Rented) and uses the same permission rules as update-product.
async function getProductForEditController(req, res) {
    try {
        const product = await Product.findById(req.params.productId).lean();
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

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

        res.json({
            message: "Product fetched successfully",
            data: product,
            error: false,
            success: true
        });
    } catch (err) {
        res.status(err.name === 'CastError' ? 404 : 500).json({
            message: err.name === 'CastError' ? "Product not found" : "Failed to load product: " + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = getProductForEditController;
