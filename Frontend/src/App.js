import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import UserProfile from './components/UserProfile';
import PostAd from './components/PostAd';
import CarComparison from './components/CarComparison';
import AboutUs from './components/AboutUs';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
        return <Navigate to="/login" />;
    }

    // Check if user is super admin
    if (user.isSuperAdmin) {
        return children;
    }

    // For regular admin and user roles
    const userRole = user.role || 'user';
    
    if (allowedRole && userRole !== allowedRole) {
        return <Navigate to={userRole === 'admin user' ? '/admin-dashboard' : '/user-dashboard'} />;
    }

    return children;
};

function App() {
    const [sortOption, setSortOption] = useState("default");

    return (
        <AuthProvider>
            <div className="App">
                <div className="car-background"></div>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Auth />} />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute allowedRole="admin user">
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user-dashboard"
                            element={
                                <ProtectedRoute allowedRole="user">
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user-profile"
                            element={
                                <ProtectedRoute allowedRole="user">
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/post-ad"
                            element={
                                <ProtectedRoute allowedRole="user">
                                    <PostAd />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/compare-cars"
                            element={
                                <ProtectedRoute allowedRole="user">
                                    <CarComparison />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/about"
                            element={<AboutUs />}
                        />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
