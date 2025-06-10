const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path'); // ✅ Added path module
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') }); // ✅ Correct path to .env

// ✅ Test route to confirm route is active
router.get('/test', (req, res) => {
    res.send("✅ Test Drive Route is working");
});

// POST /api/test-drive-request
router.post('/', async (req, res) => {
    try {
        const { carId, sellerEmail, name, location, datetime, description, email } = req.body;

        if (!sellerEmail || !name || !location || !datetime || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Email content
        const mailOptions = {
            from: `CarVentory <${process.env.EMAIL_USERNAME}>`,
            to: sellerEmail,
            subject: 'New Test Drive Request for Your Car Ad',
            html: `
                <h2>Test Drive Request</h2>
                <p><strong>Car ID:</strong> ${carId}</p>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Date & Time:</strong> ${datetime}</p>
                <p><strong>Description:</strong> ${description || 'N/A'}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Test drive request sent to seller.' });
    } catch (err) {
        console.error('Test drive request error:', err);
        res.status(500).json({ message: 'Failed to send test drive request.' });
    }
});

module.exports = router;
