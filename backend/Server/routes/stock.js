//  l'encien V3 avec base StockAnalytics //////////////////////////////////////////////////////////////////
// ── backend/Server/routes/stock.js — version optimisée ───────

const express = require('express');
const router  = express.Router();
const { getPool, sql } = require('../../db');

// ── Cache mémoire (TTL différencié par endpoint) ──────────────
const cache = new Map();
const TTL = {
  bases:    30 * 60 * 1000,   // 30 min — changent rarement
  filtres:  30 * 60 * 1000,   // 30 min — servis depuis le cache SQL
  mouvements: 2 * 60 * 1000,  // 2 min  — données temps réel
};

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  const ttl = TTL[key.split(':')[0]] || 5 * 60 * 1000;
  if (Date.now() - entry.ts > ttl) { cache.delete(key); return null; }
  return entry.data;
}
function setCached(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ── Préchargement au démarrage ────────────────────────────────
// Evite la première requête lente après redémarrage du serveur
async function warmupCache() {
  try {
    const pool = await getPool();

    // Bases
    const bases = await pool.request().execute('stock.SP_GetBases');
    setCached('bases', bases.recordset);
    console.log(`[warmup] bases chargées (${bases.recordset.length})`);

    // Filtres de chaque base active
    for (const b of bases.recordset) {
      const cacheKey = `filtres:${b.BaseName}:null:null`;
      const req = pool.request();
      req.input('Base',           sql.NVarChar(128), b.BaseName);
      req.input('CL_No1',         sql.Int,           null);
      req.input('FA_CodeFamille', sql.NVarChar(10),  null);
      const result = await req.execute('stock.SP_GetFiltres');
      const [articles, depots, familles, cat1, cat2, cat3, cat4] = result.recordsets;
      setCached(cacheKey, { articles, depots, familles, cat1, cat2, cat3, cat4 });
      console.log(`[warmup] filtres ${b.BaseName} préchargés`);
    }
  } catch (err) {
    console.warn('[warmup] échec (non bloquant):', err.message);
  }
}

// Lancer le warmup 2 secondes après le démarrage du module
setTimeout(warmupCache, 2000);

// ── GET /api/bases ────────────────────────────────────────────
router.get('/bases', async (req, res) => {
  const cached = getCached('bases');
  if (cached) return res.json(cached);
  try {
    const pool   = await getPool();
    const result = await pool.request().execute('stock.SP_GetBases');
    setCached('bases', result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('[/bases]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/filtres ──────────────────────────────────────────
router.get('/filtres', async (req, res) => {
  const { base, cl_no1, fa_codefamille } = req.query;
  if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

  const cacheKey = `filtres:${base}:${cl_no1 || 'null'}:${fa_codefamille || 'null'}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[/filtres] cache hit — ${cacheKey}`);
    return res.json(cached);
  }

  try {
    const pool    = await getPool();
    const request = pool.request();
    // Timeout court car SP_GetFiltres v2 lit le cache SQL (rapide)
    request.timeout = 15000;
    request.input('Base',           sql.NVarChar(128), base);
    request.input('CL_No1',         sql.Int,           cl_no1         ? parseInt(cl_no1) : null);
    request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);

    const t0     = Date.now();
    const result = await request.execute('stock.SP_GetFiltres');
    console.log(`[/filtres] ${Date.now() - t0}ms — ${base}`);

    const [articles, depots, familles, cat1, cat2, cat3, cat4] = result.recordsets;
    const data = { articles, depots, familles, cat1, cat2, cat3, cat4 };
    setCached(cacheKey, data);
    res.json(data);
  } catch (err) {
    console.error('[/filtres]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/mouvements ───────────────────────────────────────
router.get('/mouvements', async (req, res) => {
  const {
    base, dateDebut, dateFin, depot, article,
    fa_codefamille, cl_no1, cl_no2, cl_no3, cl_no4,
  } = req.query;
  if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

  // Clé de cache pour les mouvements (TTL court = 2 min)
  const cacheKey = `mouvements:${JSON.stringify(req.query)}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.timeout = 120000;
    request.input('Base',           sql.NVarChar(128), base);
    request.input('DateDebut',      sql.Date,          dateDebut      || null);
    request.input('DateFin',        sql.Date,          dateFin        || null);
    request.input('Depot',          sql.Int,           depot          ? parseInt(depot)  : null);
    request.input('Article',        sql.NVarChar(50),  article        || null);
    request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);
    request.input('CL_No1',        sql.Int,            cl_no1         ? parseInt(cl_no1) : null);
    request.input('CL_No2',        sql.Int,            cl_no2         ? parseInt(cl_no2) : null);
    request.input('CL_No3',        sql.Int,            cl_no3         ? parseInt(cl_no3) : null);
    request.input('CL_No4',        sql.Int,            cl_no4         ? parseInt(cl_no4) : null);

    const t0     = Date.now();
    const result = await request.execute('stock.SP_GetMouvements');
    console.log(`[/mouvements] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
    setCached(cacheKey, result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('[/mouvements]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/stock ────────────────────────────────────────────
router.get('/stock', async (req, res) => {
  const {
    base, dateDebut, dateFin, depot, article,
    fa_codefamille, cl_no1, cl_no2, cl_no3, cl_no4,
  } = req.query;
  if (!base)      return res.status(400).json({ error: 'Paramètre base requis' });
  if (!dateDebut) return res.status(400).json({ error: 'Paramètre dateDebut requis' });
  if (!dateFin)   return res.status(400).json({ error: 'Paramètre dateFin requis' });

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.timeout = 300000;
    request.input('Base',           sql.NVarChar(128), base);
    request.input('DateDebut',      sql.Date,          dateDebut);
    request.input('DateFin',        sql.Date,          dateFin);
    request.input('Depot',          sql.Int,           depot          ? parseInt(depot)  : null);
    request.input('Article',        sql.NVarChar(50),  article        || null);
    request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);
    request.input('CL_No1',        sql.Int,            cl_no1         ? parseInt(cl_no1) : null);
    request.input('CL_No2',        sql.Int,            cl_no2         ? parseInt(cl_no2) : null);
    request.input('CL_No3',        sql.Int,            cl_no3         ? parseInt(cl_no3) : null);
    request.input('CL_No4',        sql.Int,            cl_no4         ? parseInt(cl_no4) : null);

    const t0     = Date.now();
    const result = await request.execute('stock.SP_GetStockJournalier');
    console.log(`[/stock] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
    res.json(result.recordset);
  } catch (err) {
    console.error('[/stock]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/cache — forcer un rechargement ────────────────
router.delete('/cache', async (req, res) => {
  const size = cache.size;
  cache.clear();
  console.log(`[/cache] ${size} entrées supprimées`);
  // Optionnel : relancer aussi le cache SQL
  try {
    const pool = await getPool();
    await pool.request().execute('stock.SP_RefreshCacheFiltres');
    console.log('[/cache] Cache SQL rechargé');
  } catch (err) {
    console.warn('[/cache] Refresh SQL échoué:', err.message);
  }
  // Re-warmup
  setTimeout(warmupCache, 500);
  res.json({ message: `Cache vidé (${size} entrées) et rechargé` });
});

module.exports = router;



















//  l'encien V2 avec base StockAnalytics //////////////////////////////////////////////////////////////////
// const express = require('express');
// const router  = express.Router();
// const { getPool, sql } = require('../../db');

// // ── Cache mémoire simple (5 minutes) ─────────────────────────
// // Evite de recharger les filtres à chaque changement de base
// const cache = new Map();
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes en ms

// function getCached(key) {
//   const entry = cache.get(key);
//   if (!entry) return null;
//   if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
//   return entry.data;
// }
// function setCached(key, data) {
//   cache.set(key, { data, ts: Date.now() });
// }

// // ── GET /api/bases ────────────────────────────────────────────
// router.get('/bases', async (req, res) => {
//   // Les bases changent rarement → cache 10 minutes
//   const cached = getCached('bases');
//   if (cached) return res.json(cached);

//   try {
//     const pool   = await getPool();
//     const result = await pool.request().execute('stock.SP_GetBases');
//     setCached('bases', result.recordset);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/bases]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── GET /api/filtres ──────────────────────────────────────────
// // Cache par combinaison (base + cl_no1 + fa_codefamille)
// router.get('/filtres', async (req, res) => {
//   const { base, cl_no1, fa_codefamille } = req.query;
//   if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

//   // Clé de cache unique
//   const cacheKey = `filtres:${base}:${cl_no1 || 'null'}:${fa_codefamille || 'null'}`;
//   const cached = getCached(cacheKey);
//   if (cached) {
//     console.log(`[/filtres] cache hit — ${cacheKey}`);
//     return res.json(cached);
//   }

//   try {
//     const pool    = await getPool();
//     const request = pool.request();
//     request.input('Base',           sql.NVarChar(128), base);
//     request.input('CL_No1',         sql.Int,           cl_no1         ? parseInt(cl_no1) : null);
//     request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);

//     const t0     = Date.now();
//     const result = await request.execute('stock.SP_GetFiltres');
//     console.log(`[/filtres] ${Date.now() - t0}ms — ${base}`);

//     const [articles, depots, familles, cat1, cat2, cat3, cat4] = result.recordsets;
//     const data = { articles, depots, familles, cat1, cat2, cat3, cat4 };

//     setCached(cacheKey, data);
//     res.json(data);
//   } catch (err) {
//     console.error('[/filtres]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── GET /api/mouvements ───────────────────────────────────────
// router.get('/mouvements', async (req, res) => {
//   const {
//     base, dateDebut, dateFin, depot, article,
//     fa_codefamille, cl_no1, cl_no2, cl_no3, cl_no4,
//   } = req.query;
//   if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

//   try {
//     const pool    = await getPool();
//     const request = pool.request();
//     request.timeout = 300000;
//     request.input('Base',           sql.NVarChar(128), base);
//     request.input('DateDebut',      sql.Date,          dateDebut      || null);
//     request.input('DateFin',        sql.Date,          dateFin        || null);
//     request.input('Depot',          sql.Int,           depot          ? parseInt(depot)  : null);
//     request.input('Article',        sql.NVarChar(50),  article        || null);
//     request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);
//     request.input('CL_No1',        sql.Int,            cl_no1         ? parseInt(cl_no1) : null);
//     request.input('CL_No2',        sql.Int,            cl_no2         ? parseInt(cl_no2) : null);
//     request.input('CL_No3',        sql.Int,            cl_no3         ? parseInt(cl_no3) : null);
//     request.input('CL_No4',        sql.Int,            cl_no4         ? parseInt(cl_no4) : null);

//     const t0     = Date.now();
//     const result = await request.execute('stock.SP_GetMouvements');
//     console.log(`[/mouvements] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/mouvements]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── GET /api/stock ────────────────────────────────────────────
// router.get('/stock', async (req, res) => {
//   const {
//     base, dateDebut, dateFin, depot, article,
//     fa_codefamille, cl_no1, cl_no2, cl_no3, cl_no4,
//   } = req.query;
//   if (!base)      return res.status(400).json({ error: 'Paramètre base requis' });
//   if (!dateDebut) return res.status(400).json({ error: 'Paramètre dateDebut requis' });
//   if (!dateFin)   return res.status(400).json({ error: 'Paramètre dateFin requis' });

//   try {
//     const pool    = await getPool();
//     const request = pool.request();
//     request.timeout = 300000;
//     request.input('Base',           sql.NVarChar(128), base);
//     request.input('DateDebut',      sql.Date,          dateDebut);
//     request.input('DateFin',        sql.Date,          dateFin);
//     request.input('Depot',          sql.Int,           depot          ? parseInt(depot)  : null);
//     request.input('Article',        sql.NVarChar(50),  article        || null);
//     request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);
//     request.input('CL_No1',        sql.Int,            cl_no1         ? parseInt(cl_no1) : null);
//     request.input('CL_No2',        sql.Int,            cl_no2         ? parseInt(cl_no2) : null);
//     request.input('CL_No3',        sql.Int,            cl_no3         ? parseInt(cl_no3) : null);
//     request.input('CL_No4',        sql.Int,            cl_no4         ? parseInt(cl_no4) : null);

//     const t0     = Date.now();
//     const result = await request.execute('stock.SP_GetStockJournalier');
//     console.log(`[/stock] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/stock]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── DELETE /api/cache — vider le cache manuellement si besoin ─
// router.delete('/cache', (req, res) => {
//   const size = cache.size;
//   cache.clear();
//   console.log(`[/cache] ${size} entrées supprimées`);
//   res.json({ message: `Cache vidé (${size} entrées)` });
// });

// module.exports = router;











//  l'encien avec base StockAnalyticss //////////////////////////////////////////////////////////////////
// const express = require('express');
// const router  = express.Router();
// const { getPool, sql } = require('../../db');

// // ── GET /api/bases 
// router.get('/bases', async (req, res) => {
//   try {
//     const pool   = await getPool();
//     const result = await pool.request().execute('stock.SP_GetBases');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/bases]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── GET /api/filtres 
// // SP_GetFiltres retourne 6 recordsets dans cet ordre :
// router.get('/filtres', async (req, res) => {
//   const { base, cl_no1, fa_codefamille} = req.query;
//   if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

//   try {
//     const pool    = await getPool();
//     const request = pool.request();
//     request.input('Base',   sql.NVarChar(128), base);
//     request.input('CL_No1', sql.Int, cl_no1 ? parseInt(cl_no1) : null);
//     request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille || null);
//     const result = await request.execute('stock.SP_GetFiltres');

//     // Destructuration des 7 recordsets retournés par la procédure
//     const [articles, depots, familles, cat1, cat2, cat3, cat4] = result.recordsets;

//     res.json({ articles, depots, familles, cat1, cat2, cat3, cat4 });
//   } catch (err) {
//     console.error('[/filtres]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── GET /api/mouvements 
// router.get('/mouvements', async (req, res) => {
//   const {
//     base, dateDebut, dateFin, depot, article,
//     fa_codefamille, cl_no1, cl_no2, cl_no3, cl_no4,
//   } = req.query;
//   if (!base) return res.status(400).json({ error: 'Paramètre base requis' });

//   try {
//     const pool    = await getPool();
//     const request = pool.request();
//     request.timeout = 300000;
//     request.input('Base',           sql.NVarChar(128), base);
//     request.input('DateDebut',      sql.Date,          dateDebut         || null);
//     request.input('DateFin',        sql.Date,          dateFin           || null);
//     request.input('Depot',          sql.Int,           depot             ? parseInt(depot)  : null);
//     request.input('Article',        sql.NVarChar(50),  article           || null);
//     request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille    || null);
//     request.input('CL_No1',        sql.Int,            cl_no1            ? parseInt(cl_no1) : null);
//     request.input('CL_No2',        sql.Int,            cl_no2            ? parseInt(cl_no2) : null);
//     request.input('CL_No3',        sql.Int,            cl_no3            ? parseInt(cl_no3) : null);
//     request.input('CL_No4',        sql.Int,            cl_no4            ? parseInt(cl_no4) : null);

//     const t0     = Date.now();
//     const result = await request.execute('stock.SP_GetMouvements');
//     console.log(`[/mouvements] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/mouvements]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── GET /api/stock ──
// router.get('/stock', async (req, res) => {
//   const {
//     base, dateDebut, dateFin, depot, article,
//     fa_codefamille, cl_no1, cl_no2, cl_no3, cl_no4,
//   } = req.query;
//   if (!base)      return res.status(400).json({ error: 'Paramètre base requis' });
//   if (!dateDebut) return res.status(400).json({ error: 'Paramètre dateDebut requis' });
//   if (!dateFin)   return res.status(400).json({ error: 'Paramètre dateFin requis' });

//   try {
//     const pool    = await getPool();
//     const request = pool.request();
//     request.timeout = 300000;
//     request.input('Base',           sql.NVarChar(128), base);
//     request.input('DateDebut',      sql.Date,          dateDebut);
//     request.input('DateFin',        sql.Date,          dateFin);
//     request.input('Depot',          sql.Int,           depot             ? parseInt(depot)  : null);
//     request.input('Article',        sql.NVarChar(50),  article           || null);
//     request.input('FA_CodeFamille', sql.NVarChar(10),  fa_codefamille    || null);
//     request.input('CL_No1',        sql.Int,            cl_no1            ? parseInt(cl_no1) : null);
//     request.input('CL_No2',        sql.Int,            cl_no2            ? parseInt(cl_no2) : null);
//     request.input('CL_No3',        sql.Int,            cl_no3            ? parseInt(cl_no3) : null);
//     request.input('CL_No4',        sql.Int,            cl_no4            ? parseInt(cl_no4) : null);

//     const t0     = Date.now();
//     const result = await request.execute('stock.SP_GetStockJournalier');
//     console.log(`[/stock] ${result.recordset.length} lignes en ${Date.now() - t0}ms`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('[/stock]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;