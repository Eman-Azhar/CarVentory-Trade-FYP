const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'server', 'config.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/authRoutes');
const carRoutes = require('./server/routes/carRoutes');
require("dotenv").config({ path: "./server/config.env" });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend requests
    credentials: true
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/cars', carRoutes);

    // Start server
    app.listen(port, () => {
        console.log(`🚀 Server is running on port: ${port}`);
    });
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CarVentory API' });
}); 