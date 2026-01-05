const db = require('../config/db');
const { sanitizeString, validateRequiredFields } = require('../utils/validation');

exports.createGroup = (req, res) => {
    let { nom_groupe, formation_id, formateur_id } = req.body;

    const validation = validateRequiredFields({ nom_groupe, formation_id });
    if (!validation.valid) {
        return res.status(400).json({ Error: validation.message });
    }

    nom_groupe = sanitizeString(nom_groupe);

    const sql = "INSERT INTO groupes (nom_groupe, formation_id, formateur_id) VALUES (?, ?, ?)";
    db.query(sql, [nom_groupe, formation_id, formateur_id || null], (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la création du groupe." });
        return res.json({ Status: "Success", id: result.insertId });
    });
};

exports.getAllGroups = (req, res) => {
    const sql = `
        SELECT g.*, f.titre as formation_titre, u.nom as formateur_nom, u.prenom as formateur_prenom,
        (SELECT COUNT(*) FROM groupe_individus WHERE groupe_id = g.id) as membre_count
        FROM groupes g
        JOIN formations f ON g.formation_id = f.id
        LEFT JOIN formateur ft ON g.formateur_id = ft.id
        LEFT JOIN utilisateurs u ON ft.utilisateur_id = u.id
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur serveur lors de la récupération des groupes." });
        return res.json(data);
    });
};

exports.addIndividualToGroup = (req, res) => {
    const { groupe_id, individu_id } = req.body;

    const validation = validateRequiredFields({ groupe_id, individu_id });
    if (!validation.valid) {
        return res.status(400).json({ Error: validation.message });
    }

    const sql = "INSERT INTO groupe_individus (groupe_id, individu_id) VALUES (?, ?)";
    db.query(sql, [groupe_id, individu_id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ Error: "Cet individu est déjà membre de ce groupe." });
            return res.status(500).json({ Error: "Erreur lors de l'ajout du membre au groupe." });
        }
        return res.json({ Status: "Success" });
    });
};

exports.getGroupMembers = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT ind.* 
        FROM individus ind
        JOIN groupe_individus gi ON ind.id = gi.individu_id
        WHERE gi.groupe_id = ?
    `;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la récupération des membres." });
        return res.json(data);
    });
};

exports.deleteGroup = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM groupes WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la suppression du groupe." });
        return res.json({ Status: "Success" });
    });
};

exports.getTrainerGroups = (req, res) => {
    // We assume req.user is set by verifyToken middleware
    const utilisateur_id = req.user.id;

    const sql = `
        SELECT g.*, f.titre as formation_titre, f.categorie, f.date_formation,
        (SELECT COUNT(*) FROM groupe_individus WHERE groupe_id = g.id) as membre_count
        FROM groupes g
        JOIN formations f ON g.formation_id = f.id
        JOIN formateur ft ON g.formateur_id = ft.id
        WHERE ft.utilisateur_id = ?
    `;
    db.query(sql, [utilisateur_id], (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur serveur." });
        return res.json(data);
    });
};

exports.getTrainerStudents = (req, res) => {
    const utilisateur_id = req.user.id;

    const sql = `
        SELECT DISTINCT ind.*, f.titre as formation_titre, g.nom_groupe
        FROM individus ind
        JOIN groupe_individus gi ON ind.id = gi.individu_id
        JOIN groupes g ON gi.groupe_id = g.id
        JOIN formations f ON g.formation_id = f.id
        JOIN formateur ft ON g.formateur_id = ft.id
        WHERE ft.utilisateur_id = ?
    `;
    db.query(sql, [utilisateur_id], (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur serveur." });
        return res.json(data);
    });
};
