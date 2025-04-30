const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true
    },
    cnicNumber: {
        type: String,
        required: [true, 'Please provide a CNIC number'],
        unique: true,
        trim: true
    },
    showroomName: {
        type: String,
        required: [true, 'Please provide your showroom name'],
        trim: true
    },
    ntnNumber: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser; 