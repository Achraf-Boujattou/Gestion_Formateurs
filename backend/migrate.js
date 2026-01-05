const fs = require('fs');
const db = require('./src/config/db');

const sql = fs.readFileSync('schema.sql', 'utf8');

// Split by semicolon, but be careful with comments or strings.
// Basic split for now as the schema.sql is simple.
const queries = sql.split(';').filter(q => q.trim() !== '');

const runQueries = async () => {
    for (const query of queries) {
        try {
            await new Promise((resolve, reject) => {
                db.query(query, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        } catch (err) {
            console.error('Error executing query:', query);
            console.error(err);
        }
    }
    console.log('Database schema synchronized.');
    process.exit();
};

runQueries();
