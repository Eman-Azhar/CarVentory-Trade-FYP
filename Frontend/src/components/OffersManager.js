import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

const OffersManager = () => {
    const [receivedOffers, setReceivedOffers] = useState([]);
    const [sentOffers, setSentOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('received');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            return;
        }
        
        setUser(userData);
        fetchOffers(userData);
    }, []);

    const fetchOffers = async (userData) => {
        setLoading(true);
        setError('');
        
        try {
            // Fetch offers received (as a seller)
            const receivedResponse = await axios.get(`http://localhost:5000/api/offers/received/${userData._id}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            
            // Fetch offers sent (as a buyer)
            const sentResponse = await axios.get(`http://localhost:5000/api/offers/sent/${userData._id}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            
            setReceivedOffers(receivedResponse.data);
            setSentOffers(sentResponse.data);
        } catch (err) {
            setError('Failed to fetch offers');
            console.error('Error fetching offers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        if (!window.confirm('Are you sure you want to accept this offer?')) return;
        
        try {
            await axios.put(`http://localhost:5000/api/offers/${offerId}/accept`, {}, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            
            // Update the offer status in the state
            setReceivedOffers(prevOffers => 
                prevOffers.map(offer => 
                    offer._id === offerId 
                        ? { ...offer, status: 'accepted' } 
                        : offer
                )
            );
            
        } catch (err) {
            setError('Failed to accept offer');
            console.error('Error accepting offer:', err);
        }
    };

    const handleRejectOffer = async (offerId) => {
        if (!window.confirm('Are you sure you want to reject this offer?')) return;
        
        try {
            await axios.put(`http://localhost:5000/api/offers/${offerId}/reject`, {}, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            
            // Update the offer status in the state
            setReceivedOffers(prevOffers => 
                prevOffers.map(offer => 
                    offer._id === offerId 
                        ? { ...offer, status: 'rejected' } 
                        : offer
                )
            );
            
        } catch (err) {
            setError('Failed to reject offer');
            console.error('Error rejecting offer:', err);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted':
                return 'status-badge accepted';
            case 'rejected':
                return 'status-badge rejected';
            case 'pending':
            default:
                return 'status-badge pending';
        }
    };

    const renderOffersList = (offers, isSent = false) => {
        if (loading) {
            return <div className="loading">Loading offers...</div>;
        }
        
        if (offers.length === 0) {
            return (
                <div className="no-offers">
                    {isSent 
                        ? "You haven't made any offers yet."
                        : "You haven't received any offers yet."
                    }
                </div>
            );
        }
        
        return (
            <div className="offers-list">
                {offers.map(offer => (
                    <div key={offer._id} className="offer-card">
                        <div className="offer-header">
                            <span className={getStatusBadgeClass(offer.status)}>
                                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                            </span>
                        </div>
                        
                        <div className="offer-car-details">
                            <h3>{offer.carTitle}</h3>
                            <p className="car-specs">{offer.carMake} {offer.carModel} - {offer.carYear}</p>
                            <p className="listing-price">Listed Price: PKR {offer.carPrice.toLocaleString()}</p>
                        </div>
                        
                        <div className="offer-details">
                            <p className="offer-amount">
                                <strong>Offer Amount:</strong> PKR {offer.offerAmount.toLocaleString()}
                            </p>
                            {isSent ? (
                                <p className="seller-info">
                                    <strong>Seller:</strong> Car Owner
                                </p>
                            ) : (
                                <p className="buyer-info">
                                    <strong>From:</strong> {offer.buyerName} ({offer.buyerEmail})
                                </p>
                            )}
                            {offer.message && (
                                <div className="offer-message">
                                    <strong>Message:</strong>
                                    <p>{offer.message}</p>
                                </div>
                            )}
                        </div>
                        
                        {!isSent && offer.status === 'pending' && (
                            <div className="offer-actions">
                                <button 
                                    className="accept-btn"
                                    onClick={() => handleAcceptOffer(offer._id)}
                                >
                                    Accept
                                </button>
                                <button 
                                    className="reject-btn"
                                    onClick={() => handleRejectOffer(offer._id)}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="offers-manager">
            <h2>Manage Offers</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="offers-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
                    onClick={() => setActiveTab('received')}
                >
                    Offers Received ({receivedOffers.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sent')}
                >
                    Offers Sent ({sentOffers.length})
                </button>
            </div>
            
            <div className="offers-content">
                {activeTab === 'received' 
                    ? renderOffersList(receivedOffers) 
                    : renderOffersList(sentOffers, true)
                }
            </div>
        </div>
    );
};

export default OffersManager; 