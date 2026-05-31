// // frontend/src/pages/AIPrevisions.js
// // ─────────────────────────────────────────────────────────────
// //  Page complète "AI Prévisions" — Dashboard Stock
// //  Dépendances : recharts (npm install recharts)
// // ─────────────────────────────────────────────────────────────

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer, ReferenceLine
// } from "recharts";
// import {
//   getBases, getArticles, getTrainedModels,
//   getPrediction, trainBase, checkMLHealth
// } from "../api/predictionsApi";

// // ── Icônes SVG inline (pas de dépendance externe) ─────────────
// const Icons = {
//   Brain:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5a2.5 2.5 0 0 1-2.5 2.5H9.5A2.5 2.5 0 0 1 7 2.5V2"/><path d="M12 5v14"/><path d="M5 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"/><path d="M19 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><circle cx="12" cy="12" r="3"/></svg>,
//   Stock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l3 3 2-2 3 3"/></svg>,
//   Alert:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
//   Chart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
//   Refresh:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
//   Train:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
//   Check:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
//   Spinner:  () => <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
//   Info:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
// };

// // ── Tooltip personnalisé pour le graphique ─────────────────────
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
//       <p className="font-semibold text-gray-700 mb-2">{label}</p>
//       {payload.map((p, i) => (
//         <div key={i} className="flex items-center gap-2 mb-1">
//           <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
//           <span className="text-gray-500">{p.name} :</span>
//           <span className="font-semibold text-gray-800">
//             {typeof p.value === "number" ? p.value.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : "—"}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ── Carte KPI ──────────────────────────────────────────────────
// const KPICard = ({ label, value, unit = "unités", icon: Icon, color, sub }) => (
//   <div className={`bg-white rounded-2xl p-5 border ${color.border} shadow-sm`}>
//     <div className="flex items-start justify-between mb-3">
//       <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
//       <span className={`p-2 rounded-xl ${color.bg}`}>
//         <span className={color.icon}><Icon /></span>
//       </span>
//     </div>
//     <p className={`text-2xl font-bold ${color.text} tabular-nums`}>
//       {typeof value === "number"
//         ? value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
//         : value}
//     </p>
//     <p className="text-xs text-gray-400 mt-1">{unit}</p>
//     {sub && <p className={`text-xs mt-2 font-medium ${color.sub}`}>{sub}</p>}
//   </div>
// );

// // ── Badge métrique ─────────────────────────────────────────────
// const MetricBadge = ({ label, value }) => (
//   <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
//     <span className="text-lg font-bold text-gray-800 tabular-nums">{value ?? "—"}</span>
//     <span className="text-xs text-gray-400 mt-0.5">{label}</span>
//   </div>
// );

// // ════════════════════════════════════════════════════════════════
// //  COMPOSANT PRINCIPAL
// // ════════════════════════════════════════════════════════════════
// export default function AIPrevisions() {

//   // ── État filtres ───────────────────────────────────────────
//   const [bases,       setBases]       = useState([]);
//   const [articles,    setArticles]    = useState([]);
//   const [selectedBase,    setSelectedBase]    = useState("");
//   const [selectedArticle, setSelectedArticle] = useState("");
//   const [selectedDepot,   setSelectedDepot]   = useState("");
//   const [horizon,     setHorizon]     = useState(30);

//   // ── État données ───────────────────────────────────────────
//   const [prediction,  setPrediction]  = useState(null);
//   const [chartData,   setChartData]   = useState([]);
//   const [mlStatus,    setMlStatus]    = useState("unknown"); // ok | error | unknown
//   const [trainedModels, setTrainedModels] = useState([]);

//   // ── État UI ────────────────────────────────────────────────
//   const [loading,     setLoading]     = useState(false);
//   const [training,    setTraining]    = useState(false);
//   const [error,       setError]       = useState(null);
//   const [trainMsg,    setTrainMsg]    = useState(null);

//   // ── Dépôts distincts selon l'article sélectionné ──────────
//   const depots = articles
//     .filter(a => !selectedArticle || a.AR_Ref === selectedArticle)
//     .reduce((acc, a) => {
//       if (!acc.find(d => d.DE_No === a.DE_No))
//         acc.push({ DE_No: a.DE_No, DE_Intitule: a.DE_Intitule });
//       return acc;
//     }, []);

//   // Articles distincts
//   const articlesDistincts = articles.reduce((acc, a) => {
//     if (!acc.find(x => x.AR_Ref === a.AR_Ref))
//       acc.push({ AR_Ref: a.AR_Ref, AR_Design: a.AR_Design });
//     return acc;
//   }, []);

//   // ── Vérifier santé ML au montage ──────────────────────────
//   useEffect(() => {
//     checkMLHealth()
//       .then(() => setMlStatus("ok"))
//       .catch(() => setMlStatus("error"));
//   }, []);

//   // ── Charger les bases ──────────────────────────────────────
//   useEffect(() => {
//     getBases()
//       .then(data => setBases(data.bases || []))
//       .catch(() => {});
//   }, []);

//   // ── Charger articles quand base change ────────────────────
//   useEffect(() => {
//     if (!selectedBase) { setArticles([]); return; }
//     setSelectedArticle("");
//     setSelectedDepot("");
//     setPrediction(null);
//     setChartData([]);

//     Promise.all([
//       getArticles(selectedBase),
//       getTrainedModels(selectedBase)
//     ]).then(([artData, modData]) => {
//       setArticles(artData.articles || []);
//       setTrainedModels(modData.models || []);
//     }).catch(() => {});
//   }, [selectedBase]);

//   // ── Reset dépôt quand article change ──────────────────────
//   useEffect(() => {
//     setSelectedDepot(depots.length === 1 ? String(depots[0].DE_No) : "");
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedArticle]);

//   // ── Construire les données graphique ─────────────────────
//   const buildChartData = useCallback((pred) => {
//     if (!pred) return [];
//     const hist = (pred.historique || []).map(p => ({
//       date:      p.date,
//       reel:      p.valeur,
//       type:      "historique"
//     }));
//     const forecast = (pred.prevision || []).map(p => ({
//       date:      p.date,
//       predit:    p.valeur,
//       bas:       p.bas,
//       haut:      p.haut,
//       type:      "prevision"
//     }));
//     // Ajouter le point de jonction
//     if (hist.length > 0 && forecast.length > 0) {
//       forecast[0].reel = hist[hist.length - 1].reel;
//     }
//     return [...hist, ...forecast];
//   }, []);

