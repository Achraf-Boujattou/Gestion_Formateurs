const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
