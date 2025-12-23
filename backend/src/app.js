const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Admin
authController.createDefaultAdmin();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes); // Exposes /login
app.use('/utilisateurs', userRoutes); // Exposes /utilisateurs

// Basic route to check if API is working
app.get('/', (req, res) => {
    res.json("API Backend is running properly.");
});

module.exports = app;
