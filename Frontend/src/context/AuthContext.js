import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Configure axios
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Add request interceptor to include token
axios.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            // Try admin login first
            try {
                const adminResponse = await axios.post('/api/auth/login', { email, password });
                const adminData = adminResponse.data;
                
                if (adminData.success) {
                    const adminUserData = {
                        ...adminData.user,
                        token: adminData.token,
                        role: adminData.user.isAdmin ? 'admin user' : 'user',
                        isSuperAdmin: adminData.user.isSuperAdmin || false
                    };
                    console.log('Admin login data:', adminUserData);
                    setCurrentUser(adminUserData);
                    localStorage.setItem('user', JSON.stringify(adminUserData));
                    return adminUserData;
                }
            } catch (adminError) {
                console.error('Admin login attempt failed:', adminError);
                throw new Error(adminError.response?.data?.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    // Regular user signup function
    const signup = async (email, password, name) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/signup', { email, password, name });
            const userData = response.data.user;
            
            // Set default role as 'user' for new signups
            userData.role = 'user';
            
            setCurrentUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    // Admin signup function
    const adminSignup = async (formData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/admin/signup', formData);
            return response.data;
        } catch (error) {
            console.error('Admin signup error:', error);
            throw new Error(error.response?.data?.message || 'Failed to create admin account');
        } finally {
            setLoading(false);
        }
    };

    // Verify admin email
    const verifyAdminEmail = async (token) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/verify', { token });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to verify email');
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        currentUser,
        login,
        signup,
        adminSignup,
        verifyAdminEmail,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 