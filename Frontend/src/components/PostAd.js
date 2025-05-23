import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const PostAd = () => {
    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        year: '',
        price: '',
        description: '',
        city: '',
        mileage: '',
        transmission: '',
        color: '',
        fuelType: '',
        engineType: '',
        condition: '',
        sellerName: '',
        sellerPhone: '',
        sellerEmail: '',
    });
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [adCount, setAdCount] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);

        const checkUserAds = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cars/user/${userData._id}`, {
                    headers: { Authorization: `Bearer ${userData.token}` }
                });
                setAdCount(response.data.length);

                if (response.data.length >= 5) {
                    setError('You have reached the maximum limit of 5 ads');
                }
            } catch (err) {
                console.error('Error checking user ads:', err);
            }
        };

        checkUserAds();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageError('');

        if (files.length === 0) {
            setImageError('Please select at least 1 image');
            return;
        }

        if (images.length + files.length > 4) {
            setImageError('You can only upload up to 4 images in total');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const invalidFile = files.find(file => !validTypes.includes(file.type));
        if (invalidFile) {
            setImageError('Only JPG, JPEG, PNG, and WEBP images are allowed');
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const handleDeleteImage = (indexToDelete) => {
        setImages(prev => {
            const newImages = prev.filter((_, index) => index !== indexToDelete);
            URL.revokeObjectURL(prev[indexToDelete].preview);
            return newImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setImageError('');
        setLoading(true);

        if (adCount >= 5) {
            setError('You have reached the maximum limit of 5 ads');
            setLoading(false);
            return;
        }

        if (images.length === 0) {
            setImageError('Please select at least 1 image');
            setLoading(false);
            return;
        }

        try {
            if (!user || !user.token) {
                throw new Error('You must be logged in to post an advertisement');
            }

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            formDataToSend.append('userId', user._id);

            images.forEach(image => {
                formDataToSend.append('images', image.file);
            });

            await axios.post('http://localhost:5000/api/cars', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });

            navigate('/user-profile');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to post advertisement');
            console.error('Error posting car ad:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    React.useEffect(() => {
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);

    return (
        <div className="luxury-login-container">
            <nav className="main-nav">
                <div className="nav-logo">
                    <img src="/car-logo.png" alt="CarVentory Trade Logo" className="nav-logo-img" />
                </div>
                <div className="nav-links">
                    <button className="nav-link" onClick={() => navigate('/user-dashboard')}>Home</button>
                    <button className="nav-link" onClick={() => navigate('/user-profile')}>My Profile</button>
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
                    <p className="luxury-tagline">List Your Car For Sale</p>
                </div>
            </div>

            <section className="form-container">
                <div className="form-wrapper post-ad-wrapper">
                    <h2 className="form-title">Post Your Car Advertisement</h2>
                    {error && <div className="error-message">{error}</div>}

                    {adCount >= 5 ? (
                        <div className="limit-message">
                            <p>You have reached the maximum limit of 5 advertisements.</p>
                            <p>Please delete some existing ads before posting new ones.</p>
                            <button className="view-profile-btn" onClick={() => navigate('/user-profile')}>
                                Manage Your Ads
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form post-ad-form">
                            <div className="form-section">
                                <h3 className="section-title">Car Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="title">Advertisement Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter a catchy title for your ad"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="city">City Name</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your city"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="make">Car Make</label>
                                        <input
                                            type="text"
                                            id="make"
                                            name="make"
                                            value={formData.make}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Toyota, Honda, BMW"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="model">Car Model</label>
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Camry, Civic, 3 Series"
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
                                            placeholder="Enter car manufacturing year"
                                            min="1900"
                                            max={new Date().getFullYear()}
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
                                            placeholder="Enter price in PKR"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe your car's features, condition, and other details"
                                        rows="4"
                                        className="form-textarea"
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Car Specifications</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="mileage">Mileage (KM)</label>
                                        <input
                                            type="number"
                                            id="mileage"
                                            name="mileage"
                                            value={formData.mileage}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter car mileage"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="engineType">Engine Type (cc)</label>
                                        <input
                                            type="number"
                                            id="engineType"
                                            name="engineType"
                                            value={formData.engineType}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter engine capacity"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Transmission Type</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="transmission"
                                                    value="Manual"
                                                    checked={formData.transmission === 'Manual'}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                Manual
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="transmission"
                                                    value="Automatic"
                                                    checked={formData.transmission === 'Automatic'}
                                                    onChange={handleChange}
                                                />
                                                Automatic
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="color">Car Color</label>
                                        <select
                                            id="color"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            required
                                            className="form-select"
                                        >
                                            <option value="">Select Color</option>
                                            <option value="White">White</option>
                                            <option value="Black">Black</option>
                                            <option value="Silver">Silver</option>
                                            <option value="Gray">Gray</option>
                                            <option value="Red">Red</option>
                                            <option value="Blue">Blue</option>
                                            <option value="Green">Green</option>
                                            <option value="Yellow">Yellow</option>
                                            <option value="Brown">Brown</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Fuel Type</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="fuelType"
                                                    value="Petrol"
                                                    checked={formData.fuelType === 'Petrol'}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                Petrol
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="fuelType"
                                                    value="Diesel"
                                                    checked={formData.fuelType === 'Diesel'}
                                                    onChange={handleChange}
                                                />
                                                Diesel
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="fuelType"
                                                    value="CNG"
                                                    checked={formData.fuelType === 'CNG'}
                                                    onChange={handleChange}
                                                />
                                                CNG
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="fuelType"
                                                    value="Hybrid"
                                                    checked={formData.fuelType === 'Hybrid'}
                                                    onChange={handleChange}
                                                />
                                                Hybrid
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="fuelType"
                                                    value="Electric"
                                                    checked={formData.fuelType === 'Electric'}
                                                    onChange={handleChange}
                                                />
                                                Electric
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Car Condition</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="condition"
                                                    value="Brand New"
                                                    checked={formData.condition === 'Brand New'}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                Brand New
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="condition"
                                                    value="Used (Excellent)"
                                                    checked={formData.condition === 'Used (Excellent)'}
                                                    onChange={handleChange}
                                                />
                                                Used (Excellent)
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="condition"
                                                    value="Used (Good)"
                                                    checked={formData.condition === 'Used (Good)'}
                                                    onChange={handleChange}
                                                />
                                                Used (Good)
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="condition"
                                                    value="Needs Repair"
                                                    checked={formData.condition === 'Needs Repair'}
                                                    onChange={handleChange}
                                                />
                                                Needs Repair
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Car Photos</h3>
                                <div className="form-group">
                                    <label htmlFor="images">Upload Images (1-4 images)</label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        multiple
                                        className="form-file-input"
                                    />
                                    {imageError && <div className="error-message">{imageError}</div>}
                                    {images.length > 0 && (
                                        <div className="image-preview-container">
                                            <div className="main-preview">
                                                <img src={images[0].preview} alt="Main preview" className="main-preview-image" />
                                            </div>
                                            {images.length > 1 && (
                                                <div className="thumbnail-gallery">
                                                    {images.map((image, index) => (
                                                        <div key={index} className="thumbnail-container">
                                                            <img 
                                                                src={image.preview} 
                                                                alt={`Preview ${index + 1}`} 
                                                                className="thumbnail-image"
                                                            />
                                                            <button 
                                                                className="delete-image-btn"
                                                                onClick={() => handleDeleteImage(index)}
                                                                title="Delete image"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Seller Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="sellerName">Seller Name</label>
                                        <input
                                            type="text"
                                            id="sellerName"
                                            name="sellerName"
                                            value={formData.sellerName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="sellerPhone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="sellerPhone"
                                            name="sellerPhone"
                                            value={formData.sellerPhone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your phone number"
                                            pattern="[0-9]{11}"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="sellerEmail">Email Address</label>
                                        <input
                                            type="email"
                                            id="sellerEmail"
                                            name="sellerEmail"
                                            value={formData.sellerEmail}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn post-ad-btn" disabled={loading}>
                                    {loading ? 'Posting...' : 'Post Advertisement'}
                                </button>
                                <div className="ad-count-info">
                                    <p>You have posted {adCount} out of 5 allowed advertisements</p>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </section>

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

export default PostAd;