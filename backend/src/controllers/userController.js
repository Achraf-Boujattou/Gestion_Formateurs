const db = require('../config/db');

exports.getAllUsers = (req, res) => {
    const sql = "SELECT * FROM utilisateurs";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};
