// const sql = require('mssql');
// require('dotenv').config();
// // require('dotenv').config({ path: './API/.env' });

// const config = {
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT) || 1433,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true,
//   },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
// };

// let pool = null;

// async function getPool() {
//   if (!pool) {
//     pool = await sql.connect(config);
//     console.log('✅ Connecté à SQL Server —', process.env.DB_NAME);
//   }
//   return pool;
// }

// module.exports = { getPool, sql };


const sql = require('mssql');

const config = {
  server: 'SALMAIKSOD\\SAGE100',
  database: 'StockAnalytics',
  user: 'sa',
  password: '123456',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('✅ Connecté à SQL Server — StockAnalytics');
  }
  return pool;
}

module.exports = { getPool, sql };
// ancienn db.js
// const sql = require('mssql');
// require('dotenv').config();

// const config = {
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT),
//   requestTimeout: 300000,   // ← 120 secondes au lieu de 15
//   connectionTimeout: 30000,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true,
//   }
// };

// const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then(pool => { console.log('Connecté à SQL Server ✅'); return pool; })
//   .catch(err => console.error('Erreur connexion DB:', err));

// module.exports = { sql, poolPromise };