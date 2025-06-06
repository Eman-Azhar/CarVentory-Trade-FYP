import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login...');
            
            // Try admin login first
            let response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            let data = await response.json();
            console.log('Admin login response:', data);

            if (data.success) {
                // Store admin data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    ...data.admin,
                    token: data.token
                }));
                
                // Navigate to admin dashboard
                navigate('/admin-dashboard');
                return;
            }
            
            // If admin login fails, try regular user login
            console.log('Admin login failed, trying user login...');
            response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            data = await response.json();
            console.log('User login response:', data);

            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    ...data.user,
                    token: data.token
                }));
                
                // Navigate to user dashboard
                navigate('/user-dashboard');
                return;
            }
            
            throw new Error(data.message || 'Invalid credentials');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
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
                    <button className="nav-link">Home</button>
                    <button className="nav-link">About Us</button>
                    <button className="nav-link">Contact</button>
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
                    <p className="luxury-tagline">Manage Your Dealership With Style</p>
                </div>
            </div>

            {/* Login Form Section */}
            <div className="login-section">
                <div className="login-form-wrapper">
                    <h2 className="form-title">Log In</h2>
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`submit-button ${loading ? 'loading' : ''}`}
                        >
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : 'Login'}
                        </button>
                    </form>
                    
                    <p className="signup-link">
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/signup')} className="link">
                            Sign Up
                        </span>
                    </p>
                    <p className="signup-link">
                        Sign up as Admin?{' '}
                        <span onClick={() => navigate('/admin/signup')} className="link">
                            Admin Signup
                        </span>
                    </p>
                </div>
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

export default Login; 