require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
.then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas');
    return mongoose.connection.db.admin().ping();
})
.then(() => {
    console.log('✅ Database ping successful');
    return mongoose.connection.close();
})
.then(() => {
    console.log('✅ Connection closed');
    process.exit(0);
})
.catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
});
