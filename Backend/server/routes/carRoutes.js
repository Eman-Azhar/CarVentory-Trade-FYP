const express = require('express');
const router = express.Router();
const Car = require('../models/carModel');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpg, jpeg, png, and webp files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get all car ads
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all car advertisements...');
        const cars = await Car.find().sort({ createdAt: -1 });
        console.log(`Found ${cars.length} car advertisements`);
        res.json(cars);
    } catch (error) {
        console.error('Error fetching car ads:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching car advertisements',
            error: error.message
        });
    }
});

// Create a new car advertisement
router.post('/', auth, (req, res, next) => {
    upload.array('images', 4)(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'Error uploading images',
                error: err.message
            });
        }

        try {
            const { title, make, model, year, price, description, mileage, transmission, color, fuelType, engineType, condition, sellerName, sellerPhone, sellerEmail } = req.body;
            
            // Handle image uploads
            let imageUrls = [];
            if (req.files && req.files.length > 0) {
                imageUrls = req.files.map(file => `/uploads/${file.filename}`);
            }

            const newCar = new Car({
                title,
                make,
                model,
                year,
                price,
                description,
                mileage,
                transmission,
                color,
                fuelType,
                engineType,
                condition,
                sellerName,
                sellerPhone,
                sellerEmail,
                imageUrls,
                userId: req.user.id
            });

            const savedCar = await newCar.save();
            
            res.status(201).json({
                success: true,
                message: 'Car advertisement created successfully',
                car: savedCar
            });
        } catch (error) {
            console.error('❌ Error creating car ad:', error); // 👈 ADD THIS LINE
        
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            res.status(400).json({
                success: false,
                message: 'Error creating car advertisement',
                error: error.message
            });
        }
        
    });
});

// Get car ad by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car advertisement not found'
            });
        }
        res.json(car);
    } catch (error) {
        console.error('Error fetching car ad:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching car advertisement',
            error: error.message
        });
    }
});

// Update car ad
router.put('/:id', auth, upload.array('images', 4), async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car advertisement not found'
            });
        }

        // Check if user owns this ad
        if (car.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this advertisement'
            });
        }

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // Delete old images
            car.imageUrls.forEach(url => {
                const filePath = path.join(__dirname, '..', '..', url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
            
            // Add new images
            req.body.imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Update car details
        Object.assign(car, req.body);
        const updatedCar = await car.save();
        res.json({
            success: true,
            message: 'Car advertisement updated successfully',
            car: updatedCar
        });
    } catch (error) {
        // Delete uploaded files if there's an error
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        console.error('Error updating car ad:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating car advertisement',
            error: error.message
        });
    }
});

// Delete car ad
router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car advertisement not found'
            });
        }

        // Check if user owns this ad
        if (car.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this advertisement'
            });
        }

        // Delete associated images
        car.imageUrls.forEach(url => {
            const filePath = path.join(__dirname, '..', '..', url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        await car.deleteOne();
        res.json({
            success: true,
            message: 'Car advertisement deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting car ad:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting car advertisement',
            error: error.message
        });
    }
});

module.exports = router; 