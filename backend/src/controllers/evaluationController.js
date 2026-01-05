const db = require('../config/db');
const { isValidRating, sanitizeString, validateRequiredFields } = require('../utils/validation');

exports.submitEvaluation = (req, res) => {
    const { formation_id, formateur_id, pedagogie, rythme, supports, maitrise, commentaire } = req.body;

    // 1. Validation champs requis
    const validation = validateRequiredFields(req.body, ['formation_id', 'formateur_id', 'pedagogie', 'rythme', 'supports', 'maitrise']);
    if (!validation.valid) {
        return res.status(400).json({ Error: `Champs manquants : ${validation.missing.join(', ')}` });
    }

    // 2. Validation des notes (1-5)
    if (!isValidRating(pedagogie) || !isValidRating(rythme) || !isValidRating(supports) || !isValidRating(maitrise)) {
        return res.status(400).json({ Error: "Les notes doivent être comprises entre 1 et 5." });
    }

    const safeComment = sanitizeString(commentaire || '');

    const sql = "INSERT INTO evaluations (formation_id, formateur_id, pedagogie, rythme, supports, maitrise, commentaire) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [formation_id, formateur_id, pedagogie, rythme, supports, maitrise, safeComment];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erreur soumission évaluation:", err);
            return res.status(500).json({ Error: "Erreur lors de l'enregistrement de l'évaluation." });
        }
        return res.json({ Status: "Success", Message: "Évaluation enregistrée avec succès." });
    });
};

exports.getAllEvaluations = (req, res) => {
    const sql = `
        SELECT e.*, f.titre as formation_titre, u.nom as formateur_nom, u.prenom as formateur_prenom 
        FROM evaluations e
        JOIN formations f ON e.formation_id = f.id
        JOIN formateur ft ON e.formateur_id = ft.id
        JOIN utilisateurs u ON ft.utilisateur_id = u.id
        ORDER BY e.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Erreur récupération évaluations:", err);
            return res.status(500).json({ Error: "Erreur serveur lors de la récupération des évaluations." });
        }
        return res.json(data);
    });
};

exports.getEvaluationContext = (req, res) => {
    const { formationId } = req.params;
    // We try to find the trainer assigned to this formation via the last group created for it
    const sql = `
        SELECT f.titre, ft.id as formateur_id, u.nom as formateur_nom, u.prenom as formateur_prenom
        FROM formations f
        LEFT JOIN groupes g ON g.formation_id = f.id
        LEFT JOIN formateur ft ON g.formateur_id = ft.id
        LEFT JOIN utilisateurs u ON ft.utilisateur_id = u.id
        WHERE f.id = ?
        ORDER BY g.created_at DESC LIMIT 1
    `;
    db.query(sql, [formationId], (err, data) => {
        if (err || data.length === 0) return res.status(404).json({ Error: "Formation non trouvée ou aucun formateur assigné." });
        return res.json(data[0]);
    });
};
