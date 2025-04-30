const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for your advertisement'],
        trim: true
    },
    make: {
        type: String,
        required: [true, 'Please provide the car make'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Please provide the car model'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Please provide the manufacturing year'],
        min: [1900, 'Year must be 1900 or later'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    price: {
        type: Number,
        required: [true, 'Please provide the price'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true
    },
    imageUrls: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length >= 1 && v.length <= 4;
            },
            message: 'Must provide between 1 and 4 images'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', carSchema); 