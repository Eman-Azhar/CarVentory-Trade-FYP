const mongoose = require('mongoose');

// Use the correct MongoDB URI from your config
const MONGODB_URI = 'mongodb+srv://EmanAzhar:emanss333@cluster0.08j9lke.mongodb.net/CarVentory?retryWrites=true&w=majority';

async function fixUserIndex() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Get the users collection
        const usersCollection = mongoose.connection.collection('users');
        
        // Drop the username_1 index
        console.log('🗑️ Dropping username index...');
        await usersCollection.dropIndex('username_1');
        console.log('✅ Successfully dropped username index');

        console.log('✨ Database index fixed successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

fixUserIndex(); 