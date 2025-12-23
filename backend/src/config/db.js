const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

module.exports = db;
