const mongoose = require('mongoose');

const adminVerifyTokenSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60 // Token expires after 24 hours
    }
});

module.exports = mongoose.model('AdminVerifyToken', adminVerifyTokenSchema); 