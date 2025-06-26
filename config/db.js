const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync('./ca.pem') // El archivo .pem que te da Aiven
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
