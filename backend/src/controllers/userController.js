const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = (req, res) => {
    const sql = "SELECT id, nom, prenom, email, role, created_at FROM utilisateurs WHERE role != 'admin' ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

exports.createUser = async (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    try {
        // Check email uniqueness
        const checkEmailSql = "SELECT * FROM utilisateurs WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, data) => {
            if (err) return res.status(500).json({ Error: "Erreur serveur vérification email" });
            if (data.length > 0) return res.status(400).json({ Error: "Cet email est déjà utilisé." });

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)";

            db.query(sql, [nom, prenom, email, hashedPassword, role], (err, result) => {
                if (err) return res.status(500).json({ Error: "Erreur lors de la création de l'utilisateur" });
                return res.json({ Status: "Success", Message: "Utilisateur créé avec succès." });
            });
        });
    } catch (error) {
        return res.status(500).json({ Error: "Erreur serveur" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !role) {
        return res.status(400).json({ Error: "Tous les champs (sauf mot de passe optionnel) sont obligatoires." });
    }

    // Prepare update query
    let sql = "UPDATE utilisateurs SET nom=?, prenom=?, email=?, role=? WHERE id=?";
    let values = [nom, prenom, email, role, id];

    // Check if password change is requested
    if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql = "UPDATE utilisateurs SET nom=?, prenom=?, email=?, role=?, password=? WHERE id=?";
        values = [nom, prenom, email, role, hashedPassword, id];
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            // Handle duplicate email error usually code 1062
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ Error: "Cet email est déjà pris." });
            return res.status(500).json({ Error: "Erreur lors de la mise à jour." });
        }
        return res.json({ Status: "Success", Message: "Utilisateur mis à jour." });
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
