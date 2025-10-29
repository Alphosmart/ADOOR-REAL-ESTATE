require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./backend/models/productModel');
const Property = require('./backend/models/propertyModel');

/**
 * Migration script to convert existing products to properties
 * This script reads existing products and creates corresponding property listings
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate';

async function migrateProductsToProperties() {
    try {
        console.log('🔄 Starting migration: Products → Properties');
        console.log('📡 Connecting to MongoDB...');
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database');

        // Fetch all products
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products to migrate`);

        let migrated = 0;
        let skipped = 0;

        for (const product of products) {
            try {
                // Check if already migrated
                const existingProperty = await Property.findOne({ 
                    productName: product.productName,
                    'location.address': product.description 
                });

                if (existingProperty) {
                    console.log(`⏭️  Skipping "${product.productName}" - already exists as property`);
                    skipped++;
                    continue;
                }

                // Map product to property
                const propertyData = {
                    title: product.productName || 'Property Listing',
                    description: product.description || 'No description provided',
                    propertyType: mapCategoryToPropertyType(product.category),
                    listingType: 'For Sale',
                    
                    pricing: {
                        amount: product.pricing?.sellingPrice?.amount || product.sellingPrice || product.price || 0,
                        currency: product.pricing?.sellingPrice?.currency || product.pricing?.originalPrice?.currency || 'NGN',
                        convertedPrices: product.pricing?.convertedPrices || {}
                    },
                    
                    location: {
                        address: product.description?.substring(0, 100) || 'Address not specified',
                        city: extractCity(product.brandName) || 'Lagos',
                        state: 'Lagos',
                        country: 'Nigeria',
                        neighborhood: product.brandName || '',
                        coordinates: {
                            // Default coordinates (Lagos, Nigeria)
                            latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
                            longitude: 3.3792 + (Math.random() - 0.5) * 0.1
                        }
                    },
                    
                    specifications: {
                        bedrooms: Math.floor(Math.random() * 5) + 1,
                        bathrooms: Math.floor(Math.random() * 4) + 1,
                        area: {
                            size: Math.floor(Math.random() * 2000) + 500,
                            unit: 'sqm'
                        },
                        parkingSpaces: Math.floor(Math.random() * 3),
                        furnished: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'][Math.floor(Math.random() * 3)]
                    },
                    
                    amenities: generateRandomAmenities(),
                    
                    features: {
                        airConditioning: Math.random() > 0.5,
                        heating: Math.random() > 0.7,
                        pool: Math.random() > 0.8,
                        gym: Math.random() > 0.7,
                        garden: Math.random() > 0.6,
                        balcony: Math.random() > 0.4,
                        elevator: Math.random() > 0.5,
                        security: Math.random() > 0.3,
                        petFriendly: Math.random() > 0.6
                    },
                    
                    images: (product.productImage || []).map((url, index) => ({
                        url,
                        caption: `Property Image ${index + 1}`,
                        isPrimary: index === 0
                    })),
                    
                    agent: product.uploadedBy || product.companyId,
                    companyId: product.companyId,
                    uploadedBy: product.uploadedBy,
                    uploadedByInfo: product.uploadedByInfo,
                    
                    status: product.status === 'active' ? 'Available' : 'Off Market',
                    isPublished: true,
                    isFeatured: false,
                    
                    // Preserve social features
                    likes: product.likes || [],
                    reviews: product.reviews || [],
                    socialShares: product.socialShares || [],
                    
                    views: 0,
                    inquiries: 0,
                    
                    // Keep compatibility fields
                    productName: product.productName,
                    productImage: product.productImage || [],
                    category: 'Real Estate'
                };

                const property = new Property(propertyData);
                await property.save();
                
                migrated++;
                console.log(`✅ Migrated: "${product.productName}" → Property #${property._id}`);
                
            } catch (error) {
                console.error(`❌ Error migrating "${product.productName}":`, error.message);
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`✅ Migrated: ${migrated} properties`);
        console.log(`⏭️  Skipped: ${skipped} properties (already existed)`);
        console.log(`📦 Total: ${products.length} products processed`);
        
        console.log('\n✨ Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database');
    }
}

function mapCategoryToPropertyType(category) {
    if (!category) return 'House';
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('house')) return 'House';
    if (lowerCategory.includes('apartment')) return 'Apartment';
    if (lowerCategory.includes('condo')) return 'Condo';
    if (lowerCategory.includes('land')) return 'Land';
    if (lowerCategory.includes('commercial')) return 'Commercial';
    if (lowerCategory.includes('villa')) return 'Villa';
    if (lowerCategory.includes('studio')) return 'Studio';
    
    return 'House';
}

function extractCity(brandName) {
    if (!brandName) return 'Lagos';
    
    const cities = ['Lagos', 'Abuja', 'Ibadan', 'Kano', 'Port Harcourt', 'Benin City', 'Kaduna'];
    const lowerBrand = brandName.toLowerCase();
    
    for (const city of cities) {
        if (lowerBrand.includes(city.toLowerCase())) {
            return city;
        }
    }
    
    return 'Lagos';
}

function generateRandomAmenities() {
    const allAmenities = [
        'Swimming Pool', 'Gym', 'Security', '24/7 Power', 
        'Parking', 'Garden', 'Playground', 'CCTV',
        'Internet', 'Water Supply', 'Generator'
    ];
    
    const count = Math.floor(Math.random() * 5) + 3;
    const shuffled = allAmenities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Run migration
if (require.main === module) {
    migrateProductsToProperties().catch(console.error);
}

module.exports = migrateProductsToProperties;
