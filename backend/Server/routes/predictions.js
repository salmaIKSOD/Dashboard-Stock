// Proxy Express - ML// backend/Server/routes/predictions.js
const express = require("express");
const router  = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Helper fetch (Node 18+ a fetch natif, sinon : npm install node-fetch)
async function mlFetch(path, options = {}) {
  const url = `${ML_SERVICE_URL}${path}`;
  try {
    const res  = await fetch(url, options);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 503, data: { error: "ML service inaccessible", detail: err.message } };
  }
}

// ── GET /api/predictions/bases ────────────────────────────────
// Liste des bases actives (relayé depuis ML service)
router.get("/bases", async (req, res) => {
  const result = await mlFetch("/bases");
  res.status(result.status).json(result.data);
});

// ── GET /api/predictions/models/:base ─────────────────────────
// Modèles déjà entraînés pour une base
router.get("/models/:base", async (req, res) => {
  const result = await mlFetch(`/models/${encodeURIComponent(req.params.base)}`);
  res.status(result.status).json(result.data);
});

// ── GET /api/predictions/articles/:base ───────────────────────
// Articles disponibles pour une base
router.get("/articles/:base", async (req, res) => {
  const result = await mlFetch(`/articles/${encodeURIComponent(req.params.base)}`);
  res.status(result.status).json(result.data);
});

// ── GET /api/predictions/predict ──────────────────────────────
// ?base=STE_NGDM&article=MFRF001&depot=6&horizon=30
router.get("/predict", async (req, res) => {
  const { base, article, depot, horizon = 30 } = req.query;

  if (!base || !article || !depot) {
    return res.status(400).json({ error: "Paramètres requis : base, article, depot" });
  }

  const result = await mlFetch(
    `/predict/${encodeURIComponent(base)}/${encodeURIComponent(article)}/${depot}?horizon=${horizon}`
  );
  res.status(result.ok ? 200 : result.status).json(result.data);
});

// ── POST /api/predictions/train/:base ─────────────────────────
// Lance l'entraînement pour une base (appel manuel ou auto)
router.post("/train/:base", async (req, res) => {
  const result = await mlFetch(
    `/train/${encodeURIComponent(req.params.base)}`,
    { method: "POST" }
  );
  res.status(result.ok ? 202 : result.status).json(result.data);
});

// ── POST /api/predictions/train-all ───────────────────────────
router.post("/train-all", async (req, res) => {
  const result = await mlFetch("/train-all", { method: "POST" });
  res.status(result.ok ? 202 : result.status).json(result.data);
});

// ── GET /api/predictions/health ───────────────────────────────
router.get("/health", async (req, res) => {
  const result = await mlFetch("/health");
  res.status(result.ok ? 200 : 503).json(result.data);
});

module.exports = router;