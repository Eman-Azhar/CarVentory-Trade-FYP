import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const UserProfile = () => {
    const [userAds, setUserAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adCount, setAdCount] = useState(0);
    const [user, setUser] = useState(null);
    const [editingAd, setEditingAd] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        year: '',
        price: '',
        description: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);

        const fetchUserAds = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cars/user/${userData._id}`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                setUserAds(response.data);
                setAdCount(response.data.length);
            } catch (err) {
                setError('Failed to fetch your advertisements');
                console.error('Error fetching user ads:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAds();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDeleteAd = async (adId) => {
        if (window.confirm('Are you sure you want to delete this advertisement?')) {
            try {
                await axios.delete(`http://localhost:5000/api/cars/${adId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setUserAds(prevAds => prevAds.filter(ad => ad._id !== adId));
                setAdCount(prevCount => prevCount - 1);
            } catch (err) {
                setError('Failed to delete advertisement');
                console.error('Error deleting ad:', err);
            }
        }
    };

    const handleEditClick = (ad) => {
        setEditingAd(ad);
        setFormData({
            title: ad.title,
            make: ad.make,
            model: ad.model,
            year: ad.year,
            price: ad.price,
            description: ad.description,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`http://localhost:5000/api/cars/${editingAd._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            
            // Update the ads list with edited ad
            setUserAds(prevAds => 
                prevAds.map(ad => 
                    ad._id === editingAd._id ? {...ad, ...formData} : ad
                )
            );
            
            setEditingAd(null);
        } catch (err) {
            setError('Failed to update advertisement');
            console.error('Error updating ad:', err);
        }
    };

    const handleCancelEdit = () => {
        setEditingAd(null);
    };

    return (
        <div className="luxury-login-container">
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
                    <button className="nav-link" onClick={() => navigate('/compare-cars')}>Compare Cars</button>
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
                    <p className="luxury-tagline">Your Profile</p>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="profile-section">
                {user && (
                    <div className="profile-info">
                        <h2>Welcome, {user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Ad Quota: {adCount}/5 ads posted</p>
                        {adCount >= 5 && (
                            <p className="quota-message">You have reached the maximum limit of 5 ads</p>
                        )}
                    </div>
                )}
            </div>

            {/* User Ads Section */}
            <div className="user-ads-section">
                <h2>My Advertisements</h2>
                {error && <div className="error-message">{error}</div>}
                
                {loading ? (
                    <div className="loading">Loading your advertisements...</div>
                ) : userAds.length === 0 ? (
                    <div className="no-ads">
                        <p>You haven't posted any advertisements yet.</p>
                        <button 
                            className="post-ad-btn"
                            onClick={() => navigate('/post-ad')}
                            disabled={adCount >= 5}
                        >
                            Post Your First Ad
                        </button>
                    </div>
                ) : (
                    <div className="user-ads-grid">
                        {userAds.map((ad) => (
                            <div key={ad._id} className="user-ad-card">
                                {editingAd && editingAd._id === ad._id ? (
                                    <div className="edit-ad-form">
                                        <h3>Edit Advertisement</h3>
                                        <form onSubmit={handleSubmitEdit}>
                                            <div className="form-group">
                                                <label htmlFor="title">Title</label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="make">Make</label>
                                                <input
                                                    type="text"
                                                    id="make"
                                                    name="make"
                                                    value={formData.make}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="model">Model</label>
                                                <input
                                                    type="text"
                                                    id="model"
                                                    name="model"
                                                    value={formData.model}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="year">Year</label>
                                                <input
                                                    type="number"
                                                    id="year"
                                                    name="year"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="price">Price (PKR)</label>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                    rows="4"
                                                    className="form-textarea"
                                                />
                                            </div>
                                            <div className="form-actions">
                                                <button type="submit" className="save-btn">Save Changes</button>
                                                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <>
                                        <img 
                                            src={ad.imageUrls && ad.imageUrls.length > 0 ? ad.imageUrls[0] : '/default-car.jpg'} 
                                            alt={`${ad.make} ${ad.model}`} 
                                            className="car-image"
                                        />
                                        <div className="car-details">
                                            <h3>{ad.title}</h3>
                                            <p className="car-price">PKR {ad.price.toLocaleString()}</p>
                                            <p className="car-model">{ad.make} {ad.model} - {ad.year}</p>
                                            <p className="car-description">{ad.description}</p>
                                            <div className="ad-actions">
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => handleEditClick(ad)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteAd(ad._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
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
        </div>
    );
};

export default UserProfile; 