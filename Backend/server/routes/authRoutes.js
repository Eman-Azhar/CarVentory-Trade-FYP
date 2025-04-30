const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const AdminUser = require('../models/adminUserModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailService');

// Get all users (for testing/verification)
router.get('/users', async (req, res) => {
    try {
        console.log('📊 Fetching all users...');
        const users = await User.find({}, { password: 0 }); // Exclude passwords
        console.log(`✅ Found ${users.length} users in database`);
        console.log('Users:', users.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        })));
        
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        console.log('=== New Signup Attempt ===');
        console.log('Received data:', { 
            name: req.body.name,
            email: req.body.email,
            password: '***' // Don't log actual password
        });

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({ 
                success: false,
                message: 'Please provide all required fields' 
            });
        }

        // Check if user already exists
        console.log('🔍 Checking for existing user...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists:', existingUser.email);
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Hash password
        console.log('🔒 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        console.log('📝 Creating new user...');
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save to database
        console.log('💾 Saving to database...');
        await newUser.save();
        
        // Verify the user was saved
        const savedUser = await User.findOne({ email });
        console.log('✅ User created successfully!');
        console.log('Stored user data:', {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            createdAt: savedUser.createdAt
        });
        
        res.status(201).json({ 
            success: true,
            message: 'User created successfully',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating user',
            error: error.message 
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt for email:', req.body.email);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('Validation failed: Missing email or password');
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }

        // Find user
        console.log('Searching for user...');
        const user = await User.findOne({ email });
        
        // If user not found, check for admin
        if (!user) {
            console.log('User not found, checking admin collection...');
            const admin = await AdminUser.findOne({ email });
            
            if (!admin) {
                console.log('Admin not found:', email);
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }

            // Check if admin is verified and approved
            if (!admin.isVerified || !admin.isApproved) {
                console.log('Admin account not verified or approved:', email);
                return res.status(401).json({ 
                    success: false,
                    message: admin.isVerified ? 'Your account is pending approval' : 'Please verify your email first' 
                });
            }

            // Check password for admin
            console.log('Verifying admin password...');
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                console.log('Invalid password for admin:', email);
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }

            // Generate JWT token for admin
            const token = jwt.sign(
                { 
                    id: admin._id,
                    isAdmin: true,
                    isSuperAdmin: admin.isSuperAdmin || false
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '1d' }
            );

            // Return admin data (excluding password)
            const { password: _, ...adminWithoutPassword } = admin.toObject();
            console.log('Login successful for admin:', email);
            return res.json({ 
                success: true,
                message: 'Login successful', 
                token,
                user: {
                    ...adminWithoutPassword,
                    isAdmin: true
                }
            });
        }

        // Check password for regular user
        console.log('Verifying user password...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token for user
        const token = jwt.sign(
            { 
                id: user._id,
                isAdmin: false
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user.toObject();
        console.log('Login successful for user:', email);
        res.json({ 
            success: true,
            message: 'Login successful', 
            token,
            user: {
                ...userWithoutPassword,
                isAdmin: false
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in',
            error: error.message 
        });
    }
});

// Admin Signup Route
router.post('/admin/signup', async (req, res) => {
    try {
        console.log('Received admin signup data:', {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            cnicNumber: req.body.cnicNumber,
            showroomName: req.body.showroomName,
            password: '***'
        });

        const { name, email, password, phoneNumber, cnicNumber, showroomName } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phoneNumber || !cnicNumber || !showroomName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // Check if admin already exists with email or CNIC
        const existingAdmin = await AdminUser.findOne({ 
            $or: [
                { email },
                { cnicNumber }
            ]
        });

        if (existingAdmin) {
            let message = 'An admin account already exists with this ';
            if (existingAdmin.email === email) message += 'email address';
            else if (existingAdmin.cnicNumber === cnicNumber) message += 'CNIC number';

            return res.status(400).json({ 
                success: false, 
                message 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create new admin
        const newAdmin = new AdminUser({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            cnicNumber,
            showroomName,
            verificationToken,
            verificationTokenExpires
        });

        await newAdmin.save();

        try {
            // Send verification email
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-admin?token=${verificationToken}`;
            await sendVerificationEmail(email, verificationUrl);

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully. Please check your email for verification.'
            });
        } catch (emailError) {
            // If email fails, still create the account but inform the user about email issue
            console.error('Error sending verification email:', emailError);
            res.status(201).json({
                success: true,
                message: 'Admin account created but there was an issue sending the verification email. Please contact support.'
            });
        }
    } catch (error) {
        console.error('Admin signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating admin account',
            error: error.message
        });
    }
});

// Admin email verification route
router.post('/admin/verify', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        // Find admin with matching token
        const admin = await AdminUser.findOne({ verificationToken: token });
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        // Update admin as verified
        admin.isVerified = true;
        admin.verificationToken = null;
        await admin.save();

        res.json({
            success: true,
            message: 'Email verified successfully. You can now login.'
        });
    } catch (error) {
        console.error('Admin verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email',
            error: error.message
        });
    }
});

module.exports = router; 