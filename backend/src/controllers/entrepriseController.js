const db = require('../config/db');
const { sanitizeString, validateRequiredFields, isValidEmail, isValidPhone } = require('../utils/validation');

// Get all companies
exports.getAllEntreprises = (req, res) => {
    const sql = "SELECT * FROM entreprises ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur serveur lors de la récupération des entreprises." });
        return res.json(data);
    });
};

// Create a new company
exports.createEntreprise = (req, res) => {
    let { nom, adresse, telephone, site_web, email } = req.body;

    const validation = validateRequiredFields({ nom });
    if (!validation.valid) {
        return res.status(400).json({ Error: validation.message });
    }

    if (email && !isValidEmail(email)) {
        return res.status(400).json({ Error: "Format d'email invalide." });
    }

    if (telephone && !isValidPhone(telephone)) {
        return res.status(400).json({ Error: "Format de téléphone invalide." });
    }

    nom = sanitizeString(nom);
    adresse = sanitizeString(adresse);
    site_web = sanitizeString(site_web);

    const sql = "INSERT INTO entreprises (nom, adresse, telephone, site_web, email) VALUES (?, ?, ?, ?, ?)";
    const values = [nom, adresse, telephone, site_web, email];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la création de l'entreprise." });
        return res.json({ Status: "Success", Message: "Entreprise ajoutée avec succès." });
    });
};

// Update a company
exports.updateEntreprise = (req, res) => {
    const { id } = req.params;
    let { nom, adresse, telephone, site_web, email } = req.body;

    const validation = validateRequiredFields({ nom });
    if (!validation.valid) {
        return res.status(400).json({ Error: validation.message });
    }

    if (email && !isValidEmail(email)) {
        return res.status(400).json({ Error: "Format d'email invalide." });
    }

    if (telephone && !isValidPhone(telephone)) {
        return res.status(400).json({ Error: "Format de téléphone invalide." });
    }

    nom = sanitizeString(nom);
    adresse = sanitizeString(adresse);
    site_web = sanitizeString(site_web);

    const sql = "UPDATE entreprises SET nom=?, adresse=?, telephone=?, site_web=?, email=? WHERE id=?";
    const values = [nom, adresse, telephone, site_web, email, id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la mise à jour de l'entreprise." });
        return res.json({ Status: "Success", Message: "Entreprise mise à jour." });
    });
};

// Delete a company
exports.deleteEntreprise = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM entreprises WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la suppression de l'entreprise." });
        return res.json({ Status: "Success", Message: "Entreprise supprimée." });
    });
};
