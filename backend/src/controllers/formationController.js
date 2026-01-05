const db = require('../config/db');
const { sanitizeString, isValidNumber, isValidDate, validateRequiredFields } = require('../utils/validation');

exports.addFormation = (req, res) => {
    const { titre, nombre_heures, cout, objectifs, programme, categorie, ville, date_formation } = req.body;

    // Validation des champs requis
    const validation = validateRequiredFields(req.body, ['titre', 'nombre_heures', 'cout', 'objectifs', 'programme']);
    if (!validation.valid) {
        return res.status(400).json({ Error: `Champs manquants: ${validation.missing.join(', ')}` });
    }

    // Validation des nombres
    if (!isValidNumber(nombre_heures, 1)) {
        return res.status(400).json({ Error: "Le nombre d'heures doit être un nombre positif." });
    }

    if (!isValidNumber(cout, 0)) {
        return res.status(400).json({ Error: "Le coût doit être un nombre positif ou zéro." });
    }

    // Validation de la date si fournie
    if (date_formation && !isValidDate(date_formation)) {
        return res.status(400).json({ Error: "Format de date invalide. Utilisez YYYY-MM-DD." });
    }

    const sql = "INSERT INTO formations (titre, nombre_heures, cout, objectifs, programme, categorie, ville, date_formation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        sanitizeString(titre),
        nombre_heures,
        cout,
        sanitizeString(objectifs),
        sanitizeString(programme),
        sanitizeString(categorie || 'Informatique'),
        sanitizeString(ville || 'Casablanca'),
        date_formation || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erreur ajout formation:", err);
            return res.status(500).json({ Error: "Erreur lors de l'ajout de la formation." });
        }
        return res.json({ Status: "Success", Message: "Formation ajoutée avec succès." });
    });
};

exports.getAllFormations = (req, res) => {
    const sql = "SELECT * FROM formations ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Erreur récupération formations:", err);
            return res.status(500).json({ Error: "Erreur serveur lors de la récupération des formations." });
        }
        return res.json(data);
    });
};

exports.updateFormation = (req, res) => {
    const { id } = req.params;
    const { titre, nombre_heures, cout, objectifs, programme, categorie, ville, date_formation } = req.body; // Updated data

    if (!titre || !nombre_heures || !cout || !objectifs || !programme) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    const sql = "UPDATE formations SET titre=?, nombre_heures=?, cout=?, objectifs=?, programme=?, categorie=?, ville=?, date_formation=? WHERE id=?";
    const values = [
        titre,
        nombre_heures,
        cout,
        objectifs,
        programme,
        categorie || 'Informatique',
        ville || 'Casablanca',
        date_formation || null,
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erreur modification formation:", err);
            return res.status(500).json({ Error: "Erreur serveur update" });
        }
        return res.json({ Status: "Success", Message: "Formation mise à jour." });
    });
};

exports.deleteFormation = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM formations WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erreur suppression formation:", err);
            return res.status(500).json({ Error: "Erreur serveur delete" });
        }
        return res.json({ Status: "Success", Message: "Formation supprimée." });
    });
};

exports.getFormationById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM formations WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err || data.length === 0) return res.status(404).json({ Error: "Formation non trouvée" });
        return res.json(data[0]);
    });
};
