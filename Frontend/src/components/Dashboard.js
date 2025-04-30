import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { logout } = useAuth();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>CarVentory Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>
            <main className="dashboard-content">
                <div className="dashboard-sidebar">
                    <nav>
                        <ul>
                            <li>Overview</li>
                            <li>Inventory</li>
                            <li>Sales</li>
                            <li>Customers</li>
                            <li>Settings</li>
                        </ul>
                    </nav>
                </div>
                <div className="dashboard-main">
                    <h2>Welcome to your Dashboard</h2>
                    <p>This is where you'll manage your car inventory and sales.</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 