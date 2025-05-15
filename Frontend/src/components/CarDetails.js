import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MakeOffer from './MakeOffer';
import ImageGallery from './ImageGallery';
import './Auth.css';

const CarDetails = ({ car, onClose }) => {
    const [showOfferForm, setShowOfferForm] = useState(false);
    const navigate = useNavigate();

    // Log image info for debugging
    React.useEffect(() => {
        console.log("Car details image URLs:", car.imageUrls);
        console.log("Car details image count:", car.imageUrls?.length);
    }, [car]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleMakeOffer = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
            alert('You must be logged in to make an offer');
            return;
        }
        
        // Check if the car belongs to the current user
        if (car.userId === user._id) {
            alert("You cannot make an offer on your own advertisement");
            return;
        }

        setShowOfferForm(true);
    };

    const handleCloseOfferForm = () => {
        setShowOfferForm(false);
    };

    return (
        <div className="car-details-modal">
            {showOfferForm ? (
                <MakeOffer 
                    car={car} 
                    onClose={handleCloseOfferForm} 
                    onOfferSubmitted={() => {
                        // Handle offer submitted
                    }}
                />
            ) : (
                <div className="car-details-content">
                    {/* Navigation Bar */}
                    <nav className="main-nav">
                        <div className="nav-logo">
                            <img 
                                src="/car-logo.png" 
                                alt="CarVentory Trade Logo" 
                                className="nav-logo-img"
                            />
                        </div>
                        <div className="nav-links">
                            <button className="nav-link" onClick={() => navigate('/user-dashboard')}>Home</button>
                            <button className="nav-link" onClick={() => navigate('/post-ad')}>Post Ad</button>
                            <button className="nav-link" onClick={() => navigate('/user-profile')}>My Profile</button>
                            <button className="nav-link">About Us</button>
                            <button className="nav-link">Contact</button>
                            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </nav>

                    <div className="car-details-main">
                        <div className="car-images-section">
                            <ImageGallery 
                                images={car.imageUrls} 
                                defaultImage="/default-car.jpg"
                            />
                        </div>

                        <div className="car-info-section">
                            <h2>{car.title}</h2>
                            <div className="car-price">PKR {car.price.toLocaleString()}</div>
                            <div className="car-specs">
                                <div className="spec-item">
                                    <span className="spec-label">Make:</span>
                                    <span className="spec-value">{car.make}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Model:</span>
                                    <span className="spec-value">{car.model}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Year:</span>
                                    <span className="spec-value">{car.year}</span>
                                </div>
                            </div>
                            <div className="car-description-full">
                                <h3>Description</h3>
                                <p>{car.description}</p>
                            </div>
                            <div className="car-actions">
                                <button className="make-offer-btn" onClick={handleMakeOffer}>
                                    Make an Offer
                                </button>
                                <button className="close-button" onClick={onClose}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetails; 