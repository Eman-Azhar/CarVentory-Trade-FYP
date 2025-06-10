import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OffersManager from './OffersManager';
import ImageGallery from './ImageGallery';
import CarDetails from './CarDetails';
import './Auth.css';

const UserProfile = () => {
    const [userAds, setUserAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adCount, setAdCount] = useState(0);
    const [user, setUser] = useState(null);
    const [editingAd, setEditingAd] = useState(null);
    const [activeTab, setActiveTab] = useState('ads');
    const [viewingAd, setViewingAd] = useState(null);
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
            await axios.put(`http://localhost:5000/api/cars/${editingAd._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
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

    const getImageUrl = (url) => {
        if (!url) return '/default-car.jpg';
        return url.startsWith('http') ? url : `http://localhost:5000${url}`;
    };

    const renderMyAds = () => {
        if (loading) return <div className="loading">Loading your advertisements...</div>;

        if (userAds.length === 0) {
            return (
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
            );
        }

        return (
            <div className="user-ads-grid">
                {userAds.map((ad) => (
                    <div key={ad._id} className="car-ad-card">
                        {editingAd && editingAd._id === ad._id ? (
                            <div className="edit-ad-form">
                                <h3>Edit Advertisement</h3>
                                <form onSubmit={handleSubmitEdit}>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Make</label>
                                        <input type="text" name="make" value={formData.make} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Model</label>
                                        <input type="text" name="model" value={formData.model} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Year</label>
                                        <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (PKR)</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="save-btn">Save</button>
                                        <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div className="car-ad-image-wrapper">
                                    <ImageGallery images={ad.imageUrls} defaultImage="/default-car.jpg" />
                                </div>
                                <div className="car-ad-info">
                                    <h3 className="car-ad-title">{ad.title}</h3>
                                    <div className="car-ad-price">PKR {ad.price.toLocaleString()}</div>
                                    <div className="car-ad-meta">{ad.make} {ad.model} - {ad.year}</div>
                                    <div className="car-ad-description">{ad.description}</div>
                                    <div className="ad-actions">
                                        <button onClick={() => handleEditClick(ad)}>Edit</button>
                                        <button onClick={() => handleDeleteAd(ad._id)}>Delete</button>
                                        <button onClick={() => setViewingAd(ad)}>View</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="luxury-login-container">
            <nav className="main-nav">
                <div className="nav-logo">
                    <img src="/car-logo.png" alt="CarVentory Trade Logo" className="nav-logo-img" />
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

            <div className="branding-section">
                <div className="branding-content">
                    <div className="logo-container">
                        <img src="/car-logo.png" alt="CarVentory Trade Logo" className="car-logo" />
                    </div>
                    <h1 className="luxury-logo">CarVentory Trade</h1>
                    <p className="luxury-tagline">Your Profile</p>
                </div>
            </div>

            <div className="profile-section">
                {user && (
                    <div className="profile-info">
                        <h2>Welcome, {user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Ad Quota: {adCount}/5 ads posted</p>
                        {adCount >= 5 && <p className="quota-message">You have reached the maximum limit of 5 ads</p>}
                    </div>
                )}
            </div>

            <div className="profile-tabs">
                <button className={activeTab === 'ads' ? 'active' : ''} onClick={() => setActiveTab('ads')}>My Advertisements</button>
                <button className={activeTab === 'offers' ? 'active' : ''} onClick={() => setActiveTab('offers')}>Offers</button>
            </div>

            <div className="tab-content">
                {error && <div className="error-message">{error}</div>}
                {activeTab === 'ads' ? (
                    <div className="user-ads-section">
                        <h2>My Advertisements</h2>
                        {renderMyAds()}
                        {viewingAd && (
                            <div className="modal-overlay">
                                <div className="modal-box">
                                    <CarDetails car={viewingAd} onClose={() => setViewingAd(null)} />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="user-offers-section">
                        <OffersManager />
                    </div>
                )}
            </div>

            <footer className="login-footer">
                <div className="footer-content">
                    <p>© 2025 CarVentory</p>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <span>|</span>
                        <a href="#">About</a>
                        <span>|</span>
                        <a href="#">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserProfile;
