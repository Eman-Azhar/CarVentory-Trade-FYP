const nodemailer = require('nodemailer');

// Debug email configuration
console.log('Initializing email service with configuration:', {
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || 'not set',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'not set'
});

// Check for required email credentials
if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    console.error('Email configuration is missing! Please check your config.env file.');
}

// Create a transporter using Gmail with App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
        console.error('Email configuration:', {
            user: process.env.EMAIL_USERNAME,
            passLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0
        });
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationUrl) => {
    try {
        console.log('Attempting to send verification email to:', email);
        console.log('Using email configuration:', {
            from: process.env.EMAIL_USERNAME,
            to: email
        });

        const mailOptions = {
            from: `"CarVentory Admin" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: 'Verify your CarVentory Admin Account',
            html: `
                <h1>Welcome to CarVentory!</h1>
                <p>Thank you for registering as an admin. Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>If you did not create this account, please ignore this email.</p>
                <p>This link will expire in 24 hours.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Detailed email error:', {
            error: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack
        });
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail
};
