require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// Simple inline schema to avoid model loading issues
const ProductSchema = new mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    ratings: [],
    reviews: [],
    socialShares: [],
    pricing: {
        originalPrice: {
            amount: Number,
            currency: String
        },
        sellingPrice: {
            amount: Number,
            currency: String
        }
    },
    status: { type: String, default: 'ACTIVE' },
    stock: { type: Number, default: 1 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

const sampleProducts = [
    {
        productName: "4 Bedroom Duplex in Lekki Phase 1",
        brandName: "Adoor Real Estate",
        category: "Houses",
        description: "Luxurious 4-bedroom duplex with modern amenities in the heart of Lekki Phase 1. Features include spacious living areas, fitted kitchen, all rooms ensuite, private parking, and 24/7 security.",
        productImage: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        ],
        pricing: {
            originalPrice: { amount: 85000000, currency: "NGN" },
            sellingPrice: { amount: 85000000, currency: "NGN" }
        },
        status: "ACTIVE",
        stock: 1
    },
    {
        productName: "2 Bedroom Apartment in Victoria Island",
        brandName: "Adoor Real Estate",
        category: "Apartments",
        description: "Modern 2-bedroom apartment in prime Victoria Island location with stunning city views. Includes gym access, swimming pool, and concierge services.",
        productImage: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
        ],
        pricing: {
            originalPrice: { amount: 35000000, currency: "NGN" },
            sellingPrice: { amount: 35000000, currency: "NGN" }
        },
        status: "ACTIVE",
        stock: 1
    },
    {
        productName: "3 Bedroom Flat in Ikoyi",
        brandName: "Adoor Real Estate",
        category: "Apartments",
        description: "Elegant 3-bedroom flat in exclusive Ikoyi neighborhood. Features high-end finishes, spacious balcony, and premium security.",
        productImage: [
            "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"
        ],
        pricing: {
            originalPrice: { amount: 55000000, currency: "NGN" },
            sellingPrice: { amount: 55000000, currency: "NGN" }
        },
        status: "ACTIVE",
        stock: 1
    },
    {
        productName: "5 Bedroom Mansion in Banana Island",
        brandName: "Adoor Real Estate",
        category: "Houses",
        description: "Exquisite 5-bedroom mansion on prestigious Banana Island. Waterfront property with private jetty, cinema room, and wine cellar.",
        productImage: [
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
        ],
        pricing: {
            originalPrice: { amount: 250000000, currency: "NGN" },
            sellingPrice: { amount: 250000000, currency: "NGN" }
        },
        status: "ACTIVE",
        stock: 1
    }
];

async function createProducts() {
    try {
        console.log('🏠 Creating sample real estate products...\n');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB Atlas\n');

        // Clear existing products
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products\n`);

        // Insert new products
        const results = await Product.insertMany(sampleProducts);
        console.log(`✅ Created ${results.length} sample products:\n`);
        
        results.forEach((product, index) => {
            console.log(`${index + 1}. ${product.productName}`);
            console.log(`   ID: ${product._id}`);
            console.log(`   Price: ₦${product.pricing.sellingPrice.amount.toLocaleString()}`);
            console.log(`   Status: ${product.status}\n`);
        });

        console.log('🎉 Sample products created successfully!');
        console.log(`\n📱 View products at: http://localhost:3000`);
        console.log(`📝 First product detail: http://localhost:3000/product/${results[0]._id}`);
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

createProducts();
