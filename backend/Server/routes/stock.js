const express = require('express');
const router  = express.Router();
const { getPool, sql } = require('../../db');

// ── GET /api/bases ────────────────────────────────────────────
router.get('/bases', async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request().execute('stock.SP_GetBases');
    res.json(result.recordset);
  } catch (err) {
    console.error('[/bases]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/filtres ──────────────────────────────────────────
router.get('/filtres', async (req, res) => {
  const { base, cl_no1 } = req.query;
  if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.input('Base',   sql.NVarChar(128), base);
    request.input('CL_No1', sql.Int, cl_no1 ? parseInt(cl_no1) : null);
    const result = await request.execute('stock.SP_GetFiltres');
    const [articles, depots, cat1, cat2, cat3, cat4] = result.recordsets;
    res.json({ articles, depots, cat1, cat2, cat3, cat4 });
  } catch (err) {
    console.error('[/filtres]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/mouvements ───────────────────────────────────────
router.get('/mouvements', async (req, res) => {
  const { base, dateDebut, dateFin, depot, article, cl_no1, cl_no2, cl_no3, cl_no4 } = req.query;
  if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.timeout = 300000; // 5 min
    request.input('Base',      sql.NVarChar(128), base);
    request.input('DateDebut', sql.Date, dateDebut || null);
    request.input('DateFin',   sql.Date, dateFin   || null);
    request.input('Depot',     sql.Int,  depot   ? parseInt(depot)  : null);
    request.input('Article',   sql.NVarChar(50), article || null);
    request.input('CL_No1',   sql.Int,  cl_no1  ? parseInt(cl_no1) : null);
    request.input('CL_No2',   sql.Int,  cl_no2  ? parseInt(cl_no2) : null);
    request.input('CL_No3',   sql.Int,  cl_no3  ? parseInt(cl_no3) : null);
    request.input('CL_No4',   sql.Int,  cl_no4  ? parseInt(cl_no4) : null);

    const t0     = Date.now();
    const result = await request.execute('stock.SP_GetMouvements');
    console.log(`[/mouvements] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
    res.json(result.recordset);
  } catch (err) {
    console.error('[/mouvements]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/stock ────────────────────────────────────────────
router.get('/stock', async (req, res) => {
  const { base, dateDebut, dateFin, depot, article, cl_no1, cl_no2, cl_no3, cl_no4 } = req.query;
  if (!base)      return res.status(400).json({ error: 'Paramètre base requis' });
  if (!dateDebut) return res.status(400).json({ error: 'Paramètre dateDebut requis' });
  if (!dateFin)   return res.status(400).json({ error: 'Paramètre dateFin requis' });

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.timeout = 300000; // 5 min
    request.input('Base',      sql.NVarChar(128), base);
    request.input('DateDebut', sql.Date, dateDebut);
    request.input('DateFin',   sql.Date, dateFin);
    request.input('Depot',     sql.Int,  depot   ? parseInt(depot)  : null);
    request.input('Article',   sql.NVarChar(50), article || null);
    request.input('CL_No1',   sql.Int,  cl_no1  ? parseInt(cl_no1) : null);
    request.input('CL_No2',   sql.Int,  cl_no2  ? parseInt(cl_no2) : null);
    request.input('CL_No3',   sql.Int,  cl_no3  ? parseInt(cl_no3) : null);
    request.input('CL_No4',   sql.Int,  cl_no4  ? parseInt(cl_no4) : null);

    const t0     = Date.now();
    const result = await request.execute('stock.SP_GetStockJournalier');
    console.log(`[/stock] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
    res.json(result.recordset);
  } catch (err) {
    console.error('[/stock]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { getPool, sql } = require('../../db');

// // ────────────────────────────────────────────────────────────
// //  GET /api/bases
// //  Liste des bases SAGE actives → dropdown "Base"
// // ────────────────────────────────────────────────────────────
// router.get('/bases', async (req, res) => {
//   try {
//     const pool = await getPool();
//     const result = await pool.request().execute('stock.SP_GetBases');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/bases]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────
// //  GET /api/filtres?base=STE_NGDM&cl_no1=5
// //  Retourne articles, dépôts, catalogues N1..N4
// // ────────────────────────────────────────────────────────────
// router.get('/filtres', async (req, res) => {
//   const { base, cl_no1 } = req.query;
//   if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

//   try {
//     const pool = await getPool();
//     const request = pool.request();
//     request.input('Base', sql.NVarChar(128), base);
//     request.input('CL_No1', sql.Int, cl_no1 ? parseInt(cl_no1) : null);
//     const result = await request.execute('stock.SP_GetFiltres');

//     // La procédure retourne 5 recordsets : articles, depots, cat1, cat2, cat3, cat4
//     const [articles, depots, cat1, cat2, cat3, cat4] = result.recordsets;
//     res.json({ articles, depots, cat1, cat2, cat3, cat4 });
//   } catch (err) {
//     console.error('[/filtres]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────
// //  GET /api/mouvements?base=...&dateDebut=...&dateFin=...&...
// //  Tableau Entrées / Sorties / PRU / Valeur mouvement
// // ────────────────────────────────────────────────────────────
// router.get('/mouvements', async (req, res) => {
//   const { base, dateDebut, dateFin, depot, article, cl_no1, cl_no2, cl_no3, cl_no4 } = req.query;
//   if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

//   try {
//     const pool = await getPool();
//     const request = pool.request();
//     request.input('Base',      sql.NVarChar(128), base);
//     request.input('DateDebut', sql.Date, dateDebut || null);
//     request.input('DateFin',   sql.Date, dateFin   || null);
//     request.input('Depot',     sql.Int,  depot     ? parseInt(depot)  : null);
//     request.input('Article',   sql.NVarChar(50), article || null);
//     request.input('CL_No1',   sql.Int,  cl_no1    ? parseInt(cl_no1) : null);
//     request.input('CL_No2',   sql.Int,  cl_no2    ? parseInt(cl_no2) : null);
//     request.input('CL_No3',   sql.Int,  cl_no3    ? parseInt(cl_no3) : null);
//     request.input('CL_No4',   sql.Int,  cl_no4    ? parseInt(cl_no4) : null);

//     const result = await request.execute('stock.SP_GetMouvements');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/mouvements]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────
// //  GET /api/stock?base=...&dateDebut=...&dateFin=...&...
// //  Tableau Stock journalier (avec jours sans mouvement)
// // ────────────────────────────────────────────────────────────
// router.get('/stock', async (req, res) => {
//   const { base, dateDebut, dateFin, depot, article, cl_no1, cl_no2, cl_no3, cl_no4 } = req.query;
//   if (!base)      return res.status(400).json({ error: 'Paramètre base requis' });
//   if (!dateDebut) return res.status(400).json({ error: 'Paramètre dateDebut requis' });
//   if (!dateFin)   return res.status(400).json({ error: 'Paramètre dateFin requis' });

//   try {
//     const pool = await getPool();
//     const request = pool.request();
//     request.input('Base',      sql.NVarChar(128), base);
//     request.input('DateDebut', sql.Date, dateDebut);
//     request.input('DateFin',   sql.Date, dateFin);
//     request.input('Depot',     sql.Int,  depot   ? parseInt(depot)  : null);
//     request.input('Article',   sql.NVarChar(50), article || null);
//     request.input('CL_No1',   sql.Int,  cl_no1  ? parseInt(cl_no1) : null);
//     request.input('CL_No2',   sql.Int,  cl_no2  ? parseInt(cl_no2) : null);
//     request.input('CL_No3',   sql.Int,  cl_no3  ? parseInt(cl_no3) : null);
//     request.input('CL_No4',   sql.Int,  cl_no4  ? parseInt(cl_no4) : null);

//     const result = await request.execute('stock.SP_GetStockJournalier');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/stock]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
