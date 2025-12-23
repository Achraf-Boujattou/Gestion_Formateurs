const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise';

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    // Check if token exists (format: "Bearer <token>" usually, or just token)
    // For simplicity, assuming the frontend sends it directly or handling "Bearer " split if needed.
    // Let's support both "Bearer token" and just "token"

    if (!token) {
        return res.status(403).json({ Error: "Aucun token fourni. Accès interdit." });
    }

    const tokenValue = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Échec de l'authentification du token." });
        }
        req.user = decoded; // Save user info to request for next middleware
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ Error: "Accès refusé. Rôle Admin requis." });
    }
};

exports.isFormateur = (req, res, next) => {
    if (req.user && (req.user.role === 'formateur' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({ Error: "Accès refusé. Rôle Formateur requis." });
    }
};
