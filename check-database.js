require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const productModel = require('./backend/models/productModel');

async function checkDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to database');

        const productCount = await productModel.countDocuments();
        console.log(`📦 Total products in database: ${productCount}`);

        if (productCount > 0) {
            const products = await productModel.find().limit(3);
            console.log('\n📋 Sample products:');
            products.forEach((p, i) => {
                console.log(`${i + 1}. ${p.productName} (${p._id}) - Status: ${p.status}`);
            });
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
