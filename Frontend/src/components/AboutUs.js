import React from 'react';
import './Auth.css';

const AboutUs = () => (
  <div className="about-us-container" style={{
    maxWidth: 750,
    margin: '48px auto',
    background: 'linear-gradient(135deg, #181d2f 80%, #1a237e 100%)',
    borderRadius: 22,
    boxShadow: '0 6px 32px rgba(26,35,126,0.13)',
    padding: '2.8rem 2.2rem',
    fontSize: '1.15rem',
    color: '#f5f7fa',
    border: '1.5px solid #232a4d',
    letterSpacing: 0.01,
    lineHeight: 1.7
  }}>
    <h1 style={{ fontWeight: 800, fontSize: '2.2rem', marginBottom: 14, color: '#4f8cff', letterSpacing: 0.5 }}>About Us – CarVentory Trade</h1>
    <p style={{ marginBottom: 10 }}>Welcome to <b style={{ color: '#90caf9' }}>CarVentory Trade</b>, your ultimate destination for buying, selling, and managing car inventory with ease, trust, and transparency. We are a dedicated team of software engineering students passionate about revolutionizing the automotive e-commerce experience in Pakistan and beyond.</p>
    <p style={{ marginBottom: 10 }}>Our platform bridges the gap between individual buyers, car dealerships, and sellers by offering an AI-powered solution for real-time inventory tracking, price recommendations, test drive bookings, and side-by-side car comparisons — all under one digital roof.</p>
    <p style={{ marginBottom: 18 }}>At CarVentory Trade, we aim to simplify the car trading journey for everyone:</p>
    <ul style={{ marginLeft: 24, marginBottom: 18, fontWeight: 500 }}>
      <li>🚗 <span style={{ color: '#90caf9' }}>Buyers</span> can explore featured cars, compare models, add to wishlists, and book test drives.</li>
      <li>🏬 <span style={{ color: '#90caf9' }}>Sellers & Showrooms</span> can manage listings, monitor sales, gain insights, and reach targeted audiences.</li>
      <li>🤖 <span style={{ color: '#90caf9' }}>AI Features</span> assist with fair price estimation, fraud detection, and customer support via chatbot.</li>
    </ul>
    <p style={{ marginBottom: 18 }}>With a clean interface, intelligent features, and a user-first mindset, CarVentory Trade ensures that your car buying or selling journey is smart, secure, and seamless.</p>
    <h2 style={{ fontWeight: 700, fontSize: '1.35rem', marginTop: 36, color: '#4f8cff', letterSpacing: 0.2 }}>📞 Contact Information</h2>
    <ul style={{ marginLeft: 24, marginBottom: 18, fontWeight: 500 }}>
      <li>📧 <span style={{ color: '#90caf9' }}>Email:</span> carventory.trade@gmail.com</li>
      <li>🌐 <span style={{ color: '#90caf9' }}>Website:</span> www.carventory-trade.com (or your actual domain)</li>
      <li>📍 <span style={{ color: '#90caf9' }}>Location:</span> Islamabad, Pakistan</li>
      <li>☎️ <span style={{ color: '#90caf9' }}>Phone:</span> +92 300 1234567</li>
    </ul>
    <div style={{ marginTop: 18, marginBottom: 8, fontWeight: 700, color: '#4f8cff', fontSize: '1.08rem' }}>Stay connected with us on social media:</div>
    <ul style={{ marginLeft: 24, fontWeight: 500 }}>
      <li>📘 Facebook: <span style={{ color: '#90caf9' }}>/CarVentoryTrade</span></li>
      <li>🐦 Twitter: <span style={{ color: '#90caf9' }}>@CarVentoryApp</span></li>
      <li>📸 Instagram: <span style={{ color: '#90caf9' }}>@carventory.trade</span></li>
    </ul>
  </div>
);

export default AboutUs; 