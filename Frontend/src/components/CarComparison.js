import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const CarComparison = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCar1, setSelectedCar1] = useState(null);
    const [selectedCar2, setSelectedCar2] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cars');
                setCars(response.data);
            } catch (err) {
                setError('Failed to fetch cars');
                console.error('Error fetching cars:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSelectCar1 = (car) => setSelectedCar1(car);
    const handleSelectCar2 = (car) => setSelectedCar2(car);
    const handleClearComparison = () => {
        setSelectedCar1(null);
        setSelectedCar2(null);
    };
    const getImageUrl = (url) => url ? (url.startsWith('http') ? url : `http://localhost:5000${url}`) : '/default-car.jpg';
    const compareValues = (v1, v2, higherIsBetter = true) => v1 === v2 ? null : (higherIsBetter ? (v1 > v2 ? 'car1' : 'car2') : (v1 < v2 ? 'car1' : 'car2'));

    // Recommendation logic
    const getRecommendation = () => {
        if (!selectedCar1 || !selectedCar2) return '';
        let rec = '';
        if (selectedCar1.price < selectedCar2.price) rec += `${selectedCar1.make} ${selectedCar1.model} is cheaper. `;
        else if (selectedCar2.price < selectedCar1.price) rec += `${selectedCar2.make} ${selectedCar2.model} is cheaper. `;
        if (selectedCar1.year > selectedCar2.year) rec += `${selectedCar1.make} ${selectedCar1.model} is newer. `;
        else if (selectedCar2.year > selectedCar1.year) rec += `${selectedCar2.make} ${selectedCar2.model} is newer. `;
        if (selectedCar1.mileage && selectedCar2.mileage) {
            if (selectedCar1.mileage < selectedCar2.mileage) rec += `${selectedCar1.make} ${selectedCar1.model} has lower mileage.`;
            else if (selectedCar2.mileage < selectedCar1.mileage) rec += `${selectedCar2.make} ${selectedCar2.model} has lower mileage.`;
        }
        return rec || 'Both cars are similar in key aspects.';
    };

    return (
        <div className="luxury-login-container">
            {/* Navigation Bar */}
            <nav className="main-nav">
                <div className="nav-logo">
                    <img src="/car-logo.png" alt="CarVentory Trade Logo" className="nav-logo-img" />
                </div>
                <div className="nav-links">
                    <button className="nav-link" onClick={() => navigate('/user-dashboard')}>Home</button>
                    <button className="nav-link" onClick={() => navigate('/post-ad')}>Post Ad</button>
                    <button className="nav-link" onClick={() => navigate('/about')}>About Us</button>
                    <button className="nav-link">Contact</button>
                    <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Comparison Section */}
            <div className="comparison-container" style={{ marginTop: 0, paddingTop: '90px' }}>
                <h1>Car Comparison Tool</h1>
                {error && <div className="error-message">{error}</div>}
                {loading ? (
                    <div className="loading">Loading cars...</div>
                ) : (
                    <div className="comparison-content">
                        <div className="car-selection">
                            {[1, 2].map(idx => (
                                <div className="selection-column" key={idx}>
                                    <h3>{idx === 1 ? 'Select First Car' : 'Select Second Car'}</h3>
                                    <select
                                        className="car-select"
                                        value={idx === 1 ? (selectedCar1 ? selectedCar1._id : '') : (selectedCar2 ? selectedCar2._id : '')}
                                        onChange={e => {
                                            const carId = e.target.value;
                                            const car = cars.find(c => c._id === carId);
                                            idx === 1 ? handleSelectCar1(car || null) : handleSelectCar2(car || null);
                                        }}
                                    >
                                        <option value="">Select a car</option>
                                        {cars.map(car => (
                                            <option key={car._id} value={car._id}>
                                                {car.make} {car.model} {car.year} - PKR {car.price.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        {(selectedCar1 || selectedCar2) && (
                            <button
                                className="clear-comparison-btn"
                                onClick={handleClearComparison}
                            >
                                Clear Comparison
                            </button>
                        )}
                        {!selectedCar1 && !selectedCar2 && (
                            <div className="comparison-instruction">
                                <p>Select two cars from the dropdown menus above to compare their specifications and features side by side.</p>
                                <div className="comparison-benefits">
                                    <ul>
                                        <li>Compare prices, models, and features at a glance</li>
                                        <li>Easily identify differences between similar vehicles</li>
                                        <li>Make informed decisions before purchasing</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {selectedCar1 && selectedCar2 && (
                            <div className="comparison-results">
                                <div className="comparison-table">
                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#222', background: '#fff' }}>
                                        <thead>
                                            <tr style={{ background: '#f5f7fa', color: '#1a237e' }}>
                                                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: '1.08rem' }}>Feature</th>
                                                <th style={{ padding: '12px 8px', fontWeight: 700 }}>{selectedCar1.make} {selectedCar1.model}</th>
                                                <th style={{ padding: '12px 8px', fontWeight: 700 }}>{selectedCar2.make} {selectedCar2.model}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                ['Image', (
                                                    <img
                                                        src={selectedCar1.imageUrls && selectedCar1.imageUrls.length > 0 ? getImageUrl(selectedCar1.imageUrls[0]) : '/default-car.jpg'}
                                                        alt={`${selectedCar1.make} ${selectedCar1.model}`}
                                                        className="comparison-image"
                                                        style={{ width: 110, height: 70, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #eee' }}
                                                    />
                                                ), (
                                                    <img
                                                        src={selectedCar2.imageUrls && selectedCar2.imageUrls.length > 0 ? getImageUrl(selectedCar2.imageUrls[0]) : '/default-car.jpg'}
                                                        alt={`${selectedCar2.make} ${selectedCar2.model}`}
                                                        className="comparison-image"
                                                        style={{ width: 110, height: 70, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #eee' }}
                                                    />
                                                )],
                                                ['Price', selectedCar1.price ? `PKR ${selectedCar1.price.toLocaleString()}` : 'N/A', selectedCar2.price ? `PKR ${selectedCar2.price.toLocaleString()}` : 'N/A'],
                                                ['Make', selectedCar1.make, selectedCar2.make],
                                                ['Model', selectedCar1.model, selectedCar2.model],
                                                ['Year', selectedCar1.year, selectedCar2.year],
                                                ['Mileage', selectedCar1.mileage ? `${selectedCar1.mileage} km` : 'N/A', selectedCar2.mileage ? `${selectedCar2.mileage} km` : 'N/A'],
                                                ['Transmission', selectedCar1.transmission || 'N/A', selectedCar2.transmission || 'N/A'],
                                                ['Color', selectedCar1.color || 'N/A', selectedCar2.color || 'N/A'],
                                                ['Fuel Type', selectedCar1.fuelType || 'N/A', selectedCar2.fuelType || 'N/A'],
                                                ['Engine Type', selectedCar1.engineType || 'N/A', selectedCar2.engineType || 'N/A'],
                                                ['Condition', selectedCar1.condition || 'N/A', selectedCar2.condition || 'N/A'],
                                                ['Seller Name', selectedCar1.sellerName || 'N/A', selectedCar2.sellerName || 'N/A'],
                                                ['Seller Phone', selectedCar1.sellerPhone || 'N/A', selectedCar2.sellerPhone || 'N/A'],
                                                ['Description', selectedCar1.description, selectedCar2.description],
                                            ].map((row, idx) => (
                                                <tr key={row[0]} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f7fa' }}>
                                                    <td style={{ fontWeight: 600, padding: '10px 8px' }}>{row[0]}</td>
                                                    <td style={{ padding: '10px 8px' }}>{row[1]}</td>
                                                    <td style={{ padding: '10px 8px' }}>{row[2]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="comparison-summary">
                                    <h3>Summary & Recommendation</h3>
                                    <p>{getRecommendation()}</p>
                                </div>
                            </div>
                        )}
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

export default CarComparison; 