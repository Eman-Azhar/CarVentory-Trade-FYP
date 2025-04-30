import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isAdminSignup, setIsAdminSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        phoneNumber: '',
        cnicNumber: '',
        showroomName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login, signup, adminSignup } = useAuth();

    // Validation functions
    const validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(name);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    // Phone number validation
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(phoneNumber);
    };

    // CNIC masking function
    const formatCNIC = (value) => {
        // Remove all non-digit characters
        const numbers = value.replace(/\D/g, '');
        
        // Limit to 13 digits
        const limitedNumbers = numbers.slice(0, 13);
        
        // Add dashes at correct positions
        if (limitedNumbers.length <= 5) {
            return limitedNumbers;
        } else if (limitedNumbers.length <= 12) {
            return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
        } else {
            return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5, 12)}-${limitedNumbers.slice(12)}`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validate name field as user types
        if (name === 'name' && value && !validateName(value)) {
            return; // Don't update if invalid
        }

        // Handle phone number input
        if (name === 'phoneNumber') {
            // Remove all non-numeric characters
            const numbers = value.replace(/\D/g, '');
            // Limit to 11 digits
            const limitedNumbers = numbers.slice(0, 11);
            setFormData(prev => ({
                ...prev,
                [name]: limitedNumbers
            }));
            return;
        }

        // Handle CNIC input
        if (name === 'cnicNumber') {
            const formattedCNIC = formatCNIC(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedCNIC
            }));
            return;
        }
        
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
            if (isLogin) {
                const userData = await login(formData.email, formData.password);
                console.log('Login response:', userData);
                
                if (userData) {
                    if (userData.isSuperAdmin) {
                        console.log('Redirecting super admin to admin dashboard');
                        navigate('/admin-dashboard');
                    }
                    else if (userData.role === 'admin user') {
                        console.log('Redirecting admin to admin dashboard');
                        navigate('/admin-dashboard');
                    }
                    else {
                        console.log('Redirecting user to user dashboard');
                        navigate('/user-dashboard');
                    }
                } else {
                    throw new Error('Invalid response from server');
                }
            } else {
                // Validate name
                if (!validateName(formData.name)) {
                    throw new Error('Name should contain only alphabets and spaces');
                }

                // Validate password
                if (!validatePassword(formData.password)) {
                    throw new Error('Password must be at least 8 characters long and contain at least one letter, one number, and one special character');
                }

                // Validate phone number
                if (isAdminSignup && !validatePhoneNumber(formData.phoneNumber)) {
                    throw new Error('Phone number must be exactly 11 digits');
                }

                // Validate CNIC format
                const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
                if (isAdminSignup && !cnicRegex.test(formData.cnicNumber)) {
                    throw new Error('CNIC must be in the format: #####-#######-#');
                }

                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                if (isAdminSignup) {
                    await adminSignup(formData);
                    setMessage('Verification link sent to email. Please verify to complete registration.');
                } else {
                    await signup(formData.email, formData.password, formData.name);
                    setMessage('Account created successfully! Please login.');
                    setIsLogin(true);
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = (e, type) => {
        e.preventDefault();
        if (type === 'admin') {
            setIsLogin(false);
            setIsAdminSignup(true);
        } else {
            setIsAdminSignup(false);
            setIsLogin(!isLogin);
        }
        setError('');
        setMessage('');
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
            phoneNumber: '',
            cnicNumber: '',
            showroomName: ''
        });
    };

    const getFormTitle = () => {
        if (isLogin) return 'Log In';
        if (isAdminSignup) return 'Admin Registration';
        return 'Create Account';
    };

    return (
        <div className="luxury-login-container">
            {/* Navigation Bar */}
            <nav className="main-nav">
                <div className="nav-logo">
                    <img src="/car-logo.png" alt="CarVentory Logo" className="nav-logo-img" />
                </div>
                <div className="nav-links">
                    <button className="nav-link">Home</button>
                    <button className="nav-link">About</button>
                    <button className="nav-link">Contact</button>
                </div>
            </nav>

            {/* Branding Section */}
            <section className="branding-section">
                <div className="branding-content">
                    <div className="logo-container">
                        <img src="/car-logo.png" alt="Luxury Car Logo" className="car-logo" />
                    </div>
                    <h1 className="luxury-logo">CarVentory Trade</h1>
                    <p className="luxury-tagline">Your Gateway to Luxury Automotive Excellence</p>
                </div>
            </section>

            {/* Form Section */}
            <section className="form-container">
                <div className="form-wrapper">
                    <h2 className="form-title">{getFormTitle()}</h2>
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
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
                        )}
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
                        {!isLogin && (
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
                        )}
                        {isAdminSignup && (
                            <>
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
                            </>
                        )}
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner" />
                            ) : (
                                isLogin ? 'Login' : (isAdminSignup ? 'Register as Admin' : 'Sign Up')
                            )}
                        </button>
                    </form>
                    <div className="form-switch">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <a href="#" onClick={(e) => toggleForm(e, 'user')}>Sign Up</a>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <a href="#" onClick={(e) => toggleForm(e, 'user')}>Login</a>
                            </>
                        )}
                        <br />
                        {!isAdminSignup && (
                            <>
                                Sign up as Admin?{' '}
                                <a href="#" onClick={(e) => toggleForm(e, 'admin')}>Admin Signup</a>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="login-footer">
                <div className="footer-content">
                    <p className="copyright">
                        © 2024 CarVentory Trade. All rights reserved.
                    </p>
                    <div className="footer-links">
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <span className="link-separator">|</span>
                        <a href="#" className="footer-link">Terms of Service</a>
                        <span className="link-separator">|</span>
                        <a href="#" className="footer-link">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Auth; 