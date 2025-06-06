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
    },
    mileage: {
        type: Number,
        required: [true, 'Please provide the car mileage'],
        min: [0, 'Mileage cannot be negative']
    },
    transmission: {
        type: String,
        required: [true, 'Please provide the transmission type'],
        enum: ['Manual', 'Automatic']
    },
    color: {
        type: String,
        required: [true, 'Please provide the car color']
    },
    fuelType: {
        type: String,
        required: [true, 'Please provide the fuel type'],
        enum: ['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric']
    },
    engineType: {
        type: Number,
        required: [true, 'Please provide the engine type (cc)'],
        min: [0, 'Engine type cannot be negative']
    },
    condition: {
        type: String,
        required: [true, 'Please provide the car condition'],
        enum: ['Brand New', 'Used (Excellent)', 'Used (Good)', 'Needs Repair']
    },
    sellerName: {
        type: String,
        required: [true, 'Please provide the seller name']
    },
    sellerPhone: {
        type: String
    },
    sellerEmail: {
        type: String
    }
});

module.exports = mongoose.model('Car', carSchema); 