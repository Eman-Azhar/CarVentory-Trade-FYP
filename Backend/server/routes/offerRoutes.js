const express = require('express');
const router = express.Router();
const Offer = require('../models/offerModel');
const Car = require('../models/carModel');
const auth = require('../middleware/auth');

// Create a new offer
router.post('/', auth, async (req, res) => {
    try {
        const {
            carId, buyerId, sellerId, offerAmount, message,
            buyerName, buyerEmail, buyerPhone,
            carTitle, carMake, carModel, carYear, carPrice
        } = req.body;

        if (req.user._id.toString() === sellerId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot make an offer on your own advertisement'
            });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car advertisement not found'
            });
        }

        const newOffer = new Offer({
            carId,
            buyerId,
            sellerId,
            offerAmount,
            message,
            buyerName,
            buyerEmail,
            buyerPhone,
            carTitle,
            carMake,
            carModel,
            carYear,
            carPrice,
            status: 'pending'
        });

        const savedOffer = await newOffer.save();

        res.status(201).json({
            success: true,
            message: 'Offer submitted successfully',
            offer: savedOffer
        });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting offer',
            error: error.message
        });
    }
});

// Get offers received by a user (seller)
router.get('/received/:userId', auth, async (req, res) => {
    console.log("🔐 Authenticated User ID:", req.user._id.toString());
    console.log("📥 Requested Received Offers for:", req.params.userId.toString());

    if (req.user._id.toString() !== req.params.userId.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access these offers'
        });
    }

    try {
        const offers = await Offer.find({ sellerId: req.params.userId }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        console.error('Error fetching received offers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching received offers',
            error: error.message
        });
    }
});

// Get offers sent by a user (buyer)
router.get('/sent/:userId', auth, async (req, res) => {
    console.log("🔐 Authenticated User ID:", req.user._id.toString());
    console.log("📤 Requested Sent Offers for:", req.params.userId.toString());

    if (req.user._id.toString() !== req.params.userId.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access these offers'
        });
    }

    try {
        const offers = await Offer.find({ buyerId: req.params.userId }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        console.error('Error fetching sent offers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sent offers',
            error: error.message
        });
    }
});

// Accept an offer
router.put('/:offerId/accept', auth, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.offerId);
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        if (req.user._id.toString() !== offer.sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this offer'
            });
        }

        offer.status = 'accepted';
        const updatedOffer = await offer.save();

        res.json({
            success: true,
            message: 'Offer accepted successfully',
            offer: updatedOffer
        });
    } catch (error) {
        console.error('Error accepting offer:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting offer',
            error: error.message
        });
    }
});

// Reject an offer
router.put('/:offerId/reject', auth, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.offerId);
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        if (req.user._id.toString() !== offer.sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this offer'
            });
        }

        offer.status = 'rejected';
        const updatedOffer = await offer.save();

        res.json({
            success: true,
            message: 'Offer rejected successfully',
            offer: updatedOffer
        });
    } catch (error) {
        console.error('Error rejecting offer:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting offer',
            error: error.message
        });
    }
});

// Get all offers for a specific car (for seller)
router.get('/car/:carId', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car advertisement not found'
            });
        }

        if (req.user._id.toString() !== car.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view offers for this car'
            });
        }

        const offers = await Offer.find({ carId: req.params.carId }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        console.error('Error fetching offers for car:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching offers for car',
            error: error.message
        });
    }
});

module.exports = router;
