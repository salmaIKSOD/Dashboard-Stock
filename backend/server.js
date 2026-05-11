// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const { sql, poolPromise } = require('./db');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get('/', (req, res) => res.json({ status: 'Backend OK' }));

// // GET /api/bases
// app.get('/api/bases', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query(`
//       SELECT NomBase, LibelleBase
//       FROM StockAnalytics.stock.BasesConnues
//       WHERE Actif = 1
//       ORDER BY LibelleBase
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/depots?base=X
// app.get('/api/depots', async (req, res) => {
//   try {
//     const { base } = req.query;
//     const pool = await poolPromise;
//     const result = await pool.request()
//       .input('base', sql.NVarChar, base)
//       .query(`
//         SELECT DISTINCT Depot, NomDepot
//         FROM StockAnalytics.stock.VueStockUnifie
//         WHERE NomBase = @base
//         ORDER BY NomDepot
//       `);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/articles?base=X
// app.get('/api/articles', async (req, res) => {
//   try {
//     const { base } = req.query;
//     const pool = await poolPromise;
//     const result = await pool.request()
//       .input('base', sql.NVarChar, base)
//       .query(`
//         SELECT DISTINCT Article, Designation
//         FROM StockAnalytics.stock.VueStockUnifie
//         WHERE NomBase = @base
//         ORDER BY Designation
//       `);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/stock
// app.get('/api/stock', async (req, res) => {
//   try {
//     const { base, depot, article, dateDebut, dateFin } = req.query;
//     const pool = await poolPromise;
//     const request = pool.request();

//     let query = `
//       SELECT *
//       FROM StockAnalytics.stock.VueStockUnifie
//       WHERE 1=1
//     `;

//     if (base)      { request.input('base', sql.NVarChar, base);       query += ` AND NomBase = @base`; }
//     if (depot)     { request.input('depot', sql.NVarChar, depot);     query += ` AND Depot = @depot`; }
//     if (article)   { request.input('article', sql.NVarChar, article); query += ` AND Article = @article`; }
//     if (dateDebut) { request.input('dateDebut', sql.Date, dateDebut); query += ` AND [Date] >= @dateDebut`; }
//     if (dateFin)   { request.input('dateFin', sql.Date, dateFin);     query += ` AND [Date] <= @dateFin`; }

//     query += ` ORDER BY Article, Depot, [Date] OPTION (MAXRECURSION 3660)`;

//     const result = await request.query(query);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ← CETTE LIGNE EST INDISPENSABLE - garde le serveur ouvert
// app.listen(process.env.PORT, () =>
//   console.log(`✅ Backend lancé sur http://localhost:${process.env.PORT}`)
// );

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sql, poolPromise } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => res.json({ status: 'Backend OK' }));

// GET /api/bases
app.get('/api/bases', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT NomBase, LibelleBase
      FROM StockAnalytics.stock.BasesConnues
      WHERE Actif = 1
      ORDER BY LibelleBase
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/depots?base=X
app.get('/api/depots', async (req, res) => {
  try {
    const { base } = req.query;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('base', sql.NVarChar, base)
      .query(`
        SELECT DISTINCT Depot, NomDepot
        FROM StockAnalytics.stock.VueStockUnifie
        WHERE NomBase = @base
        ORDER BY NomDepot
        OPTION (MAXRECURSION 3660)
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles?base=X
app.get('/api/articles', async (req, res) => {
  try {
    const { base } = req.query;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('base', sql.NVarChar, base)
      .query(`
        SELECT DISTINCT Article, Designation
        FROM StockAnalytics.stock.VueStockUnifie
        WHERE NomBase = @base
        ORDER BY Designation
        OPTION (MAXRECURSION 3660)
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stock
app.get('/api/stock', async (req, res) => {
  try {
    const { base, depot, article, dateDebut, dateFin } = req.query;
    const pool = await poolPromise;
    const request = pool.request();

    let query = `
      SELECT *
      FROM StockAnalytics.stock.VueStockUnifie
      WHERE 1=1
    `;

    if (base)      { request.input('base', sql.NVarChar, base);       query += ` AND NomBase = @base`; }
    if (depot)     { request.input('depot', sql.NVarChar, depot);     query += ` AND Depot = @depot`; }
    if (article)   { request.input('article', sql.NVarChar, article); query += ` AND Article = @article`; }
    if (dateDebut) { request.input('dateDebut', sql.Date, dateDebut); query += ` AND [Date] >= @dateDebut`; }
    if (dateFin)   { request.input('dateFin', sql.Date, dateFin);     query += ` AND [Date] <= @dateFin`; }

    query += ` ORDER BY Article, Depot, [Date] OPTION (MAXRECURSION 3660)`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ← INDISPENSABLE - garde le serveur ouvert
app.listen(process.env.PORT, () =>
  console.log(`✅ Backend lancé sur http://localhost:${process.env.PORT}`)
);