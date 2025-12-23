const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise';

exports.login = (req, res) => {
    const sql = "SELECT * FROM utilisateurs WHERE email = ?";
    db.query(sql, [req.body.email], async (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur serveur login" });
        if (data.length > 0) {
            const match = await bcrypt.compare(req.body.password, data[0].password);
            if (match) {
                const name = data[0].prenom + ' ' + data[0].nom;
                const token = jwt.sign({ name, role: data[0].role }, JWT_SECRET, { expiresIn: '1d' });
                return res.json({ Status: "Success", role: data[0].role, token: token, name: name });
            } else {
                return res.status(401).json({ Error: "Mot de passe incorrect" });
            }
        } else {
            return res.status(404).json({ Error: "Email inexistant" });
        }
    });
};

exports.createDefaultAdmin = async () => {
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin';
    const checkSql = "SELECT * FROM utilisateurs WHERE email = ?";

    db.query(checkSql, [adminEmail], async (err, data) => {
        if (err) return console.error("Erreur vérification admin:", err);
        if (data.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const insertSql = "INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)";
            db.query(insertSql, ['Admin', 'System', adminEmail, hashedPassword, 'admin'], (err, result) => {
                if (err) console.error("Erreur création admin:", err);
                else console.log("Admin par défaut créé : admin@admin.com / admin");
            });
        }
    });
};