//   // ── Lancer la prédiction ──────────────────────────────────
//   const handlePredict = async () => {
//     if (!selectedBase || !selectedArticle || !selectedDepot) return;
//     setLoading(true);
//     setError(null);
//     setPrediction(null);
//     try {
//       const data = await getPrediction(
//         selectedBase, selectedArticle, parseInt(selectedDepot), horizon
//       );
//       setPrediction(data);
//       setChartData(buildChartData(data));
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Lancer l'entraînement ─────────────────────────────────
//   const handleTrain = async () => {
//     if (!selectedBase) return;
//     setTraining(true);
//     setTrainMsg(null);
//     try {
//       await trainBase(selectedBase);
//       setTrainMsg(`Entraînement lancé pour ${selectedBase}. Cela peut prendre quelques minutes.`);
//     } catch (e) {
//       setTrainMsg(`Erreur : ${e.message}`);
//     } finally {
//       setTraining(false);
//     }
//   };

//   // ── Vérifie si modèle existe pour cet article/dépôt ──────
//   const modelExists = trainedModels.some(
//     m => m.ar_ref === selectedArticle && String(m.de_no) === String(selectedDepot)
//   );

//   // ── Date de jonction historique/prévision ─────────────────
//   const dateJonction = prediction?.historique?.slice(-1)[0]?.date;

//   // ════════════════════════════════════════════════════════════
//   //  RENDER
//   // ════════════════════════════════════════════════════════════
//   return (
//     <div className="flex-1 overflow-y-auto bg-gray-50 min-h-screen">

//       {/* ── Header ── */}
//       <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
//         <div className="flex items-center gap-3">
//           <span className="p-2 bg-teal-50 rounded-xl text-teal-600"><Icons.Brain /></span>
//           <div>
//             <h1 className="text-lg font-bold text-gray-800">AI Prévisions</h1>
//             <p className="text-xs text-gray-400">Prédiction de stock par article et dépôt</p>
//           </div>
//         </div>
//         {/* Badge statut ML */}
//         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
//           mlStatus === "ok"
//             ? "bg-green-50 text-green-700 border-green-100"
//             : mlStatus === "error"
//             ? "bg-red-50 text-red-600 border-red-100"
//             : "bg-gray-50 text-gray-500 border-gray-100"
//         }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${
//             mlStatus === "ok" ? "bg-green-500" : mlStatus === "error" ? "bg-red-500" : "bg-gray-400"
//           }`} />
//           {mlStatus === "ok" ? "ML Service actif" : mlStatus === "error" ? "ML Service hors ligne" : "Vérification..."}
//         </div>
//       </div>

//       <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">

//         {/* ── Panneau filtres ── */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-5">
//             <span className="text-teal-500"><Icons.Chart /></span>
//             <h2 className="text-sm font-semibold text-gray-700">Paramètres de prévision</h2>
//           </div>

//           <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-4">

//             {/* Base */}
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
//                 Base SAGE
//               </label>
//               <select
//                 value={selectedBase}
//                 onChange={e => setSelectedBase(e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
//               >
//                 <option value="">— Sélectionner —</option>
//                 {bases.map(b => (
//                   <option key={b} value={b}>{b}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Article */}
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
//                 Article
//               </label>
//               <select
//                 value={selectedArticle}
//                 onChange={e => setSelectedArticle(e.target.value)}
//                 disabled={!selectedBase || articlesDistincts.length === 0}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition disabled:opacity-40"
//               >
//                 <option value="">— Tous les articles —</option>
//                 {articlesDistincts.map(a => (
//                   <option key={a.AR_Ref} value={a.AR_Ref}>
//                     {a.AR_Ref} — {a.AR_Design?.slice(0, 28)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Dépôt */}
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
//                 Dépôt
//               </label>
//               <select
//                 value={selectedDepot}
//                 onChange={e => setSelectedDepot(e.target.value)}
//                 disabled={!selectedArticle || depots.length === 0}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition disabled:opacity-40"
//               >
//                 <option value="">— Sélectionner —</option>
//                 {depots.map(d => (
//                   <option key={d.DE_No} value={d.DE_No}>
//                     {d.DE_No} — {d.DE_Intitule}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Horizon */}
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
//                 Horizon (jours)
//               </label>
//               <div className="flex gap-1">
//                 {[7, 30, 60, 90].map(h => (
//                   <button
//                     key={h}
//                     onClick={() => setHorizon(h)}
//                     className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
//                       horizon === h
//                         ? "bg-teal-500 text-white border-teal-500 shadow-sm"
//                         : "bg-white text-gray-500 border-gray-200 hover:border-teal-300"
//                     }`}
//                   >
//                     {h}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Boutons action */}
//           <div className="flex items-center gap-3 pt-2">
//             <button
//               onClick={handlePredict}
//               disabled={!selectedBase || !selectedArticle || !selectedDepot || loading}
//               className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
//             >
//               {loading ? <Icons.Spinner /> : <Icons.Chart />}
//               {loading ? "Calcul en cours..." : "Lancer la prévision"}
//             </button>

//             <button
//               onClick={handleTrain}
//               disabled={!selectedBase || training}
//               className="flex items-center gap-2 border border-gray-200 hover:border-teal-300 text-gray-600 hover:text-teal-600 px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40"
//             >
//               {training ? <Icons.Spinner /> : <Icons.Train />}
//               {training ? "Entraînement..." : `Entraîner ${selectedBase || "base"}`}
//             </button>

//             {prediction && (
//               <button
//                 onClick={() => { setPrediction(null); setChartData([]); }}
//                 className="flex items-center gap-2 text-gray-400 hover:text-gray-600 px-4 py-2.5 rounded-xl text-sm transition"
//               >
//                 <Icons.Refresh />
//                 Réinitialiser
//               </button>
//             )}

//             {/* Badge modèle */}
//             {selectedArticle && selectedDepot && (
//               <span className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
//                 modelExists
//                   ? "bg-green-50 text-green-700 border-green-100"
//                   : "bg-amber-50 text-amber-600 border-amber-100"
//               }`}>
//                 {modelExists ? <Icons.Check /> : <Icons.Info />}
//                 {modelExists ? "Modèle disponible" : "Modèle non entraîné"}
//               </span>
//             )}
//           </div>

