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

//test a
app.get('/api/stock', async (req, res) => {
  try {
    const { base, depot, article, dateDebut, dateFin } = req.query;
    if (!base)      return res.status(400).json({ error: 'Base obligatoire' });
    if (!dateDebut) return res.status(400).json({ error: 'Date début obligatoire' });
    if (!dateFin)   return res.status(400).json({ error: 'Date fin obligatoire' });

    const pool = await poolPromise;
    const request = pool.request();

    request.input('dateDebut', sql.Date, dateDebut);
    request.input('dateFin',   sql.Date, dateFin);
    if (depot)   request.input('depot',   sql.NVarChar(50), depot);
    if (article) request.input('article', sql.NVarChar(50), article);

    let filtreDepot   = depot   ? `AND dl.DE_No  = @depot`   : '';
    let filtreArticle = article ? `AND dl.AR_Ref = @article` : '';

    const query = `
      WITH

      StockInitial AS
      (
          SELECT
              dl.AR_Ref,
              dl.DE_No,
              SUM(CASE WHEN dl.DL_MvtStock = 1 THEN  dl.DL_Qte
                       WHEN dl.DL_MvtStock = 3 THEN -dl.DL_Qte
                       ELSE 0 END) AS QteInitiale,
              SUM(CASE WHEN dl.DL_MvtStock = 1 THEN  dl.DL_Qte * dl.DL_PrixRU
                       WHEN dl.DL_MvtStock = 3 THEN -dl.DL_Qte * dl.DL_CMUP
                       ELSE 0 END) AS ValeurInitiale
          FROM [${base}].dbo.F_DOCLIGNE dl
          WHERE dl.DL_MvtStock IN (1, 3)
            AND CAST(dl.DO_Date AS DATE) < @dateDebut
            ${filtreDepot.replace('dl.DE_No', 'dl.DE_No')}
            ${filtreArticle.replace('dl.AR_Ref', 'dl.AR_Ref')}
          GROUP BY dl.AR_Ref, dl.DE_No
      ),

      Mouvements AS
      (
          SELECT
              dl.AR_Ref,
              fa.AR_Design,
              dl.DL_No,
              CAST(dl.DO_Date AS DATE)  AS DateJour,
              dl.DE_No,
              dp.DE_Intitule,
              dl.DL_MvtStock,
              CASE WHEN dl.DL_MvtStock = 1 THEN  dl.DL_Qte
                   WHEN dl.DL_MvtStock = 3 THEN -dl.DL_Qte END AS QteSignee,
              CASE WHEN dl.DL_MvtStock = 1 THEN dl.DL_Qte ELSE 0 END AS QteEntree,
              CASE WHEN dl.DL_MvtStock = 3 THEN dl.DL_Qte ELSE 0 END AS QteSortie,
              CASE WHEN dl.DL_MvtStock = 1 THEN dl.DL_PrixRU
                   WHEN dl.DL_MvtStock = 3 THEN dl.DL_CMUP END AS PRU_Ligne
          FROM [${base}].dbo.F_DOCLIGNE  dl
          INNER JOIN [${base}].dbo.F_DEPOT   dp ON dp.DE_No  = dl.DE_No
          INNER JOIN [${base}].dbo.F_ARTICLE fa ON fa.AR_Ref = dl.AR_Ref
          WHERE CAST(dl.DO_Date AS DATE) BETWEEN @dateDebut AND @dateFin
            AND dl.DL_MvtStock IN (1, 3)
            ${filtreDepot}
            ${filtreArticle}
      ),

      Cumuls AS
      (
          SELECT
              m.*,
              ISNULL(si.QteInitiale, 0) +
              ISNULL(SUM(m.QteSignee) OVER (
                  PARTITION BY m.AR_Ref, m.DE_No
                  ORDER BY m.DateJour, m.DL_No
                  ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
              ), 0) AS StockAvant,
              ISNULL(si.QteInitiale, 0) +
              SUM(m.QteSignee) OVER (
                  PARTITION BY m.AR_Ref, m.DE_No
                  ORDER BY m.DateJour, m.DL_No
                  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              ) AS StockApres,
              ISNULL(si.ValeurInitiale, 0) +
              SUM(m.QteSignee * m.PRU_Ligne) OVER (
                  PARTITION BY m.AR_Ref, m.DE_No
                  ORDER BY m.DateJour, m.DL_No
                  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              ) AS ValeurApres,
              ROW_NUMBER() OVER (
                  PARTITION BY m.AR_Ref, m.DE_No, m.DateJour
                  ORDER BY m.DL_No DESC
              ) AS DernierMvt
          FROM Mouvements m
          LEFT JOIN StockInitial si
              ON si.AR_Ref = m.AR_Ref AND si.DE_No = m.DE_No
      ),

      TotauxJour AS
      (
          SELECT DateJour, AR_Ref, AR_Design, DE_No, DE_Intitule,
                 SUM(QteEntree) AS TotalEntree,
                 SUM(QteSortie) AS TotalSortie
          FROM Cumuls
          GROUP BY DateJour, AR_Ref, AR_Design, DE_No, DE_Intitule
      ),

      EtatJour AS
      (
          SELECT DateJour, AR_Ref, DE_No,
                 MAX(CASE WHEN DernierMvt = 1 THEN StockApres  END) AS StockFinal,
                 MAX(CASE WHEN DernierMvt = 1 THEN ValeurApres END) AS ValeurFinale
          FROM Cumuls
          GROUP BY DateJour, AR_Ref, DE_No
      ),

      JourDepot AS
      (
          SELECT t.DateJour, t.AR_Ref, t.AR_Design, t.DE_No, t.DE_Intitule,
                 t.TotalEntree, t.TotalSortie, e.StockFinal, e.ValeurFinale
          FROM TotauxJour t
          INNER JOIN EtatJour e
              ON e.DateJour = t.DateJour AND e.DE_No = t.DE_No AND e.AR_Ref = t.AR_Ref
      ),

      Calendrier AS
      (
          SELECT @dateDebut AS DateJour
          UNION ALL
          SELECT DATEADD(DAY, 1, DateJour)
          FROM Calendrier
          WHERE DateJour < @dateFin
      ),

      ArticleDepot AS
      (
          SELECT DISTINCT AR_Ref, AR_Design, DE_No, DE_Intitule
          FROM JourDepot
      ),

      JoursSansMvt AS
      (
          SELECT
              c.DateJour, a.AR_Ref, a.AR_Design, a.DE_No, a.DE_Intitule,
              ISNULL((SELECT TOP 1 StockFinal FROM JourDepot j
                      WHERE j.AR_Ref = a.AR_Ref AND j.DE_No = a.DE_No
                        AND j.DateJour <= c.DateJour
                      ORDER BY j.DateJour DESC),
                     ISNULL((SELECT QteInitiale FROM StockInitial si
                             WHERE si.AR_Ref = a.AR_Ref AND si.DE_No = a.DE_No), 0)
              ) AS StockReporte,
              ISNULL((SELECT TOP 1 ValeurFinale FROM JourDepot j
                      WHERE j.AR_Ref = a.AR_Ref AND j.DE_No = a.DE_No
                        AND j.DateJour <= c.DateJour
                      ORDER BY j.DateJour DESC),
                     ISNULL((SELECT ValeurInitiale FROM StockInitial si
                             WHERE si.AR_Ref = a.AR_Ref AND si.DE_No = a.DE_No), 0)
              ) AS ValeurReportee
          FROM Calendrier c
          CROSS JOIN ArticleDepot a
          WHERE NOT EXISTS (
              SELECT 1 FROM JourDepot j
              WHERE j.AR_Ref = a.AR_Ref AND j.DE_No = a.DE_No AND j.DateJour = c.DateJour
          )
      )

      SELECT
          N'${base}'       AS NomBase,
          j.DateJour       AS [Date],
          j.AR_Ref         AS Article,
          j.AR_Design      AS Designation,
          j.DE_No          AS Depot,
          j.DE_Intitule    AS NomDepot,
          j.TotalEntree    AS TotalEntrees,
          j.TotalSortie    AS TotalSorties,
          j.StockFinal,
          ROUND(j.ValeurFinale, 2) AS Solde
      FROM JourDepot j

      UNION ALL

      SELECT
          N'${base}',
          s.DateJour, s.AR_Ref, s.AR_Design, s.DE_No, s.DE_Intitule,
          0, 0,
          s.StockReporte,
          ROUND(s.ValeurReportee, 2)
      FROM JoursSansMvt s

      ORDER BY Article, Depot, [Date]
      OPTION (MAXRECURSION 10000)
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(process.env.PORT, () =>
  console.log(`✅ Backend lancé sur http://localhost:${process.env.PORT}`)
);