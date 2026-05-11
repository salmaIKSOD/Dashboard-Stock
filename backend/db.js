const sql = require('mssql');
require('dotenv').config();

// const config = {
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT),
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true,
//   }
// };
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  requestTimeout: 120000,   // ← 120 secondes au lieu de 15
  connectionTimeout: 30000,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => { console.log('Connecté à SQL Server ✅'); return pool; })
  .catch(err => console.error('Erreur connexion DB:', err));

module.exports = { sql, poolPromise };