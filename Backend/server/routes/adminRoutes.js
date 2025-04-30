const express = require('express');
const router = express.Router();
const AdminUser = require('../models/adminUserModel');
const AdminVerifyToken = require('../models/adminVerifyToken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await AdminUser.findById(decoded.id);

        if (!admin || !admin.isVerified || !admin.isApproved || !admin.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Super admin middleware
const verifySuperAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await AdminUser.findById(decoded.id);

        if (!admin || !admin.isSuperAdmin) {
            return res.status(403).json({ message: 'Super admin access required' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin login
router.post('/login', async (req, res) => {
    try {
        console.log('Admin login attempt - Request body:', {
            email: req.body.email,
            passwordLength: req.body.password ? req.body.password.length : 0
        });

        const { email, password } = req.body;

        // Find admin
        const admin = await AdminUser.findOne({ email });
        console.log('Admin search result:', admin ? {
            id: admin._id,
            email: admin.email,
            isVerified: admin.isVerified,
            isApproved: admin.isApproved,
            isAdmin: admin.isAdmin,
            isSuperAdmin: admin.isSuperAdmin
        } : 'Not found');

        if (!admin) {
            console.log('Admin not found:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if admin is verified
        if (!admin.isVerified) {
            console.log('Admin not verified:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Please verify your email first' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        console.log('Password validation result:', isValidPassword);

        if (!isValidPassword) {
            console.log('Invalid password for admin:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id,
                isAdmin: admin.isAdmin,
                isSuperAdmin: admin.isSuperAdmin
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        console.log('Admin login successful:', {
            email: admin.email,
            name: admin.name,
            isAdmin: admin.isAdmin,
            isSuperAdmin: admin.isSuperAdmin
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin,
                isSuperAdmin: admin.isSuperAdmin,
                isApproved: admin.isApproved
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error during login',
            error: error.message 
        });
    }
});

// Get pending admin requests (Super Admin only)
router.get('/pending-requests', verifySuperAdmin, async (req, res) => {
    try {
        const pendingAdmins = await AdminUser.find({
            isVerified: true,
            isApproved: false
        }).select('-password');

        res.json({
            success: true,
            pendingAdmins
        });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Error fetching pending requests' });
    }
});

// Approve/Reject admin (Super Admin only)
router.post('/approve-admin/:id', verifySuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { approve } = req.body;

        const admin = await AdminUser.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (approve) {
            admin.isApproved = true;
            await admin.save();

            // Send approval email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: admin.email,
                subject: 'Admin Account Approved',
                html: `
                    <h1>Account Approved</h1>
                    <p>Your admin account has been approved. You can now log in to the dashboard.</p>
                `
            });

            res.json({
                success: true,
                message: 'Admin approved successfully'
            });
        } else {
            // If rejected, delete the admin account
            await AdminUser.findByIdAndDelete(id);

            // Send rejection email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: admin.email,
                subject: 'Admin Account Rejected',
                html: `
                    <h1>Account Rejected</h1>
                    <p>We regret to inform you that your admin account request has been rejected.</p>
                `
            });

            res.json({
                success: true,
                message: 'Admin rejected successfully'
            });
        }
    } catch (error) {
        console.error('Error processing admin approval:', error);
        res.status(500).json({ message: 'Error processing admin approval' });
    }
});

module.exports = router; 