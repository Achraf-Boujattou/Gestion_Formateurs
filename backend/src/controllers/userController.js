const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { isValidEmail, sanitizeString, validateRequiredFields } = require('../utils/validation');

exports.getAllUsers = (req, res) => {
    const sql = "SELECT u.id, u.nom, u.prenom, u.email, u.role, u.created_at, f.competences, f.remarques FROM utilisateurs u LEFT JOIN formateur f ON u.id = f.utilisateur_id WHERE u.role != 'admin' ORDER BY u.created_at DESC";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Erreur récupération utilisateurs:", err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
};

exports.createUser = async (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    // Validation des champs requis
    const validation = validateRequiredFields(req.body, ['nom', 'prenom', 'email', 'password', 'role']);
    if (!validation.valid) {
        return res.status(400).json({ Error: `Champs manquants: ${validation.missing.join(', ')}` });
    }

    // Validation email
    if (!isValidEmail(email)) {
        return res.status(400).json({ Error: "Format d'email invalide." });
    }

    // Validation password
    if (password.length < 6) {
        return res.status(400).json({ Error: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    // Validation role
    const validRoles = ['formateur', 'assistant'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ Error: "Rôle invalide. Utilisez 'formateur' ou 'assistant'." });
    }

    try {
        // Check email uniqueness
        const checkEmailSql = "SELECT * FROM utilisateurs WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, data) => {
            if (err) {
                console.error("Erreur vérification email:", err);
                return res.status(500).json({ Error: "Erreur serveur vérification email" });
            }

            if (data.length > 0) return res.status(400).json({ Error: "Cet email est déjà utilisé." });

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)";

            db.query(sql, [sanitizeString(nom), sanitizeString(prenom), email, hashedPassword, role], (err, result) => {
                if (err) {
                    console.error("Erreur création utilisateur:", err);
                    return res.status(500).json({ Error: "Erreur lors de la création de l'utilisateur" });
                }

                if (role === 'formateur') {
                    const { competences, remarques } = req.body;
                    const sqlFormateur = "INSERT INTO formateur (utilisateur_id, competences, remarques) VALUES (?, ?, ?)";
                    db.query(sqlFormateur, [result.insertId, sanitizeString(competences || ''), sanitizeString(remarques || '')], (errF, resultF) => {
                        if (errF) {
                            console.error("Erreur création profil formateur:", errF);
                            return res.status(500).json({ Error: "Utilisateur créé mais erreur formateur." });
                        }
                        return res.json({ Status: "Success", Message: "Formateur créé avec succès." });
                    });
                } else {
                    return res.json({ Status: "Success", Message: "Utilisateur créé avec succès." });
                }
            });
        });
    } catch (error) {
        console.error("Erreur createUser:", error);
        return res.status(500).json({ Error: "Erreur serveur" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, password, role } = req.body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !role) {
        return res.status(400).json({ Error: "Tous les champs (sauf mot de passe optionnel) sont obligatoires." });
    }

    // Validation email
    if (!isValidEmail(email)) {
        return res.status(400).json({ Error: "Format d'email invalide." });
    }

    // Validation role
    const validRoles = ['formateur', 'assistant'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ Error: "Rôle invalide." });
    }

    // Validation password if provided
    if (password && password.trim() !== "" && password.length < 6) {
        return res.status(400).json({ Error: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    // Prepare update query
    let sql = "UPDATE utilisateurs SET nom=?, prenom=?, email=?, role=? WHERE id=?";
    let values = [sanitizeString(nom), sanitizeString(prenom), email, role, id];

    // Check if password change is requested
    if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql = "UPDATE utilisateurs SET nom=?, prenom=?, email=?, role=?, password=? WHERE id=?";
        values = [sanitizeString(nom), sanitizeString(prenom), email, role, hashedPassword, id];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erreur mise à jour utilisateur:", err);
            // Handle duplicate email error usually code 1062
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ Error: "Cet email est déjà pris." });
            return res.status(500).json({ Error: "Erreur lors de la mise à jour." });
        }

        if (role === 'formateur') {
            const { competences, remarques } = req.body;
            const sqlFormateur = "INSERT INTO formateur (utilisateur_id, competences, remarques) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE competences = VALUES(competences), remarques = VALUES(remarques)";
            db.query(sqlFormateur, [id, sanitizeString(competences || ''), sanitizeString(remarques || '')], (errF, resultF) => {
                if (errF) {
                    console.error("Erreur mise à jour profil formateur:", errF);
                    return res.status(500).json({ Error: "Erreur lors de la mise à jour des infos formateur." });
                }
                return res.json({ Status: "Success", Message: "Formateur mis à jour." });
            });
        } else {
            // If role changed from formateur, remove the entry
            const sqlDeleteFormateur = "DELETE FROM formateur WHERE utilisateur_id = ?";
            db.query(sqlDeleteFormateur, [id], () => {
                return res.json({ Status: "Success", Message: "Utilisateur mis à jour." });
            });
        }
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    // Check if trying to delete self logic could be added here, but purely CRUD for now

    const sql = "DELETE FROM utilisateurs WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ Error: "Erreur lors de la suppression." });
        return res.json({ Status: "Success", Message: "Utilisateur supprimé." });
    });
};
