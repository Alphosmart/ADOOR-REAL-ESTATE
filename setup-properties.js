require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const User = require('./backend/models/userModel');
const Property = require('./backend/models/propertyModel');

async function getAdminAndCreateProperties() {
    try {
        console.log('🏠 Setting up real estate properties...\n');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB Atlas\n');

        // Find admin user
        let adminUser = await User.findOne({ role: 'ADMIN' });
        
        if (!adminUser) {
            console.log('⚠️  No admin user found. Creating one...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@adoorrealestate.com',
                password: hashedPassword,
                role: 'ADMIN',
                profilePic: '',
                phone: '+234 800 000 0000'
            });
            console.log(`✅ Created admin user: ${adminUser.email}\n`);
        } else {
            console.log(`✅ Found admin user: ${adminUser.email}\n`);
        }

        const sampleProperties = [
            {
                title: "4 Bedroom Duplex in Lekki Phase 1",
                description: "Beautiful 4-bedroom duplex with modern fittings in serene Lekki Phase 1. Features include spacious living area, fitted kitchen, all rooms ensuite, parking for 4 cars, 24-hour security, and backup generator.",
                propertyType: "House",
                listingType: "For Sale",
                pricing: { amount: 85000000, currency: "NGN" },
                location: {
                    address: "12 Admiralty Way, Lekki Phase 1",
                    city: "Lagos",
                    state: "Lagos",
                    country: "Nigeria",
                    neighborhood: "Lekki Phase 1"
                },
                specifications: {
                    bedrooms: 4,
                    bathrooms: 4,
                    area: { size: 350, unit: "sqm" },
                    parkingSpaces: 4,
                    furnished: "Semi-Furnished"
                },
                amenities: ["Swimming Pool", "Security", "24/7 Power", "Parking", "Generator", "CCTV"],
                features: {
                    airConditioning: true,
                    security: true,
                    balcony: true,
                    garden: true
                },
                images: [
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                ],
                productImage: [
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                ],
                status: "Available",
                isPublished: true,
                isFeatured: true,
                uploadedBy: adminUser._id,
                agent: adminUser._id
            },
            {
                title: "2 Bedroom Apartment in Victoria Island",
                description: "Luxury 2-bedroom apartment in prime Victoria Island location. Sea view, modern kitchen, spacious bedrooms, gym, swimming pool, and 24-hour security.",
                propertyType: "Apartment",
                listingType: "For Sale",
                pricing: { amount: 35000000, currency: "NGN" },
                location: {
                    address: "Plot 45, Ahmadu Bello Way",
                    city: "Lagos",
                    state: "Lagos",
                    country: "Nigeria",
                    neighborhood: "Victoria Island"
                },
                specifications: {
                    bedrooms: 2,
                    bathrooms: 2,
                    area: { size: 150, unit: "sqm" },
                    parkingSpaces: 2,
                    furnished: "Fully Furnished"
                },
                amenities: ["Swimming Pool", "Gym", "Security", "Elevator", "Parking"],
                features: {
                    airConditioning: true,
                    security: true,
                    balcony: true,
                    elevator: true
                },
                images: [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ],
                productImage: [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                ],
                status: "Available",
                isPublished: true,
                isFeatured: true,
                uploadedBy: adminUser._id,
                agent: adminUser._id
            },
            {
                title: "3 Bedroom Flat in Ikoyi",
                description: "Elegant 3-bedroom flat in exclusive Ikoyi neighborhood. Features high-end finishes, spacious balcony, and premium security.",
                propertyType: "Apartment",
                listingType: "For Rent",
                pricing: { amount: 5500000, currency: "NGN", rentPeriod: "Yearly" },
                location: {
                    address: "15 Bourdillon Road",
                    city: "Lagos",
                    state: "Lagos",
                    country: "Nigeria",
                    neighborhood: "Ikoyi"
                },
                specifications: {
                    bedrooms: 3,
                    bathrooms: 3,
                    area: { size: 200, unit: "sqm" },
                    parkingSpaces: 2,
                    furnished: "Semi-Furnished"
                },
                amenities: ["Security", "Parking", "Generator", "CCTV"],
                features: {
                    airConditioning: true,
                    security: true,
                    balcony: true,
                    elevator: true
                },
                images: [
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"
                ],
                productImage: [
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"
                ],
                status: "Available",
                isPublished: true,
                isFeatured: false,
                uploadedBy: adminUser._id,
                agent: adminUser._id
            },
            {
                title: "5 Bedroom Mansion in Banana Island",
                description: "Exquisite 5-bedroom mansion on prestigious Banana Island. Waterfront property with private jetty, cinema room, and wine cellar.",
                propertyType: "Villa",
                listingType: "For Sale",
                pricing: { amount: 250000000, currency: "NGN" },
                location: {
                    address: "Banana Island Estate",
                    city: "Lagos",
                    state: "Lagos",
                    country: "Nigeria",
                    neighborhood: "Banana Island"
                },
                specifications: {
                    bedrooms: 5,
                    bathrooms: 6,
                    area: { size: 800, unit: "sqm" },
                    parkingSpaces: 6,
                    furnished: "Fully Furnished"
                },
                amenities: ["Private Jetty", "Cinema", "Wine Cellar", "Pool", "Gym", "Smart Home"],
                features: {
                    airConditioning: true,
                    security: true,
                    balcony: true,
                    garden: true,
                    elevator: true,
                    pool: true,
                    gym: true
                },
                images: [
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
                ],
                productImage: [
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
                ],
                status: "Available",
                isPublished: true,
                isFeatured: true,
                uploadedBy: adminUser._id,
                agent: adminUser._id
            },
            {
                title: "Studio Apartment in Yaba",
                description: "Modern studio apartment perfect for young professionals. Located in vibrant Yaba with easy access to tech hubs.",
                propertyType: "Studio",
                listingType: "For Rent",
                pricing: { amount: 800000, currency: "NGN", rentPeriod: "Yearly" },
                location: {
                    address: "Herbert Macaulay Way",
                    city: "Lagos",
                    state: "Lagos",
                    country: "Nigeria",
                    neighborhood: "Yaba"
                },
                specifications: {
                    bedrooms: 1,
                    bathrooms: 1,
                    area: { size: 45, unit: "sqm" },
                    parkingSpaces: 1,
                    furnished: "Semi-Furnished"
                },
                amenities: ["Security", "Water Supply", "Parking"],
                features: {
                    airConditioning: true,
                    security: true
                },
                images: [
                    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"
                ],
                productImage: [
                    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"
                ],
                status: "Available",
                isPublished: true,
                isFeatured: false,
                uploadedBy: adminUser._id,
                agent: adminUser._id
            }
        ];

        // Clear existing properties
        const deleteResult = await Property.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing properties\n`);

        // Insert new properties
        const results = await Property.insertMany(sampleProperties);
        console.log(`✅ Created ${results.length} sample properties:\n`);
        
        results.forEach((property, index) => {
            console.log(`${index + 1}. ${property.title}`);
            console.log(`   ID: ${property._id}`);
            console.log(`   Type: ${property.propertyType} - ${property.listingType}`);
            console.log(`   Price: ₦${property.pricing.amount.toLocaleString()}`);
            console.log(`   Location: ${property.location.neighborhood}, ${property.location.city}`);
            console.log(`   Status: ${property.status}\n`);
        });

        console.log('🎉 Sample properties created successfully!');
        console.log(`\n📱 View properties at: http://localhost:3000`);
        console.log(`📝 First property: http://localhost:3000/property/${results[0]._id}`);
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

getAdminAndCreateProperties();
