require('dotenv').config({ path: './backend/.env' });
const { MongoClient, ObjectId } = require('mongodb');

async function fixProperties() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db('adoorealestate');
        
        // Get first admin user
        const admin = await db.collection('users').findOne({ role: 'ADMIN' });
        
        if (!admin) {
            console.log('❌ No admin user found. Creating one...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            const result = await db.collection('users').insertOne({
                name: 'Admin User',
                email: 'admin@adoorrealestate.com',
                password: hashedPassword,
                role: 'ADMIN',
                profilePic: '',
                phone: '+234 800 000 0000',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            const adminId = result.insertedId;
            console.log(`✅ Created admin: ${adminId}\n`);
            
            // Update properties with admin ID
            const updateResult = await db.collection('properties').updateMany(
                {},
                {
                    $set: {
                        uploadedBy: adminId,
                        agent: adminId,
                        companyId: adminId,
                        'specifications.furnished': 'Fully Furnished'
                    }
                }
            );
            
            console.log(`✅ Updated ${updateResult.modifiedCount} properties\n`);
        } else {
            console.log(`✅ Found admin: ${admin.email} (${admin._id})\n`);
            
            // Update existing properties
            const updateResult = await db.collection('properties').updateMany(
                {},
                {
                    $set: {
                        uploadedBy: admin._id,
                        agent: admin._id,
                        companyId: admin._id
                    }
                }
            );
            
            // Fix furnished field
            await db.collection('properties').updateMany(
                { 'specifications.furnished': 'Furnished' },
                { $set: { 'specifications.furnished': 'Fully Furnished' } }
            );
            
            await db.collection('properties').updateMany(
                { 'specifications.furnished': { $exists: false } },
                { $set: { 'specifications.furnished': 'Unfurnished' } }
            );
            
            console.log(`✅ Updated ${updateResult.modifiedCount} properties with admin reference\n`);
        }
        
        // List all properties
        const properties = await db.collection('properties').find({}).limit(10).toArray();
        console.log(`📋 Properties in database: ${properties.length}\n`);
        
        properties.forEach((prop, i) => {
            console.log(`${i + 1}. ${prop.title}`);
            console.log(`   ID: ${prop._id}`);
            console.log(`   Price: ₦${prop.pricing.amount.toLocaleString()}`);
            console.log(`   Agent: ${prop.agent || 'None'}`);
            console.log(`   Status: ${prop.status}\n`);
        });
        
        if (properties.length > 0) {
            console.log('🎉 Properties are ready!');
            console.log(`\n📱 View at: http://localhost:3000`);
            console.log(`📝 First property: http://localhost:3000/property/${properties[0]._id}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n✅ Connection closed');
    }
}

fixProperties();
