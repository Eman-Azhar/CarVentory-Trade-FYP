import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const CarDetails = ({ car, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === car.imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? car.imageUrls.length - 1 : prev - 1
        );
    };

    // Function to get full image URL
    const getImageUrl = (url) => {
        return `http://localhost:5000${url}`;
    };

    return (
        <div className="car-details-modal">
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
                        <button className="nav-link">About Us</button>
                        <button className="nav-link">Contact</button>
                        <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </nav>

                <div className="car-details-main">
                    <div className="car-images-section">
                        <div className="car-image-container">
                            <img 
                                src={getImageUrl(car.imageUrls[currentImageIndex])} 
                                alt={`${car.make} ${car.model}`} 
                                className="car-detail-image"
                            />
                            {car.imageUrls.length > 1 && (
                                <>
                                    <button className="image-nav-btn prev" onClick={prevImage}>❮</button>
                                    <button className="image-nav-btn next" onClick={nextImage}>❯</button>
                                </>
                            )}
                        </div>
                        {car.imageUrls.length > 1 && (
                            <div className="image-thumbnails">
                                {car.imageUrls.map((url, index) => (
                                    <img 
                                        key={index}
                                        src={getImageUrl(url)}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
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
                        <button className="close-button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails; 