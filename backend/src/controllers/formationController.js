const db = require('../config/db');

exports.addFormation = (req, res) => {
    const { titre, nombre_heures, cout, objectifs, programme } = req.body;

    // Simple validation
    if (!titre || !nombre_heures || !cout || !objectifs || !programme) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    const sql = "INSERT INTO formations (titre, nombre_heures, cout, objectifs, programme) VALUES (?, ?, ?, ?, ?)";
    const values = [titre, nombre_heures, cout, objectifs, programme];

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
