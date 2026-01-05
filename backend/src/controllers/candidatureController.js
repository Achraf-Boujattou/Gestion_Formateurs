const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.submitCandidature = (req, res) => {
    const { nom, prenom, email, telephone, competences } = req.body;

    if (!nom || !prenom || !email || !telephone || !competences) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    const sql = "INSERT INTO candidatures_formateurs (nom, prenom, email, telephone, competences) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nom, prenom, email, telephone, competences], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ Error: "Cet email a déjà soumis une candidature." });
            }
            console.error("Erreur soumission candidature:", err);
            return res.status(500).json({ Error: "Erreur lors de la soumission de la candidature." });
        }
        return res.json({ Status: "Success", Message: "Votre candidature a été envoyée avec succès !" });
    });
};

exports.getAllCandidatures = (req, res) => {
    const sql = "SELECT * FROM candidatures_formateurs ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur récupération candidatures" });
        return res.json(data);
    });
};

exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['valide', 'refuse'].includes(statut)) {
        return res.status(400).json({ Error: "Statut invalide" });
    }

    // If validated, we should potentially create a user account
    if (statut === 'valide') {
        // 1. Get candidature details
        db.query("SELECT * FROM candidatures_formateurs WHERE id = ?", [id], (err, data) => {
            if (err || data.length === 0) return res.status(404).json({ Error: "Candidature non trouvée" });
            const cand = data[0];

            // 2. Check if user already exists
            db.query("SELECT id FROM utilisateurs WHERE email = ?", [cand.email], (errU, resU) => {
                if (resU.length > 0) return res.status(400).json({ Error: "Un utilisateur avec cet email existe déjà." });

                // 3. Create User & Formateur
                const defaultPass = 'Formation2026';
                bcrypt.hash(defaultPass, 10, (errH, hash) => {
                    if (errH) return res.status(500).json({ Error: "Erreur hashing" });

                    db.beginTransaction(errT => {
                        if (errT) return res.status(500).json({ Error: "Erreur transaction" });

                        const sqlU = "INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, 'formateur')";
                        db.query(sqlU, [cand.nom, cand.prenom, cand.email, hash], (errUI, resultUI) => {
                            if (errUI) return db.rollback(() => res.status(500).json({ Error: "Erreur création utilisateur" }));

                            const sqlF = "INSERT INTO formateur (utilisateur_id, competences) VALUES (?, ?)";
                            db.query(sqlF, [resultUI.insertId, cand.competences], (errFI) => {
                                if (errFI) return db.rollback(() => res.status(500).json({ Error: "Erreur création formateur profile" }));

                                const sqlUpdate = "UPDATE candidatures_formateurs SET statut = 'valide' WHERE id = ?";
                                db.query(sqlUpdate, [id], (errUp) => {
                                    if (errUp) return db.rollback(() => res.status(500).json({ Error: "Erreur maj candidature" }));

                                    db.commit(errC => {
                                        if (errC) return db.rollback(() => res.status(500).json({ Error: "Erreur commit" }));
                                        return res.json({ Status: "Success", Message: "Candidature validée et compte créé (Pass: " + defaultPass + ")" });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        // Just refuse
        const sql = "UPDATE candidatures_formateurs SET statut = 'refuse' WHERE id = ?";
        db.query(sql, [id], (err) => {
            if (err) return res.status(500).json({ Error: "Erreur mise à jour statut" });
            return res.json({ Status: "Success", Message: "Candidature refusée." });
        });
    }
};
