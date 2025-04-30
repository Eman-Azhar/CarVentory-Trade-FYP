const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/adminUserModel');

const MONGODB_URI = 'mongodb+srv://EmanAzhar:emanss333@cluster0.08j9lke.mongodb.net/CarVentory?retryWrites=true&w=majority';

const createSuperAdmin = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB successfully');

        // Super admin details
        const superAdminData = {
            name: 'Super Admin',
            email: 'eman@carventory.com',
            password: 'admin123', // This will be hashed
            phoneNumber: '03001234567',
            cnicNumber: '12345-1234567-1',
            showroomName: 'CarVentory Admin',
            isVerified: true,
            isApproved: true,
            isAdmin: true,
            isSuperAdmin: true
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(superAdminData.password, 10);
        superAdminData.password = hashedPassword;

        // Check if super admin already exists
        const existingAdmin = await AdminUser.findOne({ email: superAdminData.email });
        if (existingAdmin) {
            console.log('Super admin already exists!');
            process.exit(0);
        }

        // Create super admin
        const superAdmin = new AdminUser(superAdminData);
        await superAdmin.save();

        console.log('Super admin created successfully!');
        console.log('Email:', superAdminData.email);
        console.log('Password:', 'admin123');
        console.log('Please save these credentials securely.');

    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

createSuperAdmin(); 