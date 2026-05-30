// frontend/src/pages/AIPrevisions.js
// ─────────────────────────────────────────────────────────────
//  Page complète "AI Prévisions" — Dashboard Stock
//  Dépendances : recharts (npm install recharts)
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  getBases, getArticles, getTrainedModels,
  getPrediction, trainBase, checkMLHealth
} from "../api/predictionsApi";

// ── Icônes SVG inline (pas de dépendance externe) ─────────────
const Icons = {
  Brain:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5a2.5 2.5 0 0 1-2.5 2.5H9.5A2.5 2.5 0 0 1 7 2.5V2"/><path d="M12 5v14"/><path d="M5 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"/><path d="M19 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><circle cx="12" cy="12" r="3"/></svg>,
  Stock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l3 3 2-2 3 3"/></svg>,
  Alert:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Chart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Refresh:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  Train:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  Check:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Spinner:  () => <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
  Info:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

// ── Tooltip personnalisé pour le graphique ─────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name} :</span>
          <span className="font-semibold text-gray-800">
            {typeof p.value === "number" ? p.value.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Carte KPI ──────────────────────────────────────────────────
const KPICard = ({ label, value, unit = "unités", icon: Icon, color, sub }) => (
  <div className={`bg-white rounded-2xl p-5 border ${color.border} shadow-sm`}>
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <span className={`p-2 rounded-xl ${color.bg}`}>
        <span className={color.icon}><Icon /></span>
      </span>
    </div>
    <p className={`text-2xl font-bold ${color.text} tabular-nums`}>
      {typeof value === "number"
        ? value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
        : value}
    </p>
    <p className="text-xs text-gray-400 mt-1">{unit}</p>
    {sub && <p className={`text-xs mt-2 font-medium ${color.sub}`}>{sub}</p>}
  </div>
);

// ── Badge métrique ─────────────────────────────────────────────
const MetricBadge = ({ label, value }) => (
  <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
    <span className="text-lg font-bold text-gray-800 tabular-nums">{value ?? "—"}</span>
    <span className="text-xs text-gray-400 mt-0.5">{label}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════════
export default function AIPrevisions() {

  // ── État filtres ───────────────────────────────────────────
  const [bases,       setBases]       = useState([]);
  const [articles,    setArticles]    = useState([]);
  const [selectedBase,    setSelectedBase]    = useState("");
  const [selectedArticle, setSelectedArticle] = useState("");
  const [selectedDepot,   setSelectedDepot]   = useState("");
  const [horizon,     setHorizon]     = useState(30);

  // ── État données ───────────────────────────────────────────
  const [prediction,  setPrediction]  = useState(null);
  const [chartData,   setChartData]   = useState([]);
  const [mlStatus,    setMlStatus]    = useState("unknown"); // ok | error | unknown
  const [trainedModels, setTrainedModels] = useState([]);

  // ── État UI ────────────────────────────────────────────────
  const [loading,     setLoading]     = useState(false);
  const [training,    setTraining]    = useState(false);
  const [error,       setError]       = useState(null);
  const [trainMsg,    setTrainMsg]    = useState(null);

  // ── Dépôts distincts selon l'article sélectionné ──────────
  const depots = articles
    .filter(a => !selectedArticle || a.AR_Ref === selectedArticle)
    .reduce((acc, a) => {
      if (!acc.find(d => d.DE_No === a.DE_No))
        acc.push({ DE_No: a.DE_No, DE_Intitule: a.DE_Intitule });
      return acc;
    }, []);

  // Articles distincts
  const articlesDistincts = articles.reduce((acc, a) => {
    if (!acc.find(x => x.AR_Ref === a.AR_Ref))
      acc.push({ AR_Ref: a.AR_Ref, AR_Design: a.AR_Design });
    return acc;
  }, []);

  // ── Vérifier santé ML au montage ──────────────────────────
  useEffect(() => {
    checkMLHealth()
      .then(() => setMlStatus("ok"))
      .catch(() => setMlStatus("error"));
  }, []);

  // ── Charger les bases ──────────────────────────────────────
  useEffect(() => {
    getBases()
      .then(data => setBases(data.bases || []))
      .catch(() => {});
  }, []);

  // ── Charger articles quand base change ────────────────────
  useEffect(() => {
    if (!selectedBase) { setArticles([]); return; }
    setSelectedArticle("");
    setSelectedDepot("");
    setPrediction(null);
    setChartData([]);

    Promise.all([
      getArticles(selectedBase),
      getTrainedModels(selectedBase)
    ]).then(([artData, modData]) => {
      setArticles(artData.articles || []);
      setTrainedModels(modData.models || []);
    }).catch(() => {});
  }, [selectedBase]);

  // ── Reset dépôt quand article change ──────────────────────
  useEffect(() => {
    setSelectedDepot(depots.length === 1 ? String(depots[0].DE_No) : "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArticle]);

  // ── Construire les données graphique ─────────────────────
  const buildChartData = useCallback((pred) => {
    if (!pred) return [];
    const hist = (pred.historique || []).map(p => ({
      date:      p.date,
      reel:      p.valeur,
      type:      "historique"
    }));
    const forecast = (pred.prevision || []).map(p => ({
      date:      p.date,
      predit:    p.valeur,
      bas:       p.bas,
      haut:      p.haut,
      type:      "prevision"
    }));
    // Ajouter le point de jonction
    if (hist.length > 0 && forecast.length > 0) {
      forecast[0].reel = hist[hist.length - 1].reel;
    }
    return [...hist, ...forecast];
  }, []);

  // ── Lancer la prédiction ──────────────────────────────────
  const handlePredict = async () => {
    if (!selectedBase || !selectedArticle || !selectedDepot) return;
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const data = await getPrediction(
        selectedBase, selectedArticle, parseInt(selectedDepot), horizon
      );
      setPrediction(data);
      setChartData(buildChartData(data));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Lancer l'entraînement ─────────────────────────────────
  const handleTrain = async () => {
    if (!selectedBase) return;
    setTraining(true);
    setTrainMsg(null);
    try {
      await trainBase(selectedBase);
      setTrainMsg(`Entraînement lancé pour ${selectedBase}. Cela peut prendre quelques minutes.`);
    } catch (e) {
      setTrainMsg(`Erreur : ${e.message}`);
    } finally {
      setTraining(false);
    }
  };

  // ── Vérifie si modèle existe pour cet article/dépôt ──────
  const modelExists = trainedModels.some(
    m => m.ar_ref === selectedArticle && String(m.de_no) === String(selectedDepot)
  );

  // ── Date de jonction historique/prévision ─────────────────
  const dateJonction = prediction?.historique?.slice(-1)[0]?.date;

  // ════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-teal-50 rounded-xl text-teal-600"><Icons.Brain /></span>
          <div>
            <h1 className="text-lg font-bold text-gray-800">AI Prévisions</h1>
            <p className="text-xs text-gray-400">Prédiction de stock par article et dépôt</p>
          </div>
        </div>
        {/* Badge statut ML */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          mlStatus === "ok"
            ? "bg-green-50 text-green-700 border-green-100"
            : mlStatus === "error"
            ? "bg-red-50 text-red-600 border-red-100"
            : "bg-gray-50 text-gray-500 border-gray-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            mlStatus === "ok" ? "bg-green-500" : mlStatus === "error" ? "bg-red-500" : "bg-gray-400"
          }`} />
          {mlStatus === "ok" ? "ML Service actif" : mlStatus === "error" ? "ML Service hors ligne" : "Vérification..."}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">

        {/* ── Panneau filtres ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-teal-500"><Icons.Chart /></span>
            <h2 className="text-sm font-semibold text-gray-700">Paramètres de prévision</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-4">

            {/* Base */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Base SAGE
              </label>
              <select
                value={selectedBase}
                onChange={e => setSelectedBase(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              >
                <option value="">— Sélectionner —</option>
                {bases.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Article */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Article
              </label>
              <select
                value={selectedArticle}
                onChange={e => setSelectedArticle(e.target.value)}
                disabled={!selectedBase || articlesDistincts.length === 0}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition disabled:opacity-40"
              >
                <option value="">— Tous les articles —</option>
                {articlesDistincts.map(a => (
                  <option key={a.AR_Ref} value={a.AR_Ref}>
                    {a.AR_Ref} — {a.AR_Design?.slice(0, 28)}
                  </option>
                ))}
              </select>
            </div>

            {/* Dépôt */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Dépôt
              </label>
              <select
                value={selectedDepot}
                onChange={e => setSelectedDepot(e.target.value)}
                disabled={!selectedArticle || depots.length === 0}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition disabled:opacity-40"
              >
                <option value="">— Sélectionner —</option>
                {depots.map(d => (
                  <option key={d.DE_No} value={d.DE_No}>
                    {d.DE_No} — {d.DE_Intitule}
                  </option>
                ))}
              </select>
            </div>

            {/* Horizon */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Horizon (jours)
              </label>
              <div className="flex gap-1">
                {[7, 30, 60, 90].map(h => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                      horizon === h
                        ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Boutons action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePredict}
              disabled={!selectedBase || !selectedArticle || !selectedDepot || loading}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? <Icons.Spinner /> : <Icons.Chart />}
              {loading ? "Calcul en cours..." : "Lancer la prévision"}
            </button>

            <button
              onClick={handleTrain}
              disabled={!selectedBase || training}
              className="flex items-center gap-2 border border-gray-200 hover:border-teal-300 text-gray-600 hover:text-teal-600 px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40"
            >
              {training ? <Icons.Spinner /> : <Icons.Train />}
              {training ? "Entraînement..." : `Entraîner ${selectedBase || "base"}`}
            </button>

            {prediction && (
              <button
                onClick={() => { setPrediction(null); setChartData([]); }}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 px-4 py-2.5 rounded-xl text-sm transition"
              >
                <Icons.Refresh />
                Réinitialiser
              </button>
            )}

            {/* Badge modèle */}
            {selectedArticle && selectedDepot && (
              <span className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                modelExists
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {modelExists ? <Icons.Check /> : <Icons.Info />}
                {modelExists ? "Modèle disponible" : "Modèle non entraîné"}
              </span>
            )}
          </div>

          {/* Message entraînement */}
          {trainMsg && (
            <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-700">
              {trainMsg}
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <Icons.Alert />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ── KPIs ── */}
        {prediction && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <KPICard
              label="Stock prévu J+7"
              value={prediction.stock_j7}
              icon={Icons.Stock}
              color={{
                border: "border-teal-100",
                bg: "bg-teal-50",
                icon: "text-teal-600",
                text: "text-teal-700",
                sub: "text-teal-500"
              }}
              sub={`Article : ${prediction.ar_ref}`}
            />

            <KPICard
              label={`Stock prévu J+${horizon}`}
              value={prediction.stock_j30}
              icon={Icons.Chart}
              color={{
                border: "border-blue-100",
                bg: "bg-blue-50",
                icon: "text-blue-600",
                text: "text-blue-700",
                sub: "text-blue-500"
              }}
              sub={`Dépôt : ${prediction.de_intitule || prediction.de_no}`}
            />

            <KPICard
              label="Alerte rupture"
              value={prediction.alerte_rupture ? "⚠️ Risque détecté" : "✓ Stock suffisant"}
              unit={prediction.alerte_rupture
                ? `Prévue le ${prediction.date_rupture || "—"}`
                : `Seuil : ${prediction.seuil_alerte} unités`}
              icon={Icons.Alert}
              color={prediction.alerte_rupture
                ? { border: "border-red-100", bg: "bg-red-50", icon: "text-red-500", text: "text-red-600", sub: "text-red-400" }
                : { border: "border-green-100", bg: "bg-green-50", icon: "text-green-600", text: "text-green-700", sub: "text-green-500" }
              }
            />
          </div>
        )}

        {/* ── Graphique ── */}
        {prediction && chartData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Prévision — {prediction.ar_design || prediction.ar_ref}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Dépôt {prediction.de_no} · {prediction.de_intitule} · Horizon {horizon} jours
                </p>
              </div>

              {/* Métriques précision */}
              {prediction.metrics && Object.keys(prediction.metrics).length > 0 && (
                <div className="flex gap-3">
                  <MetricBadge label="MAE"  value={prediction.metrics.mae} />
                  <MetricBadge label="RMSE" value={prediction.metrics.rmse} />
                  <MetricBadge label="MAPE" value={prediction.metrics.mape != null ? `${prediction.metrics.mape}%` : null} />
                </div>
              )}
            </div>

            {/* Légende custom */}
            <div className="flex items-center gap-6 mb-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-teal-500 inline-block rounded" />
                Stock réel (historique)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 border-t-2 border-dashed border-orange-400 inline-block" />
                Prévision Prophet
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-3 bg-orange-100 inline-block rounded opacity-70" />
                Intervalle confiance 95%
              </span>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0.03} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={v => {
                    const d = new Date(v);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />

                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => v.toLocaleString("fr-FR")}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Ligne de séparation historique / prévision */}
                {dateJonction && (
                  <ReferenceLine
                    x={dateJonction}
                    stroke="#d1d5db"
                    strokeDasharray="4 4"
                    label={{ value: "Aujourd'hui", position: "insideTopLeft", fontSize: 9, fill: "#9ca3af" }}
                  />
                )}

                {/* Intervalle de confiance */}
                <Area
                  dataKey="haut"
                  stroke="none"
                  fill="url(#gradConf)"
                  name="Borne haute"
                  legendType="none"
                  connectNulls
                />
                <Area
                  dataKey="bas"
                  stroke="none"
                  fill="#ffffff"
                  name="Borne basse"
                  legendType="none"
                  connectNulls
                />

                {/* Stock réel */}
                <Line
                  type="monotone"
                  dataKey="reel"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                  name="Stock réel"
                  connectNulls
                />

                {/* Prévision */}
                <Line
                  type="monotone"
                  dataKey="predit"
                  stroke="#fb923c"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  name="Prévision"
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Tableau modèles entraînés ── */}
        {selectedBase && trainedModels.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-teal-500"><Icons.Brain /></span>
              <h2 className="text-sm font-semibold text-gray-700">
                Modèles entraînés — {selectedBase}
              </h2>
              <span className="ml-auto bg-teal-50 text-teal-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-100">
                {trainedModels.length} modèles
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Article", "Désignation", "Dépôt", "Données entraînement", "MAE", "MAPE", "Action"].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trainedModels.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-2.5 px-3 font-mono font-semibold text-gray-800">{m.ar_ref}</td>
                      <td className="py-2.5 px-3 text-gray-500 max-w-[200px] truncate">{m.ar_design}</td>
                      <td className="py-2.5 px-3 text-gray-600">{m.de_no} — {m.de_intitule}</td>
                      <td className="py-2.5 px-3 text-gray-500">{m.n_train} jours</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-teal-700">{m.metrics?.mae ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`font-semibold ${
                          m.metrics?.mape < 5 ? "text-green-600"
                          : m.metrics?.mape < 15 ? "text-amber-500"
                          : "text-red-500"
                        }`}>
                          {m.metrics?.mape != null ? `${m.metrics.mape}%` : "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            setSelectedArticle(m.ar_ref);
                            setSelectedDepot(String(m.de_no));
                          }}
                          className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                        >
                          Voir prévision →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── État vide ── */}
        {!prediction && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-teal-50 rounded-2xl text-teal-400 mb-4">
              <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8z"/>
                <path d="M32 20v12l8 8"/>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Sélectionnez une base, un article et un dépôt</p>
            <p className="text-gray-400 text-sm mt-1">puis cliquez sur "Lancer la prévision"</p>
          </div>
        )}

      </div>
    </div>
  );
}