import React from 'react';
import './Auth.css';

const AboutUs = () => (
  <div className="luxury-login-container">
    <div className="branding-section">
      <div className="branding-content">
        <div className="logo-container">
          <img src="/car-logo.png" alt="CarVentory Trade Logo" className="car-logo" />
        </div>
        <h1 className="luxury-logo">CarVentory Trade</h1>
        <p className="luxury-tagline">About Us</p>
      </div>
    </div>
    <section className="form-container">
      <div className="form-wrapper post-ad-wrapper" style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2.5rem 2rem', fontSize: '1.13rem', color: '#222' }}>
        <h2 className="form-title" style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: 12, color: '#1a237e' }}>About Us – CarVentory Trade</h2>
        <p>Welcome to <b>CarVentory Trade</b>, your ultimate destination for buying, selling, and managing car inventory with ease, trust, and transparency. We are a dedicated team of software engineering students passionate about revolutionizing the automotive e-commerce experience in Pakistan and beyond.</p>
        <p>Our platform bridges the gap between individual buyers, car dealerships, and sellers by offering an AI-powered solution for real-time inventory tracking, price recommendations, test drive bookings, and side-by-side car comparisons — all under one digital roof.</p>
        <p>At CarVentory Trade, we aim to simplify the car trading journey for everyone:</p>
        <ul style={{ marginLeft: 24, marginBottom: 16 }}>
          <li>🚗 <b>Buyers</b> can explore featured cars, compare models, add to wishlists, and book test drives.</li>
          <li>🏬 <b>Sellers & Showrooms</b> can manage listings, monitor sales, gain insights, and reach targeted audiences.</li>
          <li>🤖 <b>AI Features</b> assist with fair price estimation, fraud detection, and customer support via chatbot.</li>
        </ul>
        <p>With a clean interface, intelligent features, and a user-first mindset, CarVentory Trade ensures that your car buying or selling journey is smart, secure, and seamless.</p>
        <h2 style={{ fontWeight: 600, fontSize: '1.3rem', marginTop: 32, color: '#1a237e' }}>📞 Contact Information</h2>
        <ul style={{ marginLeft: 24, marginBottom: 16 }}>
          <li>📧 <b>Email:</b> carventory.trade@gmail.com</li>
          <li>🌐 <b>Website:</b> www.carventory-trade.com (or your actual domain)</li>
          <li>📍 <b>Location:</b> Islamabad, Pakistan</li>
          <li>☎️ <b>Phone:</b> +92 300 1234567</li>
        </ul>
        <div style={{ marginTop: 18, marginBottom: 8, fontWeight: 600, color: '#1a237e' }}>Stay connected with us on social media:</div>
        <ul style={{ marginLeft: 24 }}>
          <li>📘 Facebook: <b>/CarVentoryTrade</b></li>
          <li>🐦 Twitter: <b>@CarVentoryApp</b></li>
          <li>📸 Instagram: <b>@carventory.trade</b></li>
        </ul>
      </div>
    </section>
  </div>
);

export default AboutUs; 