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
const evaluationRoutes = require('./routes/evaluationRoutes');
const candidatureRoutes = require('./routes/candidatureRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

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
app.use('/evaluations', evaluationRoutes); // Exposes /evaluations
app.use('/candidatures', candidatureRoutes); // Exposes /candidatures
app.use('/admin', dashboardRoutes); // Exposes /admin/stats

// Basic route to check if API is working
app.get('/', (req, res) => {
    res.json("API Backend is running properly.");
});

// Error Handling Middleware (must be after routes)
app.use(errorHandler);

module.exports = app;
