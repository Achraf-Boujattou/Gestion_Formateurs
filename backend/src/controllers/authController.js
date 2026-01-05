const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isValidEmail, sanitizeString } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise';

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ Error: "Email et mot de passe requis" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ Error: "Format d'email invalide" });
    }

    const sql = "SELECT * FROM utilisateurs WHERE email = ?";
    db.query(sql, [email], async (err, data) => {
        if (err) {
            console.error("Erreur login:", err);
            return res.status(500).json({ Error: "Erreur serveur login" });
        }

        if (data.length > 0) {
            const match = await bcrypt.compare(password, data[0].password);
            if (match) {
                const name = data[0].prenom + ' ' + data[0].nom;
                const token = jwt.sign({ id: data[0].id, name, role: data[0].role }, JWT_SECRET, { expiresIn: '1d' });
                return res.json({ Status: "Success", role: data[0].role, token: token, name: name });
            } else {
                return res.status(401).json({ Error: "Mot de passe incorrect" });
            }
        } else {
            return res.status(404).json({ Error: "Email inexistant" });
        }
    });
};

exports.register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ Error: "Tous les champs sont obligatoires." });
    }

    // Validation email
    if (!isValidEmail(email)) {
        return res.status(400).json({ Error: "Format d'email invalide." });
    }

    // Validation password
    if (password.length < 6) {
        return res.status(400).json({ Error: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    try {
        const checkSql = "SELECT * FROM utilisateurs WHERE email = ?";
        db.query(checkSql, [email], async (err, data) => {
            if (err) {
                console.error("Erreur vérification email:", err);
                return res.status(500).json({ Error: "Erreur serveur." });
            }

            if (data.length > 0) return res.status(400).json({ Error: "Email déjà utilisé." });

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, 'formateur')";
            db.query(sql, [sanitizeString(nom), sanitizeString(prenom), email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("Erreur création compte:", err);
                    return res.status(500).json({ Error: "Erreur lors de la création du compte." });
                }
                return res.json({ Status: "Success", Message: "Compte créé avec succès ! Connectez-vous." });
            });
        });
    } catch (err) {
        console.error("Erreur register:", err);
        res.status(500).json({ Error: "Erreur serveur" });
    }
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    const sql = "SELECT * FROM utilisateurs WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) return res.status(500).json({ Error: "Erreur serveur" });
        if (data.length === 0) return res.status(404).json({ Error: "Aucun compte associé à cet email." });

        // In a real app, send reset link via email here.
        return res.json({ Status: "Success", Message: "Un lien de réinitialisation a été envoyé à votre email (simulation)." });
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
