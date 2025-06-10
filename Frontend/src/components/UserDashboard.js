import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import CarDetails from './CarDetails';
import ImageGallery from './ImageGallery';

const UserDashboard = () => {
    const [carAds, setCarAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        const fetchCarAds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cars');
                console.log("API Response:", response.data);
                // Check image URLs in the response
                if (response.data.length > 0) {
                    console.log("First car image URLs:", response.data[0].imageUrls);
                }
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

    // Helper to get unique keywords from carAds
    const getKeywords = (ads) => {
        const keywords = new Set();
        ads.forEach(ad => {
            if (ad.title) keywords.add(ad.title);
            if (ad.make) keywords.add(ad.make);
            if (ad.model) keywords.add(ad.model);
            if (ad.year) keywords.add(String(ad.year));
            if (ad.description) {
                ad.description.split(/\s+/).forEach(word => {
                    if (word.length > 2) keywords.add(word);
                });
            }
        });
        return Array.from(keywords);
    };

    useEffect(() => {
        if (!searchTerm) {
            setSuggestions([]);
            setActiveSuggestion(-1);
            return;
        }
        const lower = searchTerm.toLowerCase();
        let keywords = [];
        carAds.forEach(ad => {
            if (ad.title) keywords.push(ad.title);
            if (ad.make) keywords.push(ad.make);
            if (ad.model) keywords.push(ad.model);
            if (ad.year) keywords.push(String(ad.year));
            if (ad.price) keywords.push(String(ad.price));
            if (ad.description) {
                ad.description.split(/\s+/).forEach(word => {
                    if (word.length > 2) keywords.push(word);
                });
            }
        });
        // Remove duplicates and filter by search term
        const uniqueKeywords = Array.from(new Set(keywords));
        const filtered = uniqueKeywords.filter(k => k && k.toLowerCase().includes(lower));
        setSuggestions(filtered.slice(0, 8));
        setActiveSuggestion(-1);
    }, [searchTerm, carAds]);

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        setActiveSuggestion(-1);
    };

    const handleInputKeyDown = (e) => {
        if (!suggestions.length) return;
        if (e.key === 'ArrowDown') {
            setActiveSuggestion(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            setActiveSuggestion(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            if (activeSuggestion >= 0) {
                setSearchTerm(suggestions[activeSuggestion]);
                setSuggestions([]);
                setActiveSuggestion(-1);
            }
        }
    };

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

    const handleCompare = () => {
        navigate('/compare-cars');
    };

    // Function to get full image URL
    const getImageUrl = (url) => {
        if (!url) return '/default-car.jpg';
        return url.startsWith('http') ? url : `http://localhost:5000${url}`;
    };

    // Filter car ads based on search query
    let filteredCarAds = carAds.filter(ad => {
        const searchLower = searchTerm.toLowerCase();
        return (
            ad.title.toLowerCase().includes(searchLower) ||
            ad.make.toLowerCase().includes(searchLower) ||
            ad.model.toLowerCase().includes(searchLower) ||
            ad.description.toLowerCase().includes(searchLower) ||
            ad.year.toString().includes(searchLower) ||
            ad.price.toString().includes(searchLower)
        );
    });

    // Sorting logic
    if (sortOption === "priceLowHigh") {
        filteredCarAds = filteredCarAds.slice().sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
        filteredCarAds = filteredCarAds.slice().sort((a, b) => b.price - a.price);
    } else if (sortOption === "newCars") {
        filteredCarAds = filteredCarAds.slice().sort((a, b) => b.year - a.year);
    } else if (sortOption === "usedCars") {
        filteredCarAds = filteredCarAds.filter(ad => ad.description && ad.description.toLowerCase().includes('used car'));
    }

    return (
        <div className="luxury-login-container">
            {selectedCar ? (
                <CarDetails car={selectedCar} onClose={handleCloseDetails} />
            ) : (
                <>
                    <nav className="main-nav">
                        <div className="nav-logo">
                            <img src="/car-logo.png" alt="CarVentory Trade Logo" className="nav-logo-img" />
                        </div>
                        <div className="nav-links" style={{ alignItems: 'center', gap: '1.5rem' }}>
                            {/* Search bar and suggestions dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', position: 'relative', minWidth: 340, background: 'rgba(255,255,255,0.97)', borderRadius: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2px 10px 2px 8px', height: 44 }}>
                                {/* Search icon */}
                                <span style={{ color: '#888', fontSize: 20, marginRight: 6, marginLeft: 2, display: 'flex', alignItems: 'center' }}>🔍</span>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search cars..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    autoComplete="off"
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: '1.08rem',
                                        padding: '8px 8px 8px 0',
                                        minWidth: 120,
                                        color: '#222',
                                        height: 36,
                                        flex: 1
                                    }}
                                />
                                {/* Sort dropdown (no label) */}
                                <select
                                    value={sortOption}
                                    onChange={e => setSortOption(e.target.value)}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: '1.05rem',
                                        color: '#222',
                                        cursor: 'pointer',
                                        height: 36,
                                        borderRadius: 16,
                                        padding: '6px 10px',
                                        fontWeight: 500,
                                        minWidth: 150,
                                        maxWidth: 200,
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <option value="default">All Cars</option>
                                    <option value="priceLowHigh">Price: Low to High</option>
                                    <option value="priceHighLow">Price: High to Low</option>
                                    <option value="newCars">New Cars</option>
                                    <option value="usedCars">Used Cars</option>
                                </select>
                            </div>
                            {/* End Search Bar */}
                            <button className="nav-link">Home</button>
                            <button className="nav-link" onClick={() => navigate('/post-ad')}>Post Ad</button>
                            <button className="nav-link" onClick={() => navigate('/user-profile')}>My Profile</button>
                            <button className="nav-link" onClick={handleCompare}>Compare Cars</button>
                            <button className="nav-link">About Us</button>
                            <button className="nav-link">Contact</button>
                            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </nav>

                    <div className="branding-section">
                        <div className="branding-content">
                            <div className="logo-container">
                                <img src="/car-logo.png" alt="CarVentory Trade Logo" className="car-logo" />
                            </div>
                            <h1 className="luxury-logo">CarVentory Trade</h1>
                            <p className="luxury-tagline">Discover Your Perfect Ride</p>
                        </div>
                    </div>

                    {/* Show search results info below nav, above car-ads-section */}
                    {searchTerm && (
                                <div className="search-results-info">
                            Found {filteredCarAds.length} results for "{searchTerm}"
                                    {filteredCarAds.length === 0 && (
                                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            )}

                    <div className="car-ads-section">
                        {error && <div className="error-message">{error}</div>}
                        {loading ? (
                            <div className="loading">Loading car advertisements...</div>
                        ) : filteredCarAds.length === 0 ? (
                            <div className="no-ads">
                                {searchTerm ? `No cars found matching "${searchTerm}"` : "No car advertisements available"}
                            </div>
                        ) : (
                            <div className="car-ads-grid">
                                {filteredCarAds.map((ad) => {
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
                                                <button className="view-details-btn" onClick={() => handleViewDetails(ad)}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

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