//           {/* Message entraînement */}
//           {trainMsg && (
//             <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-700">
//               {trainMsg}
//             </div>
//           )}

//           {/* Erreur */}
//           {error && (
//             <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2">
//               <Icons.Alert />
//               <span>{error}</span>
//             </div>
//           )}
//         </div>

//         {/* ── KPIs ── */}
//         {prediction && (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

//             <KPICard
//               label="Stock prévu J+7"
//               value={prediction.stock_j7}
//               icon={Icons.Stock}
//               color={{
//                 border: "border-teal-100",
//                 bg: "bg-teal-50",
//                 icon: "text-teal-600",
//                 text: "text-teal-700",
//                 sub: "text-teal-500"
//               }}
//               sub={`Article : ${prediction.ar_ref}`}
//             />

//             <KPICard
//               label={`Stock prévu J+${horizon}`}
//               value={prediction.stock_j30}
//               icon={Icons.Chart}
//               color={{
//                 border: "border-blue-100",
//                 bg: "bg-blue-50",
//                 icon: "text-blue-600",
//                 text: "text-blue-700",
//                 sub: "text-blue-500"
//               }}
//               sub={`Dépôt : ${prediction.de_intitule || prediction.de_no}`}
//             />

//             <KPICard
//               label="Alerte rupture"
//               value={prediction.alerte_rupture ? "⚠️ Risque détecté" : "✓ Stock suffisant"}
//               unit={prediction.alerte_rupture
//                 ? `Prévue le ${prediction.date_rupture || "—"}`
//                 : `Seuil : ${prediction.seuil_alerte} unités`}
//               icon={Icons.Alert}
//               color={prediction.alerte_rupture
//                 ? { border: "border-red-100", bg: "bg-red-50", icon: "text-red-500", text: "text-red-600", sub: "text-red-400" }
//                 : { border: "border-green-100", bg: "bg-green-50", icon: "text-green-600", text: "text-green-700", sub: "text-green-500" }
//               }
//             />
//           </div>
//         )}

//         {/* ── Graphique ── */}
//         {prediction && chartData.length > 0 && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//             <div className="flex items-start justify-between mb-6">
//               <div>
//                 <h2 className="text-sm font-semibold text-gray-800">
//                   Prévision — {prediction.ar_design || prediction.ar_ref}
//                 </h2>
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   Dépôt {prediction.de_no} · {prediction.de_intitule} · Horizon {horizon} jours
//                 </p>
//               </div>

//               {/* Métriques précision */}
//               {prediction.metrics && Object.keys(prediction.metrics).length > 0 && (
//                 <div className="flex gap-3">
//                   <MetricBadge label="MAE"  value={prediction.metrics.mae} />
//                   <MetricBadge label="RMSE" value={prediction.metrics.rmse} />
//                   <MetricBadge label="MAPE" value={prediction.metrics.mape != null ? `${prediction.metrics.mape}%` : null} />
//                 </div>
//               )}
//             </div>

//             {/* Légende custom */}
//             <div className="flex items-center gap-6 mb-4 text-xs text-gray-500">
//               <span className="flex items-center gap-1.5">
//                 <span className="w-6 h-0.5 bg-teal-500 inline-block rounded" />
//                 Stock réel (historique)
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="w-6 h-0.5 border-t-2 border-dashed border-orange-400 inline-block" />
//                 Prévision Prophet
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="w-5 h-3 bg-orange-100 inline-block rounded opacity-70" />
//                 Intervalle confiance 95%
//               </span>
//             </div>

//             <ResponsiveContainer width="100%" height={350}>
//               <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
//                 <defs>
//                   <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#fb923c" stopOpacity={0.03} />
//                   </linearGradient>
//                 </defs>

//                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

//                 <XAxis
//                   dataKey="date"
//                   tick={{ fontSize: 10, fill: "#9ca3af" }}
//                   tickLine={false}
//                   axisLine={false}
//                   interval="preserveStartEnd"
//                   tickFormatter={v => {
//                     const d = new Date(v);
//                     return `${d.getDate()}/${d.getMonth() + 1}`;
//                   }}
//                 />

//                 <YAxis
//                   tick={{ fontSize: 10, fill: "#9ca3af" }}
//                   tickLine={false}
//                   axisLine={false}
//                   tickFormatter={v => v.toLocaleString("fr-FR")}
//                 />

//                 <Tooltip content={<CustomTooltip />} />

//                 {/* Ligne de séparation historique / prévision */}
//                 {dateJonction && (
//                   <ReferenceLine
//                     x={dateJonction}
//                     stroke="#d1d5db"
//                     strokeDasharray="4 4"
//                     label={{ value: "Aujourd'hui", position: "insideTopLeft", fontSize: 9, fill: "#9ca3af" }}
//                   />
//                 )}

//                 {/* Intervalle de confiance */}
//                 <Area
//                   dataKey="haut"
//                   stroke="none"
//                   fill="url(#gradConf)"
//                   name="Borne haute"
//                   legendType="none"
//                   connectNulls
//                 />
//                 <Area
//                   dataKey="bas"
//                   stroke="none"
//                   fill="#ffffff"
//                   name="Borne basse"
//                   legendType="none"
//                   connectNulls
//                 />

//                 {/* Stock réel */}
//                 <Line
//                   type="monotone"
//                   dataKey="reel"
//                   stroke="#14b8a6"
//                   strokeWidth={2}
//                   dot={false}
//                   name="Stock réel"
//                   connectNulls
//                 />

//                 {/* Prévision */}
//                 <Line
//                   type="monotone"
//                   dataKey="predit"
//                   stroke="#fb923c"
//                   strokeWidth={2}
//                   strokeDasharray="6 3"
//                   dot={false}
//                   name="Prévision"
//                   connectNulls
//                 />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* ── Tableau modèles entraînés ── */}
//         {selectedBase && trainedModels.length > 0 && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <span className="text-teal-500"><Icons.Brain /></span>
//               <h2 className="text-sm font-semibold text-gray-700">
//                 Modèles entraînés — {selectedBase}
//               </h2>
//               <span className="ml-auto bg-teal-50 text-teal-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-100">
//                 {trainedModels.length} modèles
//               </span>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-xs">
//                 <thead>
//                   <tr className="border-b border-gray-100">
//                     {["Article", "Désignation", "Dépôt", "Données entraînement", "MAE", "MAPE", "Action"].map(h => (
//                       <th key={h} className="text-left py-2 px-3 text-gray-400 font-medium uppercase tracking-wider text-[10px]">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {trainedModels.map((m, i) => (
//                     <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
//                       <td className="py-2.5 px-3 font-mono font-semibold text-gray-800">{m.ar_ref}</td>
//                       <td className="py-2.5 px-3 text-gray-500 max-w-[200px] truncate">{m.ar_design}</td>
//                       <td className="py-2.5 px-3 text-gray-600">{m.de_no} — {m.de_intitule}</td>
//                       <td className="py-2.5 px-3 text-gray-500">{m.n_train} jours</td>
//                       <td className="py-2.5 px-3">
//                         <span className="font-semibold text-teal-700">{m.metrics?.mae ?? "—"}</span>
//                       </td>
//                       <td className="py-2.5 px-3">
//                         <span className={`font-semibold ${
//                           m.metrics?.mape < 5 ? "text-green-600"
//                           : m.metrics?.mape < 15 ? "text-amber-500"
//                           : "text-red-500"
//                         }`}>
//                           {m.metrics?.mape != null ? `${m.metrics.mape}%` : "—"}
//                         </span>
//                       </td>
//                       <td className="py-2.5 px-3">
//                         <button
//                           onClick={() => {
//                             setSelectedArticle(m.ar_ref);
//                             setSelectedDepot(String(m.de_no));
//                           }}
//                           className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
//                         >
//                           Voir prévision →
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* ── État vide ── */}
//         {!prediction && !loading && (
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="p-4 bg-teal-50 rounded-2xl text-teal-400 mb-4">
//               <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8z"/>
//                 <path d="M32 20v12l8 8"/>
//               </svg>
//             </div>
//             <p className="text-gray-600 font-medium">Sélectionnez une base, un article et un dépôt</p>
//             <p className="text-gray-400 text-sm mt-1">puis cliquez sur "Lancer la prévision"</p>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// frontend/src/pages/AIPrevisions.js
// Design 100% compatible avec Filters.js
// Même Select (portal + chevron + check), même couleurs, même style de cartes

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  ChevronDown, Check, Loader2, Search, X,
  TrendingUp, TrendingDown, Brain, Layers,
  PackageSearch, RefreshCw, Zap, Activity,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import {
  getBases, getArticles, getTrainedModels,
  getPrediction, trainBase, checkMLHealth,
} from "../api/predictionsApi";

