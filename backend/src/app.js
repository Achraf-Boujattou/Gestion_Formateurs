const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const formationRoutes = require('./routes/formationRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const planningRoutes = require('./routes/planningRoutes');
const inscriptionRoutes = require('./routes/inscriptionRoutes');
const groupeRoutes = require('./routes/groupeRoutes');

// Initialize Admin
authController.createDefaultAdmin();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes); // Exposes /login
app.use('/utilisateurs', userRoutes); // Exposes /utilisateurs
app.use('/formations', formationRoutes); // Exposes /formations
app.use('/entreprises', entrepriseRoutes); // Exposes /entreprises
app.use('/plannings', planningRoutes); // Exposes /plannings
app.use('/inscriptions', inscriptionRoutes); // Exposes /inscriptions
app.use('/groupes', groupeRoutes); // Exposes /groupes

// Basic route to check if API is working
app.get('/', (req, res) => {
    res.json("API Backend is running properly.");
});

module.exports = app;
