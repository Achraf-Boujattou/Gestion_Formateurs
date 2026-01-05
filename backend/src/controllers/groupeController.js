const db = require('../config/db');

exports.createGroup = (req, res) => {
    const { nom_groupe, formation_id, formateur_id } = req.body;
    const sql = "INSERT INTO groupes (nom_groupe, formation_id, formateur_id) VALUES (?, ?, ?)";
    db.query(sql, [nom_groupe, formation_id, formateur_id || null], (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur création groupe" });
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
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

exports.addIndividualToGroup = (req, res) => {
    const { groupe_id, individu_id } = req.body;
    const sql = "INSERT INTO groupe_individus (groupe_id, individu_id) VALUES (?, ?)";
    db.query(sql, [groupe_id, individu_id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ Error: "Cet individu est déjà dans le groupe." });
            return res.status(500).json({ Error: "Erreur ajout membre" });
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
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

exports.deleteGroup = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM groupes WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ Error: "Erreur suppression" });
        return res.json({ Status: "Success" });
    });
};
