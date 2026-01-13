const db = require('../config/db');

exports.getStats = (req, res) => {
    const stats = {};

    // 1. Total Users
    const sqlUsers = "SELECT COUNT(*) as totalUsers FROM utilisateurs";
    db.query(sqlUsers, (err, data) => {
        if (err) return res.status(500).json(err);
        stats.totalUsers = data[0].totalUsers;

        // 2. Total Trainers
        const sqlTrainers = "SELECT COUNT(*) as totalTrainers FROM utilisateurs WHERE role = 'formateur'";
        db.query(sqlTrainers, (err, data) => {
            if (err) return res.status(500).json(err);
            stats.totalTrainers = data[0].totalTrainers;

            // 3. Active Sessions (Groups)
            const sqlGroups = "SELECT COUNT(*) as activeSessions FROM groupes";
            db.query(sqlGroups, (err, data) => {
                if (err) return res.status(500).json(err);
                stats.activeSessions = data[0].activeSessions;

                // 4. Total Formations
                const sqlFormations = "SELECT COUNT(*) as totalFormations FROM formations";
                db.query(sqlFormations, (err, data) => {
                    if (err) return res.status(500).json(err);
                    stats.totalFormations = data[0].totalFormations;

                    // 5. Total Entreprises
                    const sqlEntreprises = "SELECT COUNT(*) as totalEntreprises FROM entreprises";
                    db.query(sqlEntreprises, (err, data) => {
                        if (err) return res.status(500).json(err);
                        stats.totalEntreprises = data[0].totalEntreprises;

                        // 6. Recent Activity
                        const sqlRecent = `
                            (SELECT 'Inscription' as type, i.nom as detail, i.prenom, i.created_at 
                             FROM individus i 
                             ORDER BY created_at DESC LIMIT 5)
                            UNION ALL
                            (SELECT 'Utilisateur' as type, u.nom as detail, u.prenom, u.created_at 
                             FROM utilisateurs u 
                             ORDER BY created_at DESC LIMIT 5)
                            ORDER BY created_at DESC LIMIT 6
                        `;

                        db.query(sqlRecent, (err, data) => {
                            if (err) return res.status(500).json(err);
                            stats.recentActivity = data;
                            return res.json(stats);
                        });
                    });
                });
            });
        });
    });
};
