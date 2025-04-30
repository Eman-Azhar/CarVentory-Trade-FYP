const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/adminUserModel');

const MONGODB_URI = 'mongodb+srv://EmanAzhar:emanss333@cluster0.08j9lke.mongodb.net/CarVentory?retryWrites=true&w=majority';

const resetSuperAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully');

        // Delete existing super admin if exists
        await AdminUser.deleteOne({ email: 'eman@carventory.com' });
        console.log('Deleted existing super admin if any');

        // Create new super admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const superAdmin = new AdminUser({
            name: 'Super Admin',
            email: 'eman@carventory.com',
            password: hashedPassword,
            phoneNumber: '03001234567',
            cnicNumber: '12345-1234567-1',
            showroomName: 'CarVentory Admin',
            isVerified: true,
            isApproved: true,
            isAdmin: true,
            isSuperAdmin: true
        });

        await superAdmin.save();
        console.log('Super admin recreated successfully!');
        console.log('Email:', superAdmin.email);
        console.log('Password: admin123');
        console.log('Please save these credentials securely.');

        // Verify the account was created correctly
        const verifyAdmin = await AdminUser.findOne({ email: 'eman@carventory.com' });
        console.log('\nVerifying super admin account:');
        console.log('Found:', !!verifyAdmin);
        console.log('Is Verified:', verifyAdmin.isVerified);
        console.log('Is Approved:', verifyAdmin.isApproved);
        console.log('Is Admin:', verifyAdmin.isAdmin);
        console.log('Is Super Admin:', verifyAdmin.isSuperAdmin);
        console.log('Password Hash:', verifyAdmin.password.substring(0, 20) + '...');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

resetSuperAdmin(); 