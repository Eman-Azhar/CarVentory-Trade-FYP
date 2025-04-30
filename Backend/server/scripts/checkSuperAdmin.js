const mongoose = require('mongoose');
const AdminUser = require('../models/adminUserModel');

const MONGODB_URI = 'mongodb+srv://EmanAzhar:emanss333@cluster0.08j9lke.mongodb.net/CarVentory?retryWrites=true&w=majority';

const checkSuperAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully');

        const superAdmin = await AdminUser.findOne({ email: 'eman@carventory.com' });
        
        if (superAdmin) {
            console.log('Super Admin found:');
            console.log('Email:', superAdmin.email);
            console.log('Name:', superAdmin.name);
            console.log('Is Verified:', superAdmin.isVerified);
            console.log('Is Approved:', superAdmin.isApproved);
            console.log('Is Admin:', superAdmin.isAdmin);
            console.log('Password Hash:', superAdmin.password.substring(0, 20) + '...');
        } else {
            console.log('No super admin found with email: eman@carventory.com');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

checkSuperAdmin(); 