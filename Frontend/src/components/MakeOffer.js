import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const MakeOffer = ({ car, onClose, onOfferSubmitted }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [offerAmount, setOfferAmount] = useState('');
    const [message, setMessage] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const [buyerName, setBuyerName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        if (!user || !user.token) {
            setError('You must be logged in to make an offer');
            setLoading(false);
            return;
        }

        try {
            if (car.userId === user._id) {
                setError("You cannot make an offer on your own advertisement");
                setLoading(false);
                return;
            }

            const offerData = {
                carId: car._id,
                buyerId: user._id,
                sellerId: car.userId,
                offerAmount: parseFloat(offerAmount),
                message,
                buyerName,
                buyerPhone,
                buyerEmail: user.email,
                carTitle: car.title,
                carMake: car.make,
                carModel: car.model,
                carYear: car.year,
                carPrice: car.price,
                status: 'pending'
            };

            await axios.post('http://localhost:5000/api/offers', offerData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess(true);
            setTimeout(() => {
                if (onOfferSubmitted) onOfferSubmitted();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit offer');
            console.error('Error submitting offer:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="offer-modal">
            <div className="offer-content">
                <h2>Make an Offer</h2>
                <div className="car-summary">
                    <h3>{car.title}</h3>
                    <p className="car-info">{car.make} {car.model} - {car.year}</p>
                    <p className="listing-price">Listed Price: PKR {car.price.toLocaleString()}</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Your offer has been submitted successfully!</div>}

                {!success && (
                    <form onSubmit={handleSubmit} className="offer-form">
                        <div className="form-group">
                            <label htmlFor="buyerName">Your Name</label>
                            <input
                                type="text"
                                id="buyerName"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="buyerPhone">Your Phone Number</label>
                            <input
                                type="tel"
                                id="buyerPhone"
                                value={buyerPhone}
                                onChange={(e) => setBuyerPhone(e.target.value)}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="offerAmount">Your Offer (PKR)</label>
                            <input
                                type="number"
                                id="offerAmount"
                                value={offerAmount}
                                onChange={(e) => setOfferAmount(e.target.value)}
                                required
                                min="1"
                                step="1000"
                                placeholder="Enter your offer amount"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message (Optional)</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="3"
                                placeholder="Add a message to the seller"
                            />
                        </div>
                        <div className="offer-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                            <button 
                                type="submit" 
                                className="red-button"
                                disabled={loading}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    padding: '12px 20px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '48%',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit Offer'}
                            </button>
                            <button 
                                type="button" 
                                className="red-button"
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    padding: '12px 20px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '48%',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MakeOffer;
