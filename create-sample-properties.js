require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Property = require('./backend/models/propertyModel');
const Agent = require('./backend/models/agentModel');
const User = require('./backend/models/userModel');

/**
 * Script to create sample real estate data for testing
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate';

const sampleProperties = [
    {
        title: '4 Bedroom Duplex in Lekki Phase 1',
        description: 'Beautiful 4-bedroom duplex with modern fittings in serene Lekki Phase 1. Features include spacious living area, fitted kitchen, all rooms ensuite, parking for 4 cars, 24-hour security, and backup generator.',
        propertyType: 'House',
        listingType: 'For Sale',
        pricing: { amount: 85000000, currency: 'NGN' },
        location: {
            address: '12 Admiralty Way, Lekki Phase 1',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            neighborhood: 'Lekki Phase 1',
            coordinates: { latitude: 6.4474, longitude: 3.4700 }
        },
        specifications: {
            bedrooms: 4,
            bathrooms: 4,
            area: { size: 350, unit: 'sqm' },
            parkingSpaces: 4,
            furnished: 'Semi-Furnished'
        },
        amenities: ['Swimming Pool', 'Security', '24/7 Power', 'Parking', 'Generator', 'CCTV'],
        features: {
            airConditioning: true,
            security: true,
            balcony: true,
            garden: true,
            elevator: false
        },
        status: 'Available',
        isPublished: true,
        isFeatured: true
    },
    {
        title: '2 Bedroom Apartment in Victoria Island',
        description: 'Luxury 2-bedroom apartment in prime Victoria Island location. Sea view, modern kitchen, spacious bedrooms, gym, swimming pool, and 24-hour security.',
        propertyType: 'Apartment',
        listingType: 'For Rent',
        pricing: { amount: 3500000, currency: 'NGN', rentPeriod: 'Yearly' },
        location: {
            address: '45 Ozumba Mbadiwe Avenue',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            neighborhood: 'Victoria Island',
            coordinates: { latitude: 6.4281, longitude: 3.4219 }
        },
        specifications: {
            bedrooms: 2,
            bathrooms: 2,
            area: { size: 120, unit: 'sqm' },
            parkingSpaces: 2,
            furnished: 'Fully Furnished'
        },
        amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'CCTV', 'Internet', 'Elevator'],
        features: {
            airConditioning: true,
            gym: true,
            pool: true,
            security: true,
            elevator: true,
            balcony: true
        },
        status: 'Available',
        isPublished: true,
        isFeatured: true
    },
    {
        title: '5 Bedroom Detached House in Ikoyi',
        description: 'Exquisite 5-bedroom detached house in exclusive Ikoyi neighborhood. Features include cinema room, wine cellar, gym, swimming pool, servant quarters, and lush garden.',
        propertyType: 'Villa',
        listingType: 'For Sale',
        pricing: { amount: 250000000, currency: 'NGN' },
        location: {
            address: '8 Bourdillon Road, Ikoyi',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            neighborhood: 'Ikoyi',
            coordinates: { latitude: 6.4550, longitude: 3.4242 }
        },
        specifications: {
            bedrooms: 5,
            bathrooms: 6,
            area: { size: 600, unit: 'sqm' },
            parkingSpaces: 6,
            furnished: 'Semi-Furnished',
            floors: 2
        },
        amenities: ['Swimming Pool', 'Gym', 'Cinema', 'Wine Cellar', 'Security', 'Garden', 'Parking', 'CCTV', 'Generator'],
        features: {
            airConditioning: true,
            gym: true,
            pool: true,
            security: true,
            garden: true,
            balcony: true,
            fireplace: true
        },
        status: 'Available',
        isPublished: true,
        isFeatured: true
    },
    {
        title: '1000sqm Land in Ajah',
        description: 'Prime 1000sqm plot of land in fast-developing Ajah area. Perfect for residential or commercial development. Clean title documents available.',
        propertyType: 'Land',
        listingType: 'For Sale',
        pricing: { amount: 35000000, currency: 'NGN' },
        location: {
            address: 'Plot 45, Ado Road, Ajah',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            neighborhood: 'Ajah',
            coordinates: { latitude: 6.4698, longitude: 3.5852 }
        },
        specifications: {
            bedrooms: 0,
            bathrooms: 0,
            area: { size: 1000, unit: 'sqm' },
            lotSize: { size: 1000, unit: 'sqm' }
        },
        amenities: ['Road Access', 'Electricity', 'Water Supply'],
        status: 'Available',
        isPublished: true
    },
    {
        title: '3 Bedroom Flat in Yaba',
        description: 'Affordable 3-bedroom flat in vibrant Yaba area. Close to schools, hospitals, and shopping centers. Good for young families.',
        propertyType: 'Apartment',
        listingType: 'For Rent',
        pricing: { amount: 1200000, currency: 'NGN', rentPeriod: 'Yearly' },
        location: {
            address: '22 Herbert Macaulay Way, Yaba',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            neighborhood: 'Yaba',
            coordinates: { latitude: 6.5092, longitude: 3.3737 }
        },
        specifications: {
            bedrooms: 3,
            bathrooms: 2,
            area: { size: 90, unit: 'sqm' },
            parkingSpaces: 1,
            furnished: 'Unfurnished'
        },
        amenities: ['Security', 'Parking', 'Water Supply'],
        features: {
            security: true,
            petFriendly: true
        },
        status: 'Available',
        isPublished: true
    },
    {
        title: 'Commercial Office Space in Ikeja',
        description: 'Modern office space in central Ikeja business district. Perfect for corporate offices. Features open plan layout, conference rooms, and 24-hour power.',
        propertyType: 'Commercial',
        listingType: 'For Lease',
        pricing: { amount: 5000000, currency: 'NGN', rentPeriod: 'Yearly' },
        location: {
            address: '15 Allen Avenue, Ikeja',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            neighborhood: 'Ikeja',
            coordinates: { latitude: 6.5964, longitude: 3.3397 }
        },
        specifications: {
            bedrooms: 0,
            bathrooms: 4,
            area: { size: 200, unit: 'sqm' },
            parkingSpaces: 10,
            floors: 1
        },
        amenities: ['24/7 Power', 'Security', 'Parking', 'Internet', 'CCTV', 'Elevator'],
        features: {
            airConditioning: true,
            security: true,
            elevator: true,
            wheelchairAccessible: true
        },
        status: 'Available',
        isPublished: true
    }
];

async function createSampleData() {
    try {
        console.log('🏗️  Creating sample real estate data...');
        console.log('📡 Connecting to MongoDB...');
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database');

        // Find admin user to assign as agent
        let adminUser = await User.findOne({ role: 'ADMIN' });
        
        if (!adminUser) {
            console.log('⚠️  No admin user found. Creating default admin...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            adminUser = new User({
                name: 'Admin User',
                email: 'admin@realestate.com',
                password: hashedPassword,
                role: 'ADMIN',
                phone: '+234 800 000 0000',
                address: {
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'Nigeria'
                }
            });
            await adminUser.save();
            console.log('✅ Created admin user (email: admin@realestate.com, password: admin123)');
        }

        console.log(`\n👤 Using agent: ${adminUser.name} (${adminUser.email})`);

        let created = 0;
        let skipped = 0;

        for (const propertyData of sampleProperties) {
            try {
                // Check if property already exists
                const existing = await Property.findOne({ title: propertyData.title });
                
                if (existing) {
                    console.log(`⏭️  Skipping: "${propertyData.title}" - already exists`);
                    skipped++;
                    continue;
                }

                const property = new Property({
                    ...propertyData,
                    agent: adminUser._id,
                    companyId: adminUser._id,
                    uploadedBy: adminUser._id,
                    uploadedByInfo: {
                        name: adminUser.name,
                        email: adminUser.email,
                        role: adminUser.role
                    },
                    agentInfo: {
                        name: adminUser.name,
                        email: adminUser.email,
                        phone: adminUser.phone,
                        role: adminUser.role
                    },
                    images: [],
                    productName: propertyData.title,
                    productImage: [],
                    category: 'Real Estate'
                });

                await property.save();
                created++;
                console.log(`✅ Created: "${property.title}"`);
                
            } catch (error) {
                console.error(`❌ Error creating "${propertyData.title}":`, error.message);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`✅ Created: ${created} properties`);
        console.log(`⏭️  Skipped: ${skipped} properties`);
        console.log(`📦 Total: ${sampleProperties.length} properties processed`);
        
        console.log('\n✨ Sample data creation completed!');
        console.log('\n🌐 You can now start the server and browse properties.');
        
    } catch (error) {
        console.error('❌ Failed to create sample data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database');
    }
}

// Run if called directly
if (require.main === module) {
    createSampleData().catch(console.error);
}

module.exports = createSampleData;
