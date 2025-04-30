const mongoose = require('mongoose');
const User = require('../models/userModel');

const MONGODB_URI = 'mongodb+srv://EmanAzhar:emanss333@cluster0.08j9lke.mongodb.net/CarVentory?retryWrites=true&w=majority';

async function checkUser() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Check user with exact email
        const email = 'manahilmalik@gmail.com';
        const user = await User.findOne({ email });
        
        if (user) {
            console.log('✅ User found:');
            console.log('Email:', user.email);
            console.log('Name:', user.name);
            console.log('Role:', user.role);
            console.log('Created At:', user.createdAt);
        } else {
            console.log('❌ User not found with exact email:', email);
            
            // Check all users in database
            const allUsers = await User.find({});
            console.log('\nAll users in database:');
            allUsers.forEach(u => {
                console.log(`Email: ${u.email}, Name: ${u.name}`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

checkUser(); 