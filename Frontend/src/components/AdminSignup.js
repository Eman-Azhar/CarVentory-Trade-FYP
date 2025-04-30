import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Auth.css';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        cnicNumber: '',
        showroomName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { adminSignup } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            await adminSignup(formData);
            setMessage('Verification link sent to email. Please verify to complete registration.');
            
            // Clear form after successful submission
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phoneNumber: '',
                cnicNumber: '',
                showroomName: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <h2 className="form-title">Admin Registration</h2>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cnicNumber">CNIC Number</label>
                    <input
                        type="text"
                        id="cnicNumber"
                        name="cnicNumber"
                        value={formData.cnicNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter your CNIC number"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="showroomName">Showroom Name</label>
                    <input
                        type="text"
                        id="showroomName"
                        name="showroomName"
                        value={formData.showroomName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your showroom name"
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? (
                        <span className="loading-spinner" />
                    ) : (
                        'Register as Admin'
                    )}
                </button>
            </form>
            <div className="form-switch">
                Already have an account?{' '}
                <a href="#" onClick={() => navigate('/login')}>Login</a>
            </div>
        </div>
    );
};

export default AdminSignup; 