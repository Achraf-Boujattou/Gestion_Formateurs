const db = require('../config/db');

// Public registration
exports.publicRegister = (req, res) => {
    const { nom, prenom, date_naissance, ville, email, telephone, formation_id } = req.body;

    if (!nom || !prenom || !date_naissance || !ville || !email || !telephone || !formation_id) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    // 1. Insert or get individu
    const checkIndividu = "SELECT id FROM individus WHERE email = ?";
    db.query(checkIndividu, [email], (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur vérification individu" });

        if (data.length > 0) {
            // Individu exists, create inscription
            const individuId = data[0].id;
            createSpecificInscription(individuId, formation_id, res);
        } else {
            // New individu
            const sqlIndividu = "INSERT INTO individus (nom, prenom, date_naissance, ville, email, telephone) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(sqlIndividu, [nom, prenom, date_naissance, ville, email, telephone], (errI, resultI) => {
                if (errI) return res.status(500).json({ Error: "Erreur création individu" });
                createSpecificInscription(resultI.insertId, formation_id, res);
            });
        }
    });
};

const createSpecificInscription = (individuId, formationId, res) => {
    // Check if already registered for THIS formation
    const checkInscr = "SELECT * FROM inscriptions WHERE individu_id = ? AND formation_id = ?";
    db.query(checkInscr, [individuId, formationId], (err, data) => {
        if (data.length > 0) return res.status(400).json({ Error: "Vous êtes déjà inscrit à cette formation." });

        const sql = "INSERT INTO inscriptions (individu_id, formation_id) VALUES (?, ?)";
        db.query(sql, [individuId, formationId], (err, result) => {
            if (err) return res.status(500).json({ Error: "Erreur lors de l'inscription" });
            return res.json({ Status: "Success", Message: "Inscription enregistrée avec succès !" });
        });
    });
};

// Admin: Get all inscriptions
exports.getAllInscriptions = (req, res) => {
    const sql = `
        SELECT i.*, ind.nom, ind.prenom, ind.email, ind.telephone, ind.ville, f.titre as formation_titre
        FROM inscriptions i
        JOIN individus ind ON i.individu_id = ind.id
        JOIN formations f ON i.formation_id = f.id
        ORDER BY i.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

// Admin: Update status
exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE inscriptions SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur mise à jour" });
        return res.json({ Status: "Success" });
    });
};
