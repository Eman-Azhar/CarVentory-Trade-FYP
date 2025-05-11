import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import CarDetails from './CarDetails';

const UserDashboard = () => {
    const [carAds, setCarAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarAds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cars');
                setCarAds(response.data);
            } catch (err) {
                setError('Failed to fetch car advertisements');
                console.error('Error fetching car ads:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCarAds();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleViewDetails = (car) => {
        setSelectedCar(car);
    };

    const handleCloseDetails = () => {
        setSelectedCar(null);
    };

    return (
        <div className="luxury-login-container">
            {selectedCar ? (
                <CarDetails car={selectedCar} onClose={handleCloseDetails} />
            ) : (
                <>
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
                            <button className="nav-link">Home</button>
                            <button className="nav-link" onClick={() => navigate('/post-ad')}>Post Ad</button>
                            <button className="nav-link">About Us</button>
                            <button className="nav-link">Contact</button>
                            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </nav>

                    {/* Branding Section */}
                    <div className="branding-section">
                        <div className="branding-content">
                            <div className="logo-container">
                                <img 
                                    src="/car-logo.png" 
                                    alt="CarVentory Trade Logo" 
                                    className="car-logo"
                                />
                            </div>
                            <h1 className="luxury-logo">CarVentory Trade</h1>
                            <p className="luxury-tagline">Discover Your Perfect Ride</p>
                        </div>
                    </div>

                    {/* Car Ads Section */}
                    <div className="car-ads-section">
                        {error && <div className="error-message">{error}</div>}
                        {loading ? (
                            <div className="loading">Loading car advertisements...</div>
                        ) : carAds.length === 0 ? (
                            <div className="no-ads">No car advertisements available</div>
                        ) : (
                            <div className="car-ads-grid">
                                {carAds.map((ad) => {
                                    // Ensure image URL is absolute if needed
                                    let imageUrl = '/default-car.jpg';
                                    if (ad.imageUrls && ad.imageUrls.length > 0) {
                                        imageUrl = ad.imageUrls[0].startsWith('http')
                                            ? ad.imageUrls[0]
                                            : `http://localhost:5000${ad.imageUrls[0]}`;
                                    }
                                    return (
                                        <div key={ad._id} className="car-ad-card">
                                            <div className="car-ad-image-wrapper">
                                                <img 
                                                    src={imageUrl}
                                                    alt={`${ad.make} ${ad.model}`}
                                                    className="car-ad-image"
                                                    onError={e => { e.target.onerror = null; e.target.src = '/default-car.jpg'; }}
                                                />
                                            </div>
                                            <div className="car-ad-info">
                                                <h3 className="car-ad-title">{ad.title}</h3>
                                                <div className="car-ad-price">PKR {ad.price.toLocaleString()}</div>
                                                <div className="car-ad-meta">{ad.make} {ad.model} - {ad.year}</div>
                                                <div className="car-ad-description">{ad.description}</div>
                                                <button 
                                                    className="view-details-btn"
                                                    onClick={() => handleViewDetails(ad)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    <footer className="login-footer">
                        <div className="footer-content">
                            <p className="copyright">© 2025 CarVentory</p>
                            <div className="footer-links">
                                <a href="#" className="footer-link">Privacy Policy</a>
                                <span className="link-separator">|</span>
                                <a href="#" className="footer-link">About</a>
                                <span className="link-separator">|</span>
                                <a href="#" className="footer-link">Contact Us</a>
                            </div>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default UserDashboard; 