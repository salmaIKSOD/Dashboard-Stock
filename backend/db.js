const sql = require('mssql');

const config = {
  server: 'SALMAIKSOD\\SAGE100',
  database: 'StockAnalytics',
  user: 'sa',
  password: '123456',
  port: 1433,
  // ajouter deux ligne
  requestTimeout:    300000,   // 5 minutes par requête
  connectionTimeout:  30000,   // 30 secondes pour la connexion
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