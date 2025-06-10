import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const BookTestDriveModal = ({ car, onClose }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("Seller email received:", car.sellerEmail);
    const [form, setForm] = useState({
        name: user?.name || '',
        location: '',
        datetime: '',
        description: '',
        email: user?.email || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);
        try {
            // Placeholder API call - to be implemented in backend
            await axios.post('http://localhost:5000/api/test-drive-request', {
                carId: car._id,
                sellerEmail: car.sellerEmail,
                ...form,
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="offer-modal">
            <div className="offer-content">
                <h2>Book Test Drive</h2>
                <div className="car-summary">
                    <h3>{car.title}</h3>
                    <p className="car-info">{car.make} {car.model} - {car.year}</p>
                    <p className="listing-price">Listed Price: PKR {car.price.toLocaleString()}</p>
                </div>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Your test drive request has been sent!</div>}
                {!success && (
                    <form onSubmit={handleSubmit} className="offer-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Test Drive Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter location"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="datetime">Test Drive Date and Time</label>
                            <input
                                type="datetime-local"
                                id="datetime"
                                name="datetime"
                                value={form.datetime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Add a note for the seller"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                readOnly
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
                                {loading ? 'Sending...' : 'Send Request'}
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

export default BookTestDriveModal; 