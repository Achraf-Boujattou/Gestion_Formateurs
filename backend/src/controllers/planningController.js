const db = require('../config/db');

exports.createPlanning = (req, res) => {
    const { formation_id, formateur_id, entreprise_id, dates } = req.body;

    if (!formation_id || !formateur_id || !entreprise_id || !dates || dates.length === 0) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    // 1. Check for date conflicts for the trainer
    const conflictSql = `
        SELECT pd.date 
        FROM planification_dates pd
        JOIN planifications p ON pd.planification_id = p.id
        WHERE p.formateur_id = ? AND pd.date IN (?)
    `;

    db.query(conflictSql, [formateur_id, dates], (err, conflicts) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Erreur lors de la vérification des conflits" });
        }

        if (conflicts.length > 0) {
            const conflictDates = conflicts.map(c => new Date(c.date).toLocaleDateString()).join(', ');
            return res.status(400).json({
                Error: `Conflit : Le formateur est déjà occupé le(s) : ${conflictDates}`
            });
        }

        // 2. Create the planning
        const sql = "INSERT INTO planifications (formation_id, formateur_id, entreprise_id) VALUES (?, ?, ?)";
        db.query(sql, [formation_id, formateur_id, entreprise_id], (err, result) => {
            if (err) return res.status(500).json({ Error: "Erreur lors de la création de la planification" });

            const planificationId = result.insertId;

            // 3. Insert dates
            const dateValues = dates.map(d => [planificationId, d]);
            const sqlDates = "INSERT INTO planification_dates (planification_id, date) VALUES ?";
            db.query(sqlDates, [dateValues], (errDates) => {
                if (errDates) return res.status(500).json({ Error: "Erreur lors de l'enregistrement des dates" });

                return res.json({ Status: "Success", Message: "Planification enregistrée avec succès." });
            });
        });
    });
};

exports.getAllPlannings = (req, res) => {
    const sql = `
        SELECT p.*, f.titre as formation_titre, u.nom as formateur_nom, u.prenom as formateur_prenom, e.nom as entreprise_nom,
        GROUP_CONCAT(pd.date ORDER BY pd.date) as dates
        FROM planifications p
        JOIN formations f ON p.formation_id = f.id
        JOIN formateur ft ON p.formateur_id = ft.id
        JOIN utilisateurs u ON ft.utilisateur_id = u.id
        JOIN entreprises e ON p.entreprise_id = e.id
        LEFT JOIN planification_dates pd ON p.id = pd.planification_id
        GROUP BY p.id
        ORDER BY p.id DESC
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

exports.deletePlanning = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM planifications WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la suppression." });
        return res.json({ Status: "Success", Message: "Planification supprimée." });
    });
};

exports.getDependencies = (req, res) => {
    // Helper to get all formations, formateurs and entreprises for the select lists
    const sqlFormations = "SELECT id, titre FROM formations";
    const sqlFormateurs = "SELECT f.id, u.nom, u.prenom FROM formateur f JOIN utilisateurs u ON f.utilisateur_id = u.id";
    const sqlEntreprises = "SELECT id, nom FROM entreprises";

    db.query(sqlFormations, (err, formations) => {
        if (err) return res.status(500).json(err);
        db.query(sqlFormateurs, (err, formateurs) => {
            if (err) return res.status(500).json(err);
            db.query(sqlEntreprises, (err, entreprises) => {
                if (err) return res.status(500).json(err);
                return res.json({ formations, formateurs, entreprises });
            });
        });
    });
};
