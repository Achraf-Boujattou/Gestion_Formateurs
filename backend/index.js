const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 8081;

// Middleware pour permettre au frontend de communiquer avec le backend
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    return res.json("Du Backend");
})

app.get('/utilisateurs', (req, res) => {
    const sql = "SELECT * FROM utilisateurs";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