// ══════════════════════════════════════════════════════════════
//  SELECT — copie exacte du style de Filters.js
//  (portal, chevron, check, hover bleu)
// ══════════════════════════════════════════════════════════════
function Select({ label, icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
  const [open, setOpen]           = useState(false);
  const [dropStyle, setDropStyle] = useState({ top: 0, left: 0, width: 0 });
  const btnRef  = useRef(null);
  const dropRef = useRef(null);

  const updatePos = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setDropStyle({
      top:   r.bottom + window.scrollY + 4,
      left:  r.left   + window.scrollX,
      width: Math.max(r.width, 260),
    });
  };

  useEffect(() => {
    const close = (e) => {
      if (btnRef.current?.contains(e.target))  return;
      if (dropRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    if (open) {
      updatePos();
      document.addEventListener("mousedown", close);
      window.addEventListener("scroll", updatePos);
      window.addEventListener("resize", updatePos);
    }
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  const selected  = options.find(o => String(o.value) === String(value));
  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
          {Icon && <Icon size={11} />}
          {label}
        </label>
      )}
      <div className="relative w-full">
        <button
          ref={btnRef}
          type="button"
          onClick={() => { if (!isDisabled) { updatePos(); setOpen(p => !p); } }}
          className={`
            w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg
            text-left text-sm transition-[border-color,box-shadow] duration-150 outline-none border
            ${open
              ? "border-[#12a6e0] shadow-[0_0_0_3px_rgba(18,166,224,0.12)] bg-white"
              : isDisabled
              ? "border-[#e0e0e0] bg-[#f5f5f5]"
              : "border-[#c5c5c5] bg-white hover:border-[#12a6e0]"
            }
            ${isDisabled ? "cursor-not-allowed text-[#aaaaaa]" : "cursor-pointer"}
            ${selected && !isDisabled ? "text-[#0d0c0c]" : "text-[#aaaaaa]"}
          `}
        >
          <span className="flex-1 truncate">{selected ? selected.label : placeholder}</span>
          {loading
            ? <Loader2 size={13} className="text-[#12a6e0] flex-shrink-0 animate-spin" />
            : <ChevronDown size={13} className={`text-[#c5c5c5] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          }
        </button>

        {open && !isDisabled && createPortal(
          <div
            ref={dropRef}
            style={{ position: "absolute", top: dropStyle.top, left: dropStyle.left, width: dropStyle.width, maxWidth: 480, zIndex: 99999 }}
            className="bg-white border border-[#cce8f6] rounded-[0.65rem] shadow-[0_8px_28px_rgba(18,166,224,0.2),0_4px_12px_rgba(0,0,0,0.15)] max-h-[260px] overflow-y-auto"
          >
            {/* Option vide */}
            <div
              onClick={() => { onChange(""); setOpen(false); }}
              className={`px-4 py-2 text-[13px] cursor-pointer flex items-center justify-between gap-4 border-b border-[#eef6fb]
                ${!value ? "bg-[rgba(18,166,224,0.05)]" : "hover:bg-[#f2faff]"}`}
            >
              <span className="italic text-[#999999]">{placeholder}</span>
              {!value && <Check size={13} className="text-[#12a6e0] flex-shrink-0" />}
            </div>
            {options.map(o => (
              <div
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`px-4 py-2 text-[13px] cursor-pointer flex items-center justify-between gap-4 border-b border-[#f5f9fc] transition-colors
                  ${String(value) === String(o.value)
                    ? "bg-[rgba(18,166,224,0.07)] text-[#0d8fc4] font-semibold"
                    : "text-[#1a1a1a] hover:bg-[#f2faff]"
                  }`}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {String(value) === String(o.value) && <Check size={13} className="text-[#12a6e0] flex-shrink-0" />}
              </div>
            ))}
            {options.length === 0 && (
              <div className="py-5 text-[13px] text-[#c5c5c5] text-center">
                Aucune option disponible
              </div>
            )}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  TOOLTIP GRAPHIQUE
// ══════════════════════════════════════════════════════════════
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e4e4e4] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-3 text-xs min-w-[150px]">
      <p className="font-semibold text-[#555555] mb-2 pb-1 border-b border-[#f0f0f0]">{label}</p>
      {payload.map((p, i) =>
        p.value != null && (
          <div key={i} className="flex items-center justify-between gap-3 mb-1">
            <span className="flex items-center gap-1.5 text-[#aaaaaa]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="font-bold text-[#0d0c0c]">
              {Number(p.value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}
            </span>
          </div>
        )
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  CARTE KPI — même style que le dashboard principal
// ══════════════════════════════════════════════════════════════
function KpiCard({ label, value, unit, sub, icon: Icon, iconBg, iconColor, valueColor }) {
  return (
    <div
      className="bg-white rounded-2xl px-5 py-5 flex flex-col"
      style={{
        border: `1.5px solid ${iconBg.replace("0.10", "0.20")}`,
        boxShadow: `0 2px 12px ${iconBg.replace("0.10", "0.06")}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[#aaaaaa] text-[11px] font-medium m-0 mb-1 uppercase tracking-wide">{label}</p>
          <p className="m-0 font-bold leading-tight text-[1.45rem] tabular-nums" style={{ color: valueColor }}>
            {typeof value === "number"
              ? value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
              : value}
          </p>
          <p className="text-[#c5c5c5] text-[11px] mt-0.5 m-0">{unit}</p>
        </div>
      </div>
      {sub && (
        <div className="border-t border-[#f5f5f5] pt-2.5 mt-1">
          <p className="m-0 text-[#aaaaaa] text-[11px]">{sub}</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  BADGE MÉTRIQUE
// ══════════════════════════════════════════════════════════════
function MetricBadge({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-[#f8f8f8] rounded-xl px-4 py-2.5 border border-[#eeeeee]">
      <span className="text-[15px] font-bold text-[#0d0c0c] tabular-nums">{value ?? "—"}</span>
      <span className="text-[10px] text-[#aaaaaa] mt-0.5 uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function AIPrevisions() {

  // ── Contexte dashboard → base synchronisée avec Filters.js ──
  const { currentFilters } = useDashboard();
  const baseFromDashboard  = currentFilters?.base || "";

  // ── État filtres ─────────────────────────────────────────────
  const [bases,           setBases]           = useState([]);
  const [articles,        setArticles]        = useState([]);
  const [trainedModels,   setTrainedModels]   = useState([]);
  const [selectedBase,    setSelectedBase]    = useState(baseFromDashboard);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [selectedDepot,   setSelectedDepot]   = useState("");
  const [horizon,         setHorizon]         = useState(30);

  // ── État données ─────────────────────────────────────────────
  const [prediction,  setPrediction]  = useState(null);
  const [chartData,   setChartData]   = useState([]);
  const [mlStatus,    setMlStatus]    = useState("unknown");

  // ── État UI ──────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false);
  const [training, setTraining] = useState(false);
  const [error,    setError]    = useState(null);
  const [trainMsg, setTrainMsg] = useState(null);

  // ── OPTIONS pour les selects ─────────────────────────────────
  const basesOptions = [
    ...bases.map(b => ({ value: b, label: b })),
    ...(baseFromDashboard && !bases.includes(baseFromDashboard)
      ? [{ value: baseFromDashboard, label: baseFromDashboard }]
      : []),
  ];

  const articlesDistincts = articles.reduce((acc, a) => {
    if (!acc.find(x => x.AR_Ref === a.AR_Ref))
      acc.push({ AR_Ref: a.AR_Ref, AR_Design: a.AR_Design });
    return acc;
  }, []);

  const articlesOptions = articlesDistincts.map(a => ({
    value: a.AR_Ref,
    label: `${a.AR_Ref} — ${a.AR_Design?.slice(0, 32) || ""}`,
  }));

  const depots = articles
    .filter(a => !selectedArticle || a.AR_Ref === selectedArticle)
    .reduce((acc, a) => {
      if (!acc.find(d => d.DE_No === a.DE_No))
        acc.push({ DE_No: a.DE_No, DE_Intitule: a.DE_Intitule });
      return acc;
    }, []);

  const depotsOptions = depots.map(d => ({
    value: String(d.DE_No),
    label: `${d.DE_No} — ${d.DE_Intitule || ""}`,
  }));

  // ══════════════════════════════════════════════════════════════
  //  SYNCHRONISATION BASE → depuis Filters.js via DashboardContext
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!baseFromDashboard || baseFromDashboard === selectedBase) return;
    setSelectedBase(baseFromDashboard);
    setSelectedArticle("");
    setSelectedDepot("");
    setPrediction(null);
    setChartData([]);
    setError(null);
    setTrainMsg(null);
  }, [baseFromDashboard]); // eslint-disable-line

  // ── Santé ML + bases au montage ──────────────────────────────
  useEffect(() => {
    checkMLHealth().then(() => setMlStatus("ok")).catch(() => setMlStatus("error"));
    getBases().then(d => setBases(d.bases || [])).catch(() => {});
  }, []);

  // ── Articles + modèles quand base change ─────────────────────
  useEffect(() => {
    if (!selectedBase) { setArticles([]); setTrainedModels([]); return; }
    setSelectedArticle("");
    setSelectedDepot("");
    setPrediction(null);
    setChartData([]);
    Promise.all([getArticles(selectedBase), getTrainedModels(selectedBase)])
      .then(([a, m]) => { setArticles(a.articles || []); setTrainedModels(m.models || []); })
      .catch(() => { setArticles([]); setTrainedModels([]); });
  }, [selectedBase]);

  // ── Auto-sélect dépôt unique ─────────────────────────────────
  useEffect(() => {
    const dep = articles.filter(a => a.AR_Ref === selectedArticle).map(a => a.DE_No);
    setSelectedDepot(dep.length === 1 ? String(dep[0]) : "");
  }, [selectedArticle]); // eslint-disable-line

  // ── Construire données graphique ─────────────────────────────
  const buildChart = useCallback((pred) => {
    if (!pred) return [];
    const hist = (pred.historique || []).map(p => ({ date: p.date, reel: p.valeur }));
    const fore = (pred.prevision  || []).map(p => ({
      date: p.date, predit: p.valeur, bas: p.bas, haut: p.haut,
    }));
    if (hist.length && fore.length) fore[0].reel = hist[hist.length - 1].reel;
    return [...hist, ...fore];
  }, []);

  // ── Prévision ────────────────────────────────────────────────
  const handlePredict = async () => {
    if (!selectedBase || !selectedArticle || !selectedDepot) return;
    setLoading(true); setError(null); setPrediction(null);
    try {
      const d = await getPrediction(selectedBase, selectedArticle, parseInt(selectedDepot), horizon);
      setPrediction(d);
      setChartData(buildChart(d));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // ── Entraînement ─────────────────────────────────────────────
  const handleTrain = async () => {
    if (!selectedBase) return;
    setTraining(true); setTrainMsg(null); setError(null);
    try {
      await trainBase(selectedBase);
      setTrainMsg(`Entraînement lancé pour ${selectedBase}. Cela peut prendre 2-5 minutes.`);
    } catch (e) { setTrainMsg(`Erreur : ${e.message}`); }
    finally { setTraining(false); }
  };

  const modelExists   = trainedModels.some(m => m.ar_ref === selectedArticle && String(m.de_no) === String(selectedDepot));
  const noModels      = selectedBase && trainedModels.length === 0;
  const dateJonction  = prediction?.historique?.slice(-1)[0]?.date;
  const canPredict    = selectedBase && selectedArticle && selectedDepot && !loading && mlStatus === "ok";

  // ══════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-5">

      {/* ── PANNEAU FILTRES — même style que Filters.js ── */}
      <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07),0_1px_3px_rgba(0,0,0,0.05)] overflow-visible">

        {/* Header */}
        <div className="flex flex-col gap-3 px-5 py-4 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb] rounded-[1.1rem] rounded-b-none sm:flex-row sm:items-center sm:flex-wrap">
          <div className="flex items-center gap-[0.55rem] flex-shrink-0">
            <div className="w-7 h-7 rounded-[0.55rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-md shadow-[rgba(18,166,224,0.30)]">
              <Brain size={13} className="text-white" />
            </div>
            <span className="text-[#0d0c0c] text-[13px] font-semibold tracking-wide">
              AI Prévisions de stock
            </span>
          </div>

          {/* Séparateur */}
          <div className="hidden sm:block w-px h-[22px] flex-shrink-0 bg-gradient-to-b from-transparent via-[#c8e8f8] to-transparent" />

          {/* Badge base synchronisée + statut ML */}
          <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
            {baseFromDashboard && (
              <div className="flex items-center gap-[0.4rem] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.20)] rounded-full py-[0.28rem] px-[0.7rem]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#12a6e0] animate-pulse" />
                <span className="text-[#0b7db0] text-[11px] font-semibold">
                  {baseFromDashboard} — synchronisé
                </span>
              </div>
            )}
            <div className={`flex items-center gap-[0.4rem] rounded-full py-[0.28rem] px-[0.7rem] border text-[11px] font-semibold ${
              mlStatus === "ok"
                ? "bg-[rgba(1,214,58,0.07)] border-[rgba(1,214,58,0.22)] text-[#01a82e]"
                : mlStatus === "error"
                ? "bg-[rgba(229,57,53,0.07)] border-[rgba(229,57,53,0.22)] text-[#e53935]"
                : "bg-[#f5f5f5] border-[#e0e0e0] text-[#aaaaaa]"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                mlStatus === "ok" ? "bg-[#01d63a]" : mlStatus === "error" ? "bg-[#e53935]" : "bg-[#c5c5c5]"
              }`} />
              {mlStatus === "ok" ? "ML actif" : mlStatus === "error" ? "ML hors ligne" : "Vérification..."}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">

          {/* Info sync */}
          {baseFromDashboard && (
            <div className="mb-4 flex items-center gap-2 text-[11px] text-[#0b7db0] bg-[rgba(18,166,224,0.04)] border border-[rgba(18,166,224,0.12)] rounded-lg px-3 py-2">
              <Activity size={11} className="shrink-0" />
              Base <strong className="mx-0.5">{baseFromDashboard}</strong> liée au tableau de bord.
              Changez-la dans les filtres du dashboard — cette page suit automatiquement.
            </div>
          )}

          {/* Alerte ML hors ligne */}
          {mlStatus === "error" && (
            <div className="mb-4 flex items-center gap-2 text-[11px] text-[#e53935] bg-[rgba(229,57,53,0.05)] border border-[rgba(229,57,53,0.15)] rounded-lg px-3 py-2">
              <Zap size={11} className="shrink-0" />
              Service ML Python inaccessible. Lancez :
              <code className="ml-1 bg-[rgba(229,57,53,0.08)] px-1.5 py-0.5 rounded font-mono">python ml/api/main.py</code>
            </div>
          )}

          {/* Alerte aucun modèle */}
          {noModels && !training && (
            <div className="mb-4 flex items-center gap-2 text-[11px] text-[#e08a00] bg-[rgba(224,138,0,0.06)] border border-[rgba(224,138,0,0.18)] rounded-lg px-3 py-2">
              <PackageSearch size={11} className="shrink-0" />
              Aucun modèle entraîné pour <strong className="mx-0.5">{selectedBase}</strong>.
              Cliquez sur <strong className="mx-0.5">"Entraîner {selectedBase}"</strong> ci-dessous.
            </div>
          )}

          {/* 4 Selects — identiques à Filters.js */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">

            <Select
              label="Base SAGE"
              icon={Layers}
              value={selectedBase}
              onChange={setSelectedBase}
              options={basesOptions}
              placeholder="Sélectionner une base"
            />

            <Select
              label="Article"
              icon={PackageSearch}
              value={selectedArticle}
              onChange={setSelectedArticle}
              options={articlesOptions}
              placeholder="Sélectionner un article"
              disabled={!selectedBase || articlesOptions.length === 0}
            />

            <Select
              label="Dépôt"
              icon={Activity}
              value={selectedDepot}
              onChange={setSelectedDepot}
              options={depotsOptions}
              placeholder="Sélectionner un dépôt"
              disabled={!selectedArticle || depotsOptions.length === 0}
            />

            {/* Horizon — boutons comme dans le dashboard */}
            <div className="flex flex-col gap-[6px]">
              <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                <Search size={11} />
                Horizon (jours)
              </label>
              <div className="flex gap-1">
                {[7, 30, 60, 90].map(h => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`flex-1 py-[0.58rem] rounded-lg text-[13px] font-semibold transition-all duration-150 border cursor-pointer ${
                      horizon === h
                        ? "bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white border-[#12a6e0] shadow-md shadow-[rgba(18,166,224,0.30)]"
                        : "bg-white text-[#666666] border-[#c5c5c5] hover:border-[#12a6e0] hover:text-[#12a6e0]"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer boutons — même style que Filters.js */}
          <div className="flex flex-col gap-[0.65rem] mt-[1.1rem] pt-4 border-t border-[#f0f0f0] sm:flex-row sm:items-center sm:flex-wrap">

            {/* Bouton principal Lancer */}
            <button
              onClick={handlePredict}
              disabled={!canPredict}
              className={`flex items-center justify-center gap-[0.45rem] px-[1.35rem] py-[0.58rem] rounded-[0.55rem] text-sm font-semibold transition-all duration-200 ${
                !canPredict
                  ? "bg-[#e8f6fd] text-[#92cfe8] cursor-not-allowed"
                  : "bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white shadow-md shadow-[rgba(18,166,224,0.35)] hover:shadow-lg cursor-pointer"
              }`}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
              {loading ? "Calcul en cours…" : "Lancer la prévision"}
            </button>

            {/* Bouton Entraîner */}
            <button
              onClick={handleTrain}
              disabled={!selectedBase || training || mlStatus === "error"}
              className="flex items-center justify-center gap-[0.45rem] px-[1.1rem] py-[0.58rem] rounded-[0.55rem] text-sm font-medium bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all duration-200 hover:bg-[#ebebeb] hover:text-[#0d0c0c] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {training ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
              {training ? "Entraînement…" : `Entraîner ${selectedBase || "base"}`}
            </button>

            {/* Réinitialiser */}
            {prediction && (
              <button
                onClick={() => { setPrediction(null); setChartData([]); setError(null); }}
                className="flex items-center justify-center gap-[0.45rem] px-[1.1rem] py-[0.58rem] rounded-[0.55rem] text-sm font-medium bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all duration-200 hover:bg-[#ebebeb] hover:text-[#0d0c0c]"
              >
                <RefreshCw size={14} />
                Réinitialiser
              </button>
            )}

            {/* Badge modèle */}
            {selectedArticle && selectedDepot && (
              <div className={`sm:ml-auto flex items-center gap-[0.4rem] rounded-full py-[0.28rem] px-[0.7rem] border text-[11px] font-semibold ${
                modelExists
                  ? "bg-[rgba(1,214,58,0.07)] border-[rgba(1,214,58,0.22)] text-[#01a82e]"
                  : "bg-[rgba(224,138,0,0.07)] border-[rgba(224,138,0,0.22)] text-[#e08a00]"
              }`}>
                {modelExists
                  ? <><Check size={11} /> Modèle entraîné</>
                  : <><TrendingDown size={11} /> Modèle absent → Entraîner d'abord</>
                }
              </div>
            )}
          </div>

          {/* Messages feedback */}
          {trainMsg && (
            <div className={`mt-3 px-3 py-2.5 rounded-lg text-[11px] border flex items-start gap-2 ${
              trainMsg.startsWith("Erreur")
                ? "bg-[rgba(229,57,53,0.05)] border-[rgba(229,57,53,0.15)] text-[#e53935]"
                : "bg-[rgba(18,166,224,0.05)] border-[rgba(18,166,224,0.15)] text-[#0b7db0]"
            }`}>
              <Activity size={11} className="mt-0.5 shrink-0" />
              {trainMsg}
            </div>
          )}
          {error && (
            <div className="mt-3 px-3 py-2.5 rounded-lg text-[11px] bg-[rgba(229,57,53,0.05)] border border-[rgba(229,57,53,0.15)] text-[#e53935] flex items-start gap-2">
              <X size={11} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          3 KPI CARDS — même style que App.js
      ══════════════════════════════════════════════════════ */}
      {prediction && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            label="Stock prévu J+7"
            value={prediction.stock_j7}
            unit="unités prévues"
            sub={<>Article <span className="font-mono text-[#12a6e0]">{prediction.ar_ref}</span> · Dépôt {prediction.de_no}</>}
            icon={TrendingUp}
            iconBg="rgba(18,166,224,0.10)"
            iconColor="#12a6e0"
            valueColor="#12a6e0"
          />
          <KpiCard
            label={`Stock prévu J+${horizon}`}
            value={prediction.stock_j30}
            unit="unités prévues"
            sub={<>Base <span className="font-semibold text-[#0b7db0]">{prediction.base_name}</span> · {prediction.de_intitule || `Dépôt ${prediction.de_no}`}</>}
            icon={Activity}
            iconBg="rgba(124,77,255,0.10)"
            iconColor="#7c4dff"
            valueColor="#7c4dff"
          />
          <KpiCard
            label="Alerte rupture"
            value={prediction.alerte_rupture ? "⚠ Risque détecté" : "✓ Stock suffisant"}
            unit={prediction.alerte_rupture
              ? `Rupture prévue le ${prediction.date_rupture || "—"}`
              : `Seuil : ${prediction.seuil_alerte} unités`}
            sub={null}
            icon={prediction.alerte_rupture ? TrendingDown : TrendingUp}
            iconBg={prediction.alerte_rupture ? "rgba(229,57,53,0.10)" : "rgba(1,168,46,0.10)"}
            iconColor={prediction.alerte_rupture ? "#e53935" : "#01a82e"}
            valueColor={prediction.alerte_rupture ? "#e53935" : "#01a82e"}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          GRAPHIQUE
      ══════════════════════════════════════════════════════ */}
      {prediction && chartData.length > 0 && (
        <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07)] p-6">

          {/* Header graphique */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <p className="text-[#0d0c0c] text-[13px] font-semibold m-0">
                {prediction.ar_design || prediction.ar_ref}
              </p>
              <p className="text-[#aaaaaa] text-[11px] mt-0.5 m-0">
                Base&nbsp;
                <span className="text-[#12a6e0] font-semibold">{prediction.base_name}</span>
                &nbsp;·&nbsp;Dépôt {prediction.de_no}
                {prediction.de_intitule ? ` — ${prediction.de_intitule}` : ""}
                &nbsp;·&nbsp;Horizon {horizon} jours
              </p>
            </div>
            {prediction.metrics && Object.keys(prediction.metrics).length > 0 && (
              <div className="flex gap-2">
                <MetricBadge label="MAE"  value={prediction.metrics.mae} />
                <MetricBadge label="RMSE" value={prediction.metrics.rmse} />
                <MetricBadge label="MAPE" value={prediction.metrics.mape != null ? `${prediction.metrics.mape}%` : null} />
              </div>
            )}
          </div>

          {/* Légende */}
          <div className="flex items-center gap-5 mb-4 text-[11px] text-[#aaaaaa] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-[2px] bg-[#12a6e0] inline-block rounded" />
              Stock réel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0 border-t-2 border-dashed border-[#f97316] inline-block" />
              Prévision Prophet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-3 bg-orange-100 inline-block rounded opacity-70" />
              Intervalle 95%
            </span>
            {prediction.alerte_rupture && (
              <span className="flex items-center gap-1 text-[#e53935] font-semibold">
                <TrendingDown size={11} />
                Rupture prévue le {prediction.date_rupture}
              </span>
            )}
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date" tick={{ fontSize: 10, fill: "#aaaaaa" }}
                tickLine={false} axisLine={false} interval="preserveStartEnd"
                tickFormatter={v => {
                  const d = new Date(v);
                  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#aaaaaa" }} tickLine={false} axisLine={false}
                tickFormatter={v => v.toLocaleString("fr-FR")}
              />
              <Tooltip content={<ChartTooltip />} />
              {dateJonction && (
                <ReferenceLine x={dateJonction} stroke="#d0d0d0" strokeDasharray="4 4"
                  label={{ value: "Aujourd'hui", position: "insideTopLeft", fontSize: 9, fill: "#bbbbbb" }} />
              )}
              {prediction.alerte_rupture && (
                <ReferenceLine y={prediction.seuil_alerte} stroke="#e53935"
                  strokeDasharray="4 2" strokeOpacity={0.5}
                  label={{ value: "Seuil alerte", position: "right", fontSize: 9, fill: "#e53935" }} />
              )}
              <Area dataKey="haut" stroke="none" fill="url(#gradConf)" name="Borne haute" legendType="none" connectNulls />
              <Area dataKey="bas"  stroke="none" fill="#ffffff"         name="Borne basse" legendType="none" connectNulls />
              <Line type="monotone" dataKey="reel"   stroke="#12a6e0" strokeWidth={2} dot={false} name="Stock réel"  connectNulls />
              <Line type="monotone" dataKey="predit" stroke="#f97316" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Prévision" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TABLEAU MODÈLES ENTRAÎNÉS
      ══════════════════════════════════════════════════════ */}
      {selectedBase && trainedModels.length > 0 && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

          {/* Header tableau */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#12a6e0]" />
              <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
                Modèles entraînés
              </span>
              <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
                {trainedModels.length} modèles — {selectedBase}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  {["Article", "Désignation", "Dépôt", "Données", "MAE", "MAPE", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 bg-[#f8f8f8] text-left text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[#888888] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainedModels.map((m, i) => (
                  <tr key={i} className="border-b border-[#f8f8f8] hover:bg-[rgba(18,166,224,0.03)] transition-colors duration-100">
                    <td className="px-4 py-3">
                      <span className="inline-block font-mono text-[0.72rem] text-[#0b7db0] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.15)] rounded-md px-2 py-0.5">
                        {m.ar_ref}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#555555] max-w-[200px] truncate">{m.ar_design}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block font-mono text-[0.72rem] text-[#666666] bg-[#f4f4f4] border border-[#e8e8e8] rounded-md px-2 py-0.5">
                        {m.de_no}
                      </span>
                      {m.de_intitule && <span className="text-[#aaaaaa] ml-1">{m.de_intitule}</span>}
                    </td>
                    <td className="px-4 py-3 text-[#aaaaaa]">{m.n_train ?? "—"} jours</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[0.8rem] text-[#0b7db0]">{m.metrics?.mae ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-semibold text-[0.75rem] px-2 py-0.5 rounded-md border ${
                        !m.metrics?.mape
                          ? "text-[#aaaaaa] bg-[#f8f8f8] border-[#eeeeee]"
                          : m.metrics.mape < 5
                          ? "text-[#01773d] bg-[rgba(1,168,46,0.07)] border-[rgba(1,168,46,0.18)]"
                          : m.metrics.mape < 15
                          ? "text-[#e08a00] bg-[rgba(224,138,0,0.07)] border-[rgba(224,138,0,0.18)]"
                          : "text-[#b71c1c] bg-[rgba(229,57,53,0.07)] border-[rgba(229,57,53,0.18)]"
                      }`}>
                        {m.metrics?.mape != null ? `${m.metrics.mape}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelectedArticle(m.ar_ref); setSelectedDepot(String(m.de_no)); }}
                        className="text-[#12a6e0] hover:text-[#0d8fc4] font-semibold hover:underline cursor-pointer text-[11px] transition-colors"
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
        <div className="bg-white border border-[#e8e8e8] rounded-2xl p-16 text-center shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(18,166,224,0.07)] flex items-center justify-center mx-auto mb-4">
            <Brain size={22} className="text-[#12a6e0]" />
          </div>
          <p className="text-[#0d0c0c] text-sm font-semibold m-0">
            {!selectedBase
              ? "Sélectionnez une base pour commencer"
              : !selectedArticle
              ? "Sélectionnez un article"
              : "Sélectionnez un dépôt puis lancez la prévision"}
          </p>
          <p className="text-[#c5c5c5] text-xs mt-1 m-0">
            Prédiction sur les {horizon} prochains jours · Prophet ML
          </p>
        </div>
      )}

    </div>
  );
}