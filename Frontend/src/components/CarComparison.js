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

    const handleSelectCar1 = (car) => {
        setSelectedCar1(car);
    };

    const handleSelectCar2 = (car) => {
        setSelectedCar2(car);
    };

    const handleClearComparison = () => {
        setSelectedCar1(null);
        setSelectedCar2(null);
    };

    // Function to get full image URL
    const getImageUrl = (url) => {
        return `http://localhost:5000${url}`;
    };
    
    // Function to determine which value is better (for numerical comparisons)
    const compareValues = (value1, value2, higherIsBetter = true) => {
        if (value1 === value2) return null;
        
        if (higherIsBetter) {
            return value1 > value2 ? 'car1' : 'car2';
        } else {
            return value1 < value2 ? 'car1' : 'car2';
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
                    <button className="nav-link" onClick={() => navigate('/user-dashboard')}>Home</button>
                    <button className="nav-link" onClick={() => navigate('/post-ad')}>Post Ad</button>
                    <button className="nav-link">About Us</button>
                    <button className="nav-link">Contact</button>
                    <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Comparison Section */}
            <div className="comparison-container">
                <h1>Car Comparison Tool</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                {loading ? (
                    <div className="loading">Loading cars...</div>
                ) : (
                    <div className="comparison-content">
                        <div className="car-selection">
                            <div className="selection-column">
                                <h3>Select First Car</h3>
                                <select 
                                    className="car-select"
                                    value={selectedCar1 ? selectedCar1._id : ''}
                                    onChange={(e) => {
                                        const carId = e.target.value;
                                        const car = cars.find(c => c._id === carId);
                                        handleSelectCar1(car || null);
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
                            
                            <div className="selection-column">
                                <h3>Select Second Car</h3>
                                <select 
                                    className="car-select"
                                    value={selectedCar2 ? selectedCar2._id : ''}
                                    onChange={(e) => {
                                        const carId = e.target.value;
                                        const car = cars.find(c => c._id === carId);
                                        handleSelectCar2(car || null);
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
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Feature</th>
                                                <th>{selectedCar1.make} {selectedCar1.model}</th>
                                                <th>{selectedCar2.make} {selectedCar2.model}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Image</td>
                                                <td>
                                                    <img 
                                                        src={selectedCar1.imageUrls && selectedCar1.imageUrls.length > 0 ? 
                                                            getImageUrl(selectedCar1.imageUrls[0]) : '/default-car.jpg'} 
                                                        alt={`${selectedCar1.make} ${selectedCar1.model}`} 
                                                        className="comparison-image"
                                                    />
                                                </td>
                                                <td>
                                                    <img 
                                                        src={selectedCar2.imageUrls && selectedCar2.imageUrls.length > 0 ? 
                                                            getImageUrl(selectedCar2.imageUrls[0]) : '/default-car.jpg'} 
                                                        alt={`${selectedCar2.make} ${selectedCar2.model}`} 
                                                        className="comparison-image"
                                                    />
                                                </td>
                                            </tr>
                                            <tr className={selectedCar1.price !== selectedCar2.price ? 'highlight-difference' : ''}>
                                                <td>Price</td>
                                                <td className={compareValues(selectedCar1.price, selectedCar2.price, false) === 'car1' ? 'better-value' : 
                                                    (compareValues(selectedCar1.price, selectedCar2.price, false) === 'car2' ? 'worse-value' : '')}>
                                                    PKR {selectedCar1.price.toLocaleString()}
                                                </td>
                                                <td className={compareValues(selectedCar1.price, selectedCar2.price, false) === 'car2' ? 'better-value' : 
                                                    (compareValues(selectedCar1.price, selectedCar2.price, false) === 'car1' ? 'worse-value' : '')}>
                                                    PKR {selectedCar2.price.toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr className={selectedCar1.make !== selectedCar2.make ? 'highlight-difference' : ''}>
                                                <td>Make</td>
                                                <td>{selectedCar1.make}</td>
                                                <td>{selectedCar2.make}</td>
                                            </tr>
                                            <tr className={selectedCar1.model !== selectedCar2.model ? 'highlight-difference' : ''}>
                                                <td>Model</td>
                                                <td>{selectedCar1.model}</td>
                                                <td>{selectedCar2.model}</td>
                                            </tr>
                                            <tr className={selectedCar1.year !== selectedCar2.year ? 'highlight-difference' : ''}>
                                                <td>Year</td>
                                                <td className={compareValues(selectedCar1.year, selectedCar2.year) === 'car1' ? 'better-value' : 
                                                    (compareValues(selectedCar1.year, selectedCar2.year) === 'car2' ? 'worse-value' : '')}>
                                                    {selectedCar1.year}
                                                </td>
                                                <td className={compareValues(selectedCar1.year, selectedCar2.year) === 'car2' ? 'better-value' : 
                                                    (compareValues(selectedCar1.year, selectedCar2.year) === 'car1' ? 'worse-value' : '')}>
                                                    {selectedCar2.year}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Description</td>
                                                <td>{selectedCar1.description}</td>
                                                <td>{selectedCar2.description}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="comparison-summary">
                                    <h3>Summary</h3>
                                    <p>
                                        The {selectedCar1.make} {selectedCar1.model} {selectedCar1.year} is priced at PKR {selectedCar1.price.toLocaleString()}, 
                                        while the {selectedCar2.make} {selectedCar2.model} {selectedCar2.year} is priced at PKR {selectedCar2.price.toLocaleString()}.
                                        {selectedCar1.price < selectedCar2.price ? 
                                            ` The ${selectedCar1.make} ${selectedCar1.model} is ${(selectedCar2.price - selectedCar1.price).toLocaleString()} PKR cheaper.` : 
                                            selectedCar1.price > selectedCar2.price ? 
                                                ` The ${selectedCar2.make} ${selectedCar2.model} is ${(selectedCar1.price - selectedCar2.price).toLocaleString()} PKR cheaper.` : 
                                                ' Both cars are priced the same.'}
                                    </p>
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