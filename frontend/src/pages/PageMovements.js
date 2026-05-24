// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   ArrowDownUp,
//   ArrowUp,
//   ArrowDown,
//   ArrowUpDown,
//   Warehouse,
//   PackageX,
//   Download,
//   Search,
//   SlidersHorizontal,
//   CalendarDays,
//   Database,
//   Tag,
//   Layers,
//   X,
//   ChevronDown,
//   Loader2,
//   Check,
//   TrendingUp,
//   TrendingDown,
//   Minus,
// } from 'lucide-react';
// import { useDashboard } from '../context/DashboardContext';
// import { fetchMouvements, fetchFiltres } from '../api/stockApi';

// // ── Helpers ────────────────────────────────────────────────────
// const fmtDate = (d) => {
//   if (!d) return '—';
//   return new Date(d).toLocaleDateString('fr-FR', {
//     day: '2-digit', month: '2-digit', year: 'numeric',
//   });
// };

// const fmtDateShort = (d) => {
//   if (!d) return '—';
//   const [y, m, dd] = d.split('-');
//   return `${dd}/${m}/${y}`;
// };

// const fmtNum = (n) => {
//   if (n === null || n === undefined || n === '') return '—';
//   const num = Number(n);
//   if (isNaN(num)) return '—';
//   return new Intl.NumberFormat('fr-FR', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// // ── Détection des colonnes — noms exacts retournés par SP_GetMouvements ──
// function detectColumns(data) {
//   if (!data || data.length === 0) return {};
//   const keys = Object.keys(data[0]);
//   console.log('📋 Colonnes mouvements reçues:', keys);

//   const find = (...variants) =>
//     keys.find(k =>
//       variants.some(v =>
//         k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, '')
//       )
//     ) || null;

//   return {
//     date:        find('Date', 'DateJour'),
//     article:     find('Article', 'AR_Ref'),
//     design:      find('Designation', 'AR_Design', 'Désignation'),
//     depot:       find('Depot', 'DE_No'),
//     nomDepot:    find('Nom Depot', 'NomDepot', 'DE_Intitule'),
//     entrees:     find('Total Entrees', 'TotalEntree', 'TotalEntrees'),
//     pruEntree:   find('PRU Entree', 'PRU_Entree_Jour', 'PRUEntree'),
//     sorties:     find('Total Sorties', 'TotalSortie', 'TotalSorties'),
//     pruSortie:   find('PRU Sortie', 'PRU_Sortie_Jour', 'PRUSortie'),
//     valeurMvt:   find('Total Valeur Mouvement', 'TotalValeurMouvement'),
//     // Ces 2 colonnes arrivent seulement après modification de SP_GetMouvements
//     solde:       find('Valeur Finale Permanente', 'ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale'),
//     stockFinal:  find('Stock Final', 'StockFinal'),
//   };
// }

// // ── Badge filtre actif ─────────────────────────────────────────
// function FilterBadge({ label, value, onRemove, color = '#12a6e0', bg = 'rgba(18,166,224,0.07)' }) {
//   if (!value) return null;
//   return (
//     <span
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
//       style={{ color, background: bg, borderColor: `${color}33` }}
//     >
//       {label}: {value}
//       {onRemove && (
//         <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity">
//           <X size={10} />
//         </button>
//       )}
//     </span>
//   );
// }

// // ── Select inline compact ──────────────────────────────────────
// function SelectCompact({ icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
//   const [open, setOpen] = useState(false);
//   const ref = React.useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     if (open) document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [open]);

//   const selected = options.find(o => String(o.value) === String(value));

//   return (
//     <div ref={ref} className="relative">
//       <button
//         type="button"
//         onClick={() => { if (!disabled && !loading) setOpen(p => !p); }}
//         className={`
//           flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] transition-all duration-150 min-w-[160px]
//           ${open ? 'border-[#12a6e0] shadow-[0_0_0_3px_rgba(18,166,224,0.12)] bg-white' : ''}
//           ${disabled ? 'border-[#e8e8e8] bg-[#f8f8f8] text-[#c5c5c5] cursor-not-allowed' : 'border-[#e0e0e0] bg-white hover:border-[#12a6e0] cursor-pointer'}
//           ${selected && !disabled ? 'text-[#0d0c0c]' : 'text-[#aaaaaa]'}
//         `}
//       >
//         {Icon && <Icon size={13} className={selected && !disabled ? 'text-[#12a6e0]' : 'text-[#c5c5c5]'} />}
//         <span className="flex-1 truncate max-w-[140px]">{selected ? selected.label : placeholder}</span>
//         {loading
//           ? <Loader2 size={12} className="text-[#12a6e0] animate-spin shrink-0" />
//           : <ChevronDown size={12} className={`shrink-0 transition-transform duration-200 text-[#c5c5c5] ${open ? 'rotate-180' : ''}`} />
//         }
//       </button>

//       {open && !disabled && (
//         <div className="absolute top-[calc(100%+4px)] left-0 z-[9999] bg-white border border-[#cce8f6] rounded-xl shadow-[0_8px_28px_rgba(18,166,224,0.2),0_4px_12px_rgba(0,0,0,0.12)] min-w-[220px] max-h-[240px] overflow-y-auto">
//           <div
//             onClick={() => { onChange(''); setOpen(false); }}
//             className={`px-3 py-2 text-[12px] cursor-pointer flex items-center justify-between border-b border-[#f0f0f0] ${!value ? 'bg-[rgba(18,166,224,0.05)]' : 'hover:bg-[#f5faff]'}`}
//           >
//             <span className="italic text-[#aaaaaa]">{placeholder}</span>
//             {!value && <Check size={11} className="text-[#12a6e0]" />}
//           </div>
//           {options.map(o => (
//             <div
//               key={o.value}
//               onClick={() => { onChange(o.value); setOpen(false); }}
//               className={`px-3 py-2 text-[12px] cursor-pointer flex items-center justify-between border-b border-[#f8f8f8] transition-colors
//                 ${String(value) === String(o.value) ? 'bg-[rgba(18,166,224,0.07)] text-[#0b7db0] font-semibold' : 'text-[#1a1a1a] hover:bg-[#f5faff]'}`}
//             >
//               <span className="flex-1 truncate">{o.label}</span>
//               {String(value) === String(o.value) && <Check size={11} className="text-[#12a6e0] shrink-0" />}
//             </div>
//           ))}
//           {options.length === 0 && (
//             <div className="py-4 text-[12px] text-[#c5c5c5] text-center">Aucune option</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── En-tête de colonne triable ─────────────────────────────────
// function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
//   const active = sortKey === colKey;
//   const isRight = align === 'right';
//   const SortIcon = () => {
//     if (!colKey) return null;
//     if (active) return sortDir === 'asc'
//       ? <ArrowUp size={12} className="text-[#12a6e0] shrink-0" />
//       : <ArrowDown size={12} className="text-[#12a6e0] shrink-0" />;
//     return <ArrowUpDown size={12} className="text-[#d0d0d0] shrink-0" />;
//   };
//   return (
//     <th
//       onClick={() => colKey && onSort(colKey)}
//       className={`px-4 py-3 bg-[#f8f8f8] whitespace-nowrap ${colKey ? 'cursor-pointer select-none' : 'cursor-default'} ${isRight ? 'text-right' : 'text-left'}`}
//     >
//       <div className={`flex items-center gap-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
//         <span className={`text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors ${active ? 'text-[#12a6e0]' : 'text-[#888888]'}`}>
//           {label}
//         </span>
//         <SortIcon />
//       </div>
//     </th>
//   );
// }

// // ── Export CSV ────────────────────────────────────────────────
// function exportCSV(data, cols) {
//   const headers = [
//     'Date', 'Dépôt', 'Nom Dépôt', 'Article', 'Désignation',
//     'Entrées', 'Prix Entrée', 'Sorties', 'Prix Sortie',
//     'Solde Permanent', 'Stock Final',
//   ];
//   const rows = data.map(r => [
//     fmtDate(r[cols.date]),
//     r[cols.depot]      ?? '',
//     r[cols.nomDepot]   ?? '',
//     r[cols.article]    ?? '',
//     r[cols.design]     ?? '',
//     r[cols.entrees]    ?? 0,
//     r[cols.pruEntree]  ?? 0,
//     r[cols.sorties]    ?? 0,
//     r[cols.pruSortie]  ?? 0,
//     r[cols.solde]      ?? 0,
//     r[cols.stockFinal] ?? 0,
//   ]);
//   const csv = [headers, ...rows]
//     .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
//     .join('\n');
//   const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `mouvements_${new Date().toISOString().slice(0, 10)}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// // ── Composant principal ────────────────────────────────────────
// export default function PageMovements() {
//   // ── 1. Récupération des filtres depuis le contexte Dashboard ──
//   const { currentFilters, tableData: dashboardData } = useDashboard();

//   // ── 2. Données mouvements (différentes de stockJournalier) ────
//   const [mouvData, setMouvData] = useState(null);
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState(null);

//   // ── 3. Filtres locaux (article + dépôt) ──────────────────────
//   const [filterArticle, setFilterArticle] = useState('');
//   const [filterDepot, setFilterDepot]     = useState('');

//   // ── 4. Listes d'options pour les selects locaux ───────────────
//   const [articleOptions, setArticleOptions] = useState([]);
//   const [depotOptions, setDepotOptions]     = useState([]);
//   const [loadingFiltres, setLoadingFiltres] = useState(false);

//   // ── 5. Tri ────────────────────────────────────────────────────
//   const [sortKey, setSortKey] = useState(null);
//   const [sortDir, setSortDir] = useState(null);
//   const [page, setPage]       = useState(1);
//   const PAGE_SIZE = 50;

//   // ── Chargement des options article/dépôt depuis les filtres de la base ──
//   useEffect(() => {
//     if (!currentFilters?.base) return;
//     setLoadingFiltres(true);
//     fetchFiltres(currentFilters.base, currentFilters.cl_no1, currentFilters.fa_codefamille)
//       .then(data => {
//         setArticleOptions((data.articles || []).map(a => ({ value: a.Code, label: `${a.Code} — ${a.Libelle}` })));
//         setDepotOptions((data.depots || []).map(d => ({ value: String(d.Code), label: d.Libelle })));
//       })
//       .catch(console.error)
//       .finally(() => setLoadingFiltres(false));
//   }, [currentFilters?.base, currentFilters?.cl_no1, currentFilters?.fa_codefamille]);

//   // ── Chargement des mouvements à l'arrivée sur la page ─────────
//   // On utilise les filtres du Dashboard comme base
//   useEffect(() => {
//     if (!currentFilters?.base) return;
//     loadMouvements(currentFilters);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentFilters?.base, currentFilters?.dateDebut, currentFilters?.dateFin,
//       currentFilters?.fa_codefamille, currentFilters?.cl_no1, currentFilters?.depot]);

//   const loadMouvements = useCallback(async (params) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchMouvements(params);
//       setMouvData(data);
//     } catch (err) {
//       setError(err.message);
//       setMouvData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ── Colonnes détectées ────────────────────────────────────────
//   const cols = useMemo(() => detectColumns(mouvData), [mouvData]);

//   // ── Filtrage local (article + dépôt) sur les données chargées ─
//   const filtered = useMemo(() => {
//     if (!mouvData) return [];
//     return mouvData.filter(row => {
//       const matchArticle = !filterArticle || String(row[cols.article] ?? '') === String(filterArticle);
//       const matchDepot   = !filterDepot   || String(row[cols.depot]   ?? '') === String(filterDepot);
//       return matchArticle && matchDepot;
//     });
//   }, [mouvData, filterArticle, filterDepot, cols]);

//   // ── Tri ───────────────────────────────────────────────────────
//   const sorted = useMemo(() => {
//     if (!filtered.length || !sortKey || !sortDir) return filtered;
//     return [...filtered].sort((a, b) => {
//       const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
//       const na = Number(av), nb = Number(bv);
//       if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
//       return sortDir === 'asc'
//         ? String(av).localeCompare(String(bv), 'fr')
//         : String(bv).localeCompare(String(av), 'fr');
//     });
//   }, [filtered, sortKey, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSort = (key) => {
//     if (!key) return;
//     if (sortKey !== key) { setSortKey(key); setSortDir('asc'); }
//     else if (sortDir === 'asc') setSortDir('desc');
//     else { setSortKey(null); setSortDir(null); }
//     setPage(1);
//   };

//   // ── KPIs des mouvements filtrés ────────────────────────────────
//   const kpis = useMemo(() => {
//     if (!filtered.length || !cols.entrees) return null;
//     let totalE = 0, totalS = 0;
//     for (const r of filtered) {
//       totalE += Number(r[cols.entrees] ?? 0);
//       totalS += Number(r[cols.sorties] ?? 0);
//     }
//     const articles = new Set(filtered.map(r => r[cols.article]).filter(Boolean));
//     const depots   = new Set(filtered.map(r => r[cols.depot]).filter(Boolean));
//     return { totalE, totalS, nbArticles: articles.size, nbDepots: depots.size };
//   }, [filtered, cols]);

//   // ── Infos contextuelles depuis les filtres Dashboard ──────────
//   const ctxBase     = currentFilters?.base        || '—';
//   const ctxDebut    = currentFilters?.dateDebut   || null;
//   const ctxFin      = currentFilters?.dateFin     || null;
//   const ctxFamille  = currentFilters?.fa_codefamille || null;
//   const ctxCatN1    = currentFilters?.cl_no1      || null;
//   const ctxDepot    = currentFilters?.depot        || null;

//   const hasActiveLocalFilters = filterArticle || filterDepot;

//   return (
//     <div className="flex flex-col gap-5">

//       {/* ── BANDEAU CONTEXTE DASHBOARD ─────────────────────────── */}
//       <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07)] overflow-hidden">
//         <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb]">
//           <div className="w-6 h-6 rounded-[0.45rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-sm">
//             <ArrowDownUp size={12} className="text-white" />
//           </div>
//           <span className="text-[#0d0c0c] text-[13px] font-semibold tracking-wide">
//             Mouvements de stock
//           </span>
//           <span className="text-[#c5c5c5] text-[11px] ml-1">— Contexte du tableau de bord</span>
//         </div>

//         <div className="px-5 py-4">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Base */}
//             <div className="flex items-center gap-1.5 bg-[rgba(1,214,58,0.07)] border border-[rgba(1,214,58,0.22)] rounded-full px-3 py-1.5">
//               <Database size={11} className="text-[#01a82e]" />
//               <span className="text-[#01a82e] text-[11px] font-bold uppercase tracking-wide">{ctxBase}</span>
//             </div>

//             {/* Période */}
//             {ctxDebut && ctxFin && (
//               <div className="flex items-center gap-1.5 bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.22)] rounded-full px-3 py-1.5">
//                 <CalendarDays size={11} className="text-[#12a6e0]" />
//                 <span className="text-[#0b7db0] text-[11px] font-semibold">
//                   {fmtDateShort(ctxDebut)} → {fmtDateShort(ctxFin)}
//                 </span>
//               </div>
//             )}

//             {/* Famille */}
//             {ctxFamille && (
//               <div className="flex items-center gap-1.5 bg-[rgba(124,77,255,0.07)] border border-[rgba(124,77,255,0.22)] rounded-full px-3 py-1.5">
//                 <Tag size={11} className="text-[#7c4dff]" />
//                 <span className="text-[#7c4dff] text-[11px] font-semibold">{ctxFamille}</span>
//               </div>
//             )}

//             {/* Catalogue N1 */}
//             {ctxCatN1 && (
//               <div className="flex items-center gap-1.5 bg-[rgba(255,152,0,0.07)] border border-[rgba(255,152,0,0.22)] rounded-full px-3 py-1.5">
//                 <Layers size={11} className="text-[#e08a00]" />
//                 <span className="text-[#e08a00] text-[11px] font-semibold">Cat N1 : {ctxCatN1}</span>
//               </div>
//             )}

//             {/* Dépôt hérité */}
//             {ctxDepot && (
//               <div className="flex items-center gap-1.5 bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.22)] rounded-full px-3 py-1.5">
//                 <Warehouse size={11} className="text-[#e53935]" />
//                 <span className="text-[#e53935] text-[11px] font-semibold">Dépôt : {ctxDepot}</span>
//               </div>
//             )}

//             {/* Aucun filtre Dashboard */}
//             {!ctxDebut && !ctxFamille && !ctxCatN1 && !ctxDepot && (
//               <span className="text-[#c5c5c5] text-[12px] italic">
//                 Aucun filtre actif depuis le tableau de bord — toutes les données sont affichées.
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── FILTRES LOCAUX (Article + Dépôt) ───────────────────── */}
//       <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_8px_rgba(18,166,224,0.05)] px-5 py-4">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
//           <div className="flex items-center gap-2 shrink-0">
//             <SlidersHorizontal size={14} className="text-[#12a6e0]" />
//             <span className="text-[#0d0c0c] text-[13px] font-semibold">Affiner les résultats</span>
//           </div>

//           <div className="w-px h-5 bg-[#eeeeee] hidden sm:block" />

//           <div className="flex flex-wrap gap-3 flex-1">
//             {/* Filtre Article */}
//             <SelectCompact
//               icon={Search}
//               value={filterArticle}
//               onChange={(v) => { setFilterArticle(v); setPage(1); }}
//               options={articleOptions}
//               placeholder="Tous les articles"
//               loading={loadingFiltres}
//               disabled={!mouvData && !loadingFiltres}
//             />

//             {/* Filtre Dépôt */}
//             <SelectCompact
//               icon={Warehouse}
//               value={filterDepot}
//               onChange={(v) => { setFilterDepot(v); setPage(1); }}
//               options={depotOptions}
//               placeholder="Tous les dépôts"
//               loading={loadingFiltres}
//               disabled={!mouvData && !loadingFiltres}
//             />
//           </div>

//           {/* Badges filtres actifs + reset */}
//           {hasActiveLocalFilters && (
//             <div className="flex items-center gap-2 flex-wrap">
//               {filterArticle && (
//                 <FilterBadge
//                   label="Article"
//                   value={articleOptions.find(a => a.value === filterArticle)?.label?.split(' — ')[0] || filterArticle}
//                   onRemove={() => { setFilterArticle(''); setPage(1); }}
//                   color="#12a6e0"
//                   bg="rgba(18,166,224,0.07)"
//                 />
//               )}
//               {filterDepot && (
//                 <FilterBadge
//                   label="Dépôt"
//                   value={depotOptions.find(d => d.value === String(filterDepot))?.label || filterDepot}
//                   onRemove={() => { setFilterDepot(''); setPage(1); }}
//                   color="#e53935"
//                   bg="rgba(229,57,53,0.07)"
//                 />
//               )}
//               <button
//                 onClick={() => { setFilterArticle(''); setFilterDepot(''); setPage(1); }}
//                 className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#888888] bg-[#f5f5f5] border border-[#e8e8e8] hover:bg-[#ebebeb] hover:text-[#333] transition-colors cursor-pointer"
//               >
//                 <X size={10} /> Tout effacer
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── KPI MINI ───────────────────────────────────────────── */}
//       {kpis && !loading && (
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//           {[
//             { label: 'Lignes affichées', value: filtered.length.toLocaleString('fr-FR'), color: '#0d0c0c', sub: 'enregistrements' },
//             { label: 'Total Entrées',    value: fmtNum(kpis.totalE),    color: '#01a82e', sub: 'unités' },
//             { label: 'Total Sorties',    value: fmtNum(kpis.totalS),    color: '#e53935', sub: 'unités' },
//             { label: 'Articles uniques', value: kpis.nbArticles,        color: '#12a6e0', sub: `sur ${kpis.nbDepots} dépôt${kpis.nbDepots > 1 ? 's' : ''}` },
//           ].map(({ label, value, color, sub }) => (
//             <div key={label} className="bg-white border border-[#eeeeee] rounded-xl px-4 py-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
//               <p className="text-[#aaaaaa] text-[11px] font-medium m-0 mb-0.5">{label}</p>
//               <p className="m-0 text-[1.4rem] font-bold leading-tight tracking-tight" style={{ color }}>{value}</p>
//               <p className="text-[#c5c5c5] text-[10px] mt-0.5 m-0">{sub}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── ERREUR ─────────────────────────────────────────────── */}
//       {error && (
//         <div className="bg-[rgba(229,57,53,0.06)] border border-[rgba(229,57,53,0.20)] rounded-xl px-5 py-4 text-[#c62828] text-sm flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-[#e53935] shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* ── AVERTISSEMENT : pas de filtre Dashboard ────────────── */}
//       {!currentFilters?.base && !loading && (
//         <div className="bg-[rgba(18,166,224,0.04)] border border-[rgba(18,166,224,0.15)] rounded-xl px-5 py-4 text-[#0b7db0] text-sm flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-[#12a6e0] shrink-0 animate-pulse" />
//           <span>Rendez-vous sur le <strong>Tableau de bord</strong> pour sélectionner une base et une période, puis revenez ici.</span>
//         </div>
//       )}

//       {/* ── TABLEAU ────────────────────────────────────────────── */}
//       {(loading || mouvData !== null) && (
//         <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

//           {/* Header tableau */}
//           <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
//               <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
//                 Mouvements
//               </span>
//               {!loading && (
//                 <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
//                   {sorted.length.toLocaleString('fr-FR')} lignes
//                 </span>
//               )}
//               {hasActiveLocalFilters && (
//                 <span className="bg-[rgba(18,166,224,0.08)] text-[#0b7db0] text-[0.6875rem] font-semibold px-2 py-0.5 rounded border border-[rgba(18,166,224,0.15)]">
//                   filtrés
//                 </span>
//               )}
//             </div>
//             {!loading && mouvData && mouvData.length > 0 && (
//               <button
//                 onClick={() => exportCSV(sorted, cols)}
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all duration-150 hover:bg-[#eaeaea] hover:text-[#0d0c0c]"
//               >
//                 <Download size={12} />
//                 Exporter CSV
//               </button>
//             )}
//           </div>

//           {/* Skeleton loading */}
//           {loading && (
//             <div className="p-5 flex flex-col gap-2">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <div key={i} className="h-10 bg-[#f8f8f8] rounded-lg animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
//               ))}
//             </div>
//           )}

//           {/* Vide */}
//           {!loading && sorted.length === 0 && (
//             <div className="p-16 text-center">
//               <PackageX size={36} className="text-[#e0e0e0] mx-auto mb-3" />
//               <p className="text-[#c5c5c5] text-sm">Aucun mouvement pour ces filtres.</p>
//             </div>
//           )}

//           {/* Données */}
//           {!loading && sorted.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <colgroup>
//                   <col style={{ minWidth: 95  }} /> {/* Date */}
//                   <col style={{ minWidth: 100 }} /> {/* Article */}
//                   <col style={{ minWidth: 180 }} /> {/* Désignation */}
//                   <col style={{ minWidth: 60  }} /> {/* Dépôt */}
//                   <col style={{ minWidth: 130 }} /> {/* Nom Dépôt */}
//                   <col style={{ minWidth: 85  }} /> {/* Entrées */}
//                   <col style={{ minWidth: 85  }} /> {/* PRU Entrée */}
//                   <col style={{ minWidth: 85  }} /> {/* Sorties */}
//                   <col style={{ minWidth: 85  }} /> {/* PRU Sortie */}
//                   <col style={{ minWidth: 110 }} /> {/* Total Valeur Mvt */}
//                   <col style={{ minWidth: 120 }} /> {/* Solde Permanent */}
//                   <col style={{ minWidth: 100 }} /> {/* Stock Final */}
//                 </colgroup>
//                 <thead>
//                   <tr className="border-b border-[#f0f0f0]">
//                     <Th label="Date"              colKey={cols.date}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//                     <Th label="Article"           colKey={cols.article}   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//                     <Th label="Désignation" />
//                     <Th label="Dépôt"             colKey={cols.depot}     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//                     <Th label="Nom Dépôt" />
//                     <Th label="Entrées"           colKey={cols.entrees}   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                     <Th label="PRU Entrée"        colKey={cols.pruEntree} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                     <Th label="Sorties"           colKey={cols.sorties}   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                     <Th label="PRU Sortie"        colKey={cols.pruSortie} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                     <Th label="Valeur Mvt"        colKey={cols.valeurMvt} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                     <Th label="Solde Permanent"   colKey={cols.solde}     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                     <Th label="Stock Final"       colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((row, idx) => {
//                     const e          = Number(row[cols.entrees]    ?? 0);
//                     const s          = Number(row[cols.sorties]    ?? 0);
//                     const pruE       = Number(row[cols.pruEntree]  ?? 0);
//                     const pruS       = Number(row[cols.pruSortie]  ?? 0);
//                     const valeurMvt  = Number(row[cols.valeurMvt]  ?? 0);
//                     const solde      = Number(row[cols.solde]      ?? 0);
//                     const stockFinal = Number(row[cols.stockFinal] ?? 0);
//                     const hasMvt     = e > 0 || s > 0;

//                     return (
//                       <tr
//                         key={idx}
//                         className={`border-b border-[#f8f8f8] transition-colors duration-100 ${hasMvt ? 'hover:bg-[rgba(18,166,224,0.03)]' : 'opacity-60 hover:bg-[#fafafa]'}`}
//                       >
//                         {/* Date */}
//                         <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888] whitespace-nowrap">
//                           {fmtDate(row[cols.date])}
//                         </td>

//                         {/* Article */}
//                         <td className="px-4 py-3 font-mono text-[0.75rem] text-[#12a6e0] whitespace-nowrap">
//                           {row[cols.article] ?? '—'}
//                         </td>

//                         {/* Désignation */}
//                         <td className="px-4 py-3 text-[#444444] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]" title={row[cols.design]}>
//                           {row[cols.design] ?? '—'}
//                         </td>

//                         {/* Dépôt */}
//                         <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888]">
//                           {row[cols.depot] ?? '—'}
//                         </td>

//                         {/* Nom Dépôt */}
//                         <td className="px-4 py-3 text-[#555555] text-[0.75rem] whitespace-nowrap">
//                           {row[cols.nomDepot] ?? '—'}
//                         </td>

//                         {/* Entrées */}
//                         <td className="px-4 py-3 text-right">
//                           {e > 0
//                             ? <span className="text-[#01a82e] font-semibold text-[0.8125rem]">{fmtNum(e)}</span>
//                             : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
//                           }
//                         </td>

//                         {/* PRU Entrée */}
//                         <td className="px-4 py-3 text-right">
//                           {pruE > 0
//                             ? <span className="text-[#555555] text-[0.75rem]">{fmtNum(pruE)}</span>
//                             : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
//                           }
//                         </td>

//                         {/* Sorties */}
//                         <td className="px-4 py-3 text-right">
//                           {s > 0
//                             ? <span className="text-[#e53935] font-semibold text-[0.8125rem]">{fmtNum(s)}</span>
//                             : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
//                           }
//                         </td>

//                         {/* PRU Sortie */}
//                         <td className="px-4 py-3 text-right">
//                           {pruS > 0
//                             ? <span className="text-[#555555] text-[0.75rem]">{fmtNum(pruS)}</span>
//                             : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
//                           }
//                         </td>

//                         {/* Total Valeur Mouvement */}
//                         <td className="px-4 py-3 text-right">
//                           <span className={`text-[0.75rem] font-medium ${valeurMvt > 0 ? 'text-[#555555]' : valeurMvt < 0 ? 'text-[#e53935]' : 'text-[#c5c5c5]'}`}>
//                             {valeurMvt !== 0 ? fmtNum(valeurMvt) : '—'}
//                           </span>
//                         </td>

//                         {/* Solde Permanent (ValeurFinale) */}
//                         <td className="px-4 py-3 text-right">
//                           <span className={`font-semibold text-[0.875rem] ${solde > 0 ? 'text-[#12a6e0]' : solde < 0 ? 'text-[#e53935]' : 'text-[#c5c5c5]'}`}>
//                             {cols.solde ? fmtNum(solde) : <span className="text-[0.7rem] italic text-[#cccccc]">—</span>}
//                           </span>
//                         </td>

//                         {/* Stock Final */}
//                         <td className="px-4 py-3 text-right">
//                           {!cols.stockFinal
//                             ? <span className="text-[0.7rem] italic text-[#cccccc]">—</span>
//                             : stockFinal > 0
//                             ? <span className="inline-flex items-center gap-1 text-[#e08a00] font-semibold text-[0.8125rem]">
//                                 <TrendingUp size={11} />{fmtNum(stockFinal)}
//                               </span>
//                             : stockFinal < 0
//                             ? <span className="inline-flex items-center gap-1 text-[#e53935] font-semibold text-[0.8125rem]">
//                                 <TrendingDown size={11} />{fmtNum(stockFinal)}
//                               </span>
//                             : <span className="inline-flex items-center gap-1 text-[#c5c5c5] text-[0.75rem]">
//                                 <Minus size={10} />0
//                               </span>
//                           }
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {!loading && totalPages > 1 && (
//             <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
//               <span className="text-[#c5c5c5] text-[0.75rem]">Page {page} / {totalPages}</span>
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed"
//                 >← Préc.</button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
//                   if (p < 1 || p > totalPages) return null;
//                   return (
//                     <button
//                       key={p}
//                       onClick={() => setPage(p)}
//                       className={`w-8 h-8 rounded-lg text-[0.75rem] cursor-pointer transition-all ${page === p ? 'bg-[#12a6e0] text-white font-semibold border-0' : 'bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] hover:bg-[#eaeaea]'}`}
//                     >{p}</button>
//                   );
//                 })}
//                 <button
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed"
//                 >Suiv. →</button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Warehouse,
  PackageX,
  Download,
  Search,
  SlidersHorizontal,
  CalendarDays,
  Database,
  Tag,
  Layers,
  X,
  ChevronDown,
  Loader2,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  PackageCheck,
  PackageOpen,
  Boxes,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { fetchMouvements, fetchFiltres } from '../api/stockApi';

// ── Helpers ────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

const fmtDateShort = (d) => {
  if (!d) return '—';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
};

const fmtNum = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

// ── Détection des colonnes ─────────────────────────────────────
function detectColumns(data) {
  if (!data || data.length === 0) return {};
  const keys = Object.keys(data[0]);
  console.log('📋 Colonnes mouvements reçues:', keys);

  const find = (...variants) =>
    keys.find(k =>
      variants.some(v =>
        k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, '')
      )
    ) || null;

  return {
    date:        find('Date', 'DateJour'),
    article:     find('Article', 'AR_Ref'),
    design:      find('Designation', 'AR_Design', 'Désignation'),
    depot:       find('Depot', 'DE_No'),
    nomDepot:    find('Nom Depot', 'NomDepot', 'DE_Intitule'),
    entrees:     find('Total Entrees', 'TotalEntree', 'TotalEntrees'),
    pruEntree:   find('PRU Entree', 'PRU_Entree_Jour', 'PRUEntree'),
    sorties:     find('Total Sorties', 'TotalSortie', 'TotalSorties'),
    pruSortie:   find('PRU Sortie', 'PRU_Sortie_Jour', 'PRUSortie'),
    valeurMvt:   find('Total Valeur Mouvement', 'TotalValeurMouvement'),
    solde:       find('Valeur Finale Permanente', 'ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale'),
    stockFinal:  find('Stock Final', 'StockFinal'),
  };
}

// ── Badge filtre actif ─────────────────────────────────────────
function FilterBadge({ label, value, onRemove, color = '#12a6e0', bg = 'rgba(18,166,224,0.07)' }) {
  if (!value) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
      style={{ color, background: bg, borderColor: `${color}33` }}
    >
      {label}: {value}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity">
          <X size={10} />
        </button>
      )}
    </span>
  );
}

// ── Select compact avec recherche intégrée ─────────────────────
function SelectCompact({ icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = React.useRef(null);
  const inputRef = React.useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q));
  }, [options, search]);

  const selected = options.find(o => String(o.value) === String(value));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { if (!disabled && !loading) setOpen(p => !p); }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] transition-all duration-150 min-w-[180px]
          ${open ? 'border-[#12a6e0] shadow-[0_0_0_3px_rgba(18,166,224,0.12)] bg-white' : ''}
          ${disabled ? 'border-[#e8e8e8] bg-[#f8f8f8] text-[#c5c5c5] cursor-not-allowed' : 'border-[#e0e0e0] bg-white hover:border-[#12a6e0] cursor-pointer'}
          ${selected && !disabled ? 'text-[#0d0c0c]' : 'text-[#aaaaaa]'}
        `}
      >
        {Icon && <Icon size={13} className={selected && !disabled ? 'text-[#12a6e0]' : 'text-[#c5c5c5]'} />}
        <span className="flex-1 truncate max-w-[150px]">{selected ? selected.label : placeholder}</span>
        {loading
          ? <Loader2 size={12} className="text-[#12a6e0] animate-spin shrink-0" />
          : <ChevronDown size={12} className={`shrink-0 transition-transform duration-200 text-[#c5c5c5] ${open ? 'rotate-180' : ''}`} />
        }
      </button>

      {open && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-[9999] bg-white border border-[#cce8f6] rounded-xl shadow-[0_8px_28px_rgba(18,166,224,0.2),0_4px_12px_rgba(0,0,0,0.12)] min-w-[260px]">
          {/* Champ de recherche */}
          <div className="px-3 pt-3 pb-2 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-2 bg-[#f5faff] border border-[#d4ecf7] rounded-lg px-2.5 py-1.5">
              <Search size={12} className="text-[#12a6e0] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none text-[12px] text-[#0d0c0c] placeholder-[#aaaaaa] w-full"
                onClick={e => e.stopPropagation()}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-[#c5c5c5] hover:text-[#888] shrink-0">
                  <X size={10} />
                </button>
              )}
            </div>
          </div>

          {/* Liste */}
          <div className="max-h-[220px] overflow-y-auto">
            <div
              onClick={() => { onChange(''); setOpen(false); }}
              className={`px-3 py-2 text-[12px] cursor-pointer flex items-center justify-between border-b border-[#f0f0f0] ${!value ? 'bg-[rgba(18,166,224,0.05)]' : 'hover:bg-[#f5faff]'}`}
            >
              <span className="italic text-[#aaaaaa]">{placeholder}</span>
              {!value && <Check size={11} className="text-[#12a6e0]" />}
            </div>
            {filtered.map(o => (
              <div
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`px-3 py-2 text-[12px] cursor-pointer flex items-center justify-between border-b border-[#f8f8f8] transition-colors
                  ${String(value) === String(o.value) ? 'bg-[rgba(18,166,224,0.07)] text-[#0b7db0] font-semibold' : 'text-[#1a1a1a] hover:bg-[#f5faff]'}`}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {String(value) === String(o.value) && <Check size={11} className="text-[#12a6e0] shrink-0" />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-5 text-[12px] text-[#c5c5c5] text-center flex flex-col items-center gap-1.5">
                <Search size={16} className="text-[#e0e0e0]" />
                Aucun résultat pour « {search} »
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── En-tête de colonne triable ─────────────────────────────────
function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
  const active = sortKey === colKey;
  const isRight = align === 'right';
  const SortIcon = () => {
    if (!colKey) return null;
    if (active) return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-[#12a6e0] shrink-0" />
      : <ArrowDown size={12} className="text-[#12a6e0] shrink-0" />;
    return <ArrowUpDown size={12} className="text-[#d0d0d0] shrink-0" />;
  };
  return (
    <th
      onClick={() => colKey && onSort(colKey)}
      className={`px-4 py-3 bg-[#f8f8f8] whitespace-nowrap ${colKey ? 'cursor-pointer select-none' : 'cursor-default'} ${isRight ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-center gap-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
        <span className={`text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors ${active ? 'text-[#12a6e0]' : 'text-[#888888]'}`}>
          {label}
        </span>
        <SortIcon />
      </div>
    </th>
  );
}

// ── Export CSV ─────────────────────────────────────────────────
function exportCSV(data, cols) {
  const headers = [
    'Date', 'Dépôt', 'Nom Dépôt', 'Article', 'Désignation',
    'Entrées', 'Prix Entrée', 'Sorties', 'Prix Sortie',
    'Solde Permanent', 'Stock Final',
  ];
  const rows = data.map(r => [
    fmtDate(r[cols.date]),
    r[cols.depot]      ?? '',
    r[cols.nomDepot]   ?? '',
    r[cols.article]    ?? '',
    r[cols.design]     ?? '',
    r[cols.entrees]    ?? 0,
    r[cols.pruEntree]  ?? 0,
    r[cols.sorties]    ?? 0,
    r[cols.pruSortie]  ?? 0,
    r[cols.solde]      ?? 0,
    r[cols.stockFinal] ?? 0,
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mouvements_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── KPI Card ───────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, bgColor, borderColor, icon: Icon, iconBg }) {
  return (
    <div
      className="bg-white rounded-xl px-4 py-4 flex items-center gap-4"
      style={{ border: `1.5px solid ${borderColor}`, boxShadow: `0 2px 12px ${bgColor}` }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[#aaaaaa] text-[11px] font-medium m-0 mb-0.5 uppercase tracking-wide">{label}</p>
        <p className="m-0 text-[1.45rem] font-bold leading-tight tracking-tight" style={{ color }}>{value}</p>
        <p className="text-[#c5c5c5] text-[10px] mt-0.5 m-0">{sub}</p>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────
export default function PageMovements() {
  const { currentFilters, tableData: dashboardData } = useDashboard();

  const [mouvData, setMouvData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const [filterArticle, setFilterArticle] = useState('');
  const [filterDepot, setFilterDepot]     = useState('');

  const [articleOptions, setArticleOptions] = useState([]);
  const [depotOptions, setDepotOptions]     = useState([]);
  const [loadingFiltres, setLoadingFiltres] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [page, setPage]       = useState(1);
  const PAGE_SIZE = 50;

  useEffect(() => {
    if (!currentFilters?.base) return;
    setLoadingFiltres(true);
    fetchFiltres(currentFilters.base, currentFilters.cl_no1, currentFilters.fa_codefamille)
      .then(data => {
        setArticleOptions((data.articles || []).map(a => ({ value: a.Code, label: `${a.Code} — ${a.Libelle}` })));
        setDepotOptions((data.depots || []).map(d => ({ value: String(d.Code), label: d.Libelle })));
      })
      .catch(console.error)
      .finally(() => setLoadingFiltres(false));
  }, [currentFilters?.base, currentFilters?.cl_no1, currentFilters?.fa_codefamille]);

  useEffect(() => {
    if (!currentFilters?.base) return;
    loadMouvements(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilters?.base, currentFilters?.dateDebut, currentFilters?.dateFin,
      currentFilters?.fa_codefamille, currentFilters?.cl_no1, currentFilters?.depot]);

  const loadMouvements = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMouvements(params);
      setMouvData(data);
    } catch (err) {
      setError(err.message);
      setMouvData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const cols = useMemo(() => detectColumns(mouvData), [mouvData]);

  const filtered = useMemo(() => {
    if (!mouvData) return [];
    return mouvData.filter(row => {
      const matchArticle = !filterArticle || String(row[cols.article] ?? '') === String(filterArticle);
      const matchDepot   = !filterDepot   || String(row[cols.depot]   ?? '') === String(filterDepot);
      return matchArticle && matchDepot;
    });
  }, [mouvData, filterArticle, filterDepot, cols]);

  const sorted = useMemo(() => {
    if (!filtered.length || !sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const na = Number(av), nb = Number(bv);
      if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'fr')
        : String(bv).localeCompare(String(av), 'fr');
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortKey(null); setSortDir(null); }
    setPage(1);
  };

  const kpis = useMemo(() => {
    if (!filtered.length || !cols.entrees) return null;
    let totalE = 0, totalS = 0;
    for (const r of filtered) {
      totalE += Number(r[cols.entrees] ?? 0);
      totalS += Number(r[cols.sorties] ?? 0);
    }
    const articles = new Set(filtered.map(r => r[cols.article]).filter(Boolean));
    const depots   = new Set(filtered.map(r => r[cols.depot]).filter(Boolean));
    return { totalE, totalS, nbArticles: articles.size, nbDepots: depots.size };
  }, [filtered, cols]);

  const ctxBase     = currentFilters?.base        || '—';
  const ctxDebut    = currentFilters?.dateDebut   || null;
  const ctxFin      = currentFilters?.dateFin     || null;
  const ctxFamille  = currentFilters?.fa_codefamille || null;
  const ctxCatN1    = currentFilters?.cl_no1      || null;
  const ctxDepot    = currentFilters?.depot        || null;

  const hasActiveLocalFilters = filterArticle || filterDepot;

  return (
    <div className="flex flex-col gap-5">

      {/* ── BANDEAU CONTEXTE DASHBOARD ─────────────────────────── */}
      <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb]">
          <div className="w-6 h-6 rounded-[0.45rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-sm">
            <ArrowDownUp size={12} className="text-white" />
          </div>
          <span className="text-[#0d0c0c] text-[13px] font-semibold tracking-wide">
            Mouvements de stock
          </span>
          <span className="text-[#c5c5c5] text-[11px] ml-1">— Contexte du tableau de bord</span>
        </div>

        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[rgba(1,214,58,0.07)] border border-[rgba(1,214,58,0.22)] rounded-full px-3 py-1.5">
              <Database size={11} className="text-[#01a82e]" />
              <span className="text-[#01a82e] text-[11px] font-bold uppercase tracking-wide">{ctxBase}</span>
            </div>
            {ctxDebut && ctxFin && (
              <div className="flex items-center gap-1.5 bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.22)] rounded-full px-3 py-1.5">
                <CalendarDays size={11} className="text-[#12a6e0]" />
                <span className="text-[#0b7db0] text-[11px] font-semibold">
                  {fmtDateShort(ctxDebut)} → {fmtDateShort(ctxFin)}
                </span>
              </div>
            )}
            {ctxFamille && (
              <div className="flex items-center gap-1.5 bg-[rgba(124,77,255,0.07)] border border-[rgba(124,77,255,0.22)] rounded-full px-3 py-1.5">
                <Tag size={11} className="text-[#7c4dff]" />
                <span className="text-[#7c4dff] text-[11px] font-semibold">{ctxFamille}</span>
              </div>
            )}
            {ctxCatN1 && (
              <div className="flex items-center gap-1.5 bg-[rgba(255,152,0,0.07)] border border-[rgba(255,152,0,0.22)] rounded-full px-3 py-1.5">
                <Layers size={11} className="text-[#e08a00]" />
                <span className="text-[#e08a00] text-[11px] font-semibold">Cat N1 : {ctxCatN1}</span>
              </div>
            )}
            {ctxDepot && (
              <div className="flex items-center gap-1.5 bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.22)] rounded-full px-3 py-1.5">
                <Warehouse size={11} className="text-[#e53935]" />
                <span className="text-[#e53935] text-[11px] font-semibold">Dépôt : {ctxDepot}</span>
              </div>
            )}
            {!ctxDebut && !ctxFamille && !ctxCatN1 && !ctxDepot && (
              <span className="text-[#c5c5c5] text-[12px] italic">
                Aucun filtre actif depuis le tableau de bord — toutes les données sont affichées.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTRES LOCAUX ──────────────────────────────────────── */}
      <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_8px_rgba(18,166,224,0.05)] px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={14} className="text-[#12a6e0]" />
            <span className="text-[#0d0c0c] text-[13px] font-semibold">Affiner les résultats</span>
          </div>

          <div className="w-px h-5 bg-[#eeeeee] hidden sm:block" />

          <div className="flex flex-wrap gap-3 flex-1">
            <SelectCompact
              icon={Search}
              value={filterArticle}
              onChange={(v) => { setFilterArticle(v); setPage(1); }}
              options={articleOptions}
              placeholder="Tous les articles"
              loading={loadingFiltres}
              disabled={!mouvData && !loadingFiltres}
            />
            <SelectCompact
              icon={Warehouse}
              value={filterDepot}
              onChange={(v) => { setFilterDepot(v); setPage(1); }}
              options={depotOptions}
              placeholder="Tous les dépôts"
              loading={loadingFiltres}
              disabled={!mouvData && !loadingFiltres}
            />
          </div>

          {hasActiveLocalFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {filterArticle && (
                <FilterBadge
                  label="Article"
                  value={articleOptions.find(a => a.value === filterArticle)?.label?.split(' — ')[0] || filterArticle}
                  onRemove={() => { setFilterArticle(''); setPage(1); }}
                  color="#12a6e0"
                  bg="rgba(18,166,224,0.07)"
                />
              )}
              {filterDepot && (
                <FilterBadge
                  label="Dépôt"
                  value={depotOptions.find(d => d.value === String(filterDepot))?.label || filterDepot}
                  onRemove={() => { setFilterDepot(''); setPage(1); }}
                  color="#e53935"
                  bg="rgba(229,57,53,0.07)"
                />
              )}
              <button
                onClick={() => { setFilterArticle(''); setFilterDepot(''); setPage(1); }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#888888] bg-[#f5f5f5] border border-[#e8e8e8] hover:bg-[#ebebeb] hover:text-[#333] transition-colors cursor-pointer"
              >
                <X size={10} /> Tout effacer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI 3 CARTES ───────────────────────────────────────── */}
      {kpis && !loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <KpiCard
            label="Total Entrées"
            value={fmtNum(kpis.totalE)}
            sub="unités reçues sur la période"
            color="#01a82e"
            bgColor="rgba(1,168,46,0.06)"
            borderColor="rgba(1,168,46,0.18)"
            iconBg="rgba(1,168,46,0.08)"
            icon={PackageCheck}
          />
          <KpiCard
            label="Total Sorties"
            value={fmtNum(kpis.totalS)}
            sub="unités expédiées sur la période"
            color="#e53935"
            bgColor="rgba(229,57,53,0.06)"
            borderColor="rgba(229,57,53,0.18)"
            iconBg="rgba(229,57,53,0.08)"
            icon={PackageOpen}
          />
          <KpiCard
            label="Articles uniques"
            value={kpis.nbArticles}
            sub={`sur ${kpis.nbDepots} dépôt${kpis.nbDepots > 1 ? 's' : ''}`}
            color="#12a6e0"
            bgColor="rgba(18,166,224,0.06)"
            borderColor="rgba(18,166,224,0.18)"
            iconBg="rgba(18,166,224,0.08)"
            icon={Boxes}
          />
        </div>
      )}

      {/* ── ERREUR ─────────────────────────────────────────────── */}
      {error && (
        <div className="bg-[rgba(229,57,53,0.06)] border border-[rgba(229,57,53,0.20)] rounded-xl px-5 py-4 text-[#c62828] text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#e53935] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── AVERTISSEMENT ──────────────────────────────────────── */}
      {!currentFilters?.base && !loading && (
        <div className="bg-[rgba(18,166,224,0.04)] border border-[rgba(18,166,224,0.15)] rounded-xl px-5 py-4 text-[#0b7db0] text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#12a6e0] shrink-0 animate-pulse" />
          <span>Rendez-vous sur le <strong>Tableau de bord</strong> pour sélectionner une base et une période, puis revenez ici.</span>
        </div>
      )}

      {/* ── TABLEAU ────────────────────────────────────────────── */}
      {(loading || mouvData !== null) && (
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

          {/* Header tableau */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
              <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
                Mouvements
              </span>
              {!loading && (
                <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
                  {sorted.length.toLocaleString('fr-FR')} lignes
                </span>
              )}
              {hasActiveLocalFilters && (
                <span className="bg-[rgba(18,166,224,0.08)] text-[#0b7db0] text-[0.6875rem] font-semibold px-2 py-0.5 rounded border border-[rgba(18,166,224,0.15)]">
                  filtrés
                </span>
              )}
            </div>
            {!loading && mouvData && mouvData.length > 0 && (
              <button
                onClick={() => exportCSV(sorted, cols)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all duration-150 hover:bg-[#eaeaea] hover:text-[#0d0c0c]"
              >
                <Download size={12} />
                Exporter CSV
              </button>
            )}
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="p-5 flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#f8f8f8] rounded-lg animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          )}

          {/* Vide */}
          {!loading && sorted.length === 0 && (
            <div className="p-16 text-center">
              <PackageX size={36} className="text-[#e0e0e0] mx-auto mb-3" />
              <p className="text-[#c5c5c5] text-sm">Aucun mouvement pour ces filtres.</p>
            </div>
          )}

          {/* Données */}
          {!loading && sorted.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <colgroup>
                  <col style={{ minWidth: 95  }} />
                  <col style={{ minWidth: 100 }} />
                  <col style={{ minWidth: 180 }} />
                  <col style={{ minWidth: 60  }} />
                  <col style={{ minWidth: 130 }} />
                  <col style={{ minWidth: 85  }} />
                  <col style={{ minWidth: 85  }} />
                  <col style={{ minWidth: 85  }} />
                  <col style={{ minWidth: 85  }} />
                  <col style={{ minWidth: 110 }} />
                  <col style={{ minWidth: 120 }} />
                  <col style={{ minWidth: 100 }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#f0f0f0]">
                    <Th label="Date"            colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <Th label="Article"         colKey={cols.article}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <Th label="Désignation" />
                    <Th label="Dépôt"           colKey={cols.depot}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <Th label="Nom Dépôt" />
                    <Th label="Entrées"         colKey={cols.entrees}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                    <Th label="PRU Entrée"      colKey={cols.pruEntree}  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                    <Th label="Sorties"         colKey={cols.sorties}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                    <Th label="PRU Sortie"      colKey={cols.pruSortie}  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                    <Th label="Valeur Mvt"      colKey={cols.valeurMvt}  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                    <Th label="Solde Permanent" colKey={cols.solde}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                    <Th label="Stock Final"     colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row, idx) => {
                    const e          = Number(row[cols.entrees]    ?? 0);
                    const s          = Number(row[cols.sorties]    ?? 0);
                    const pruE       = Number(row[cols.pruEntree]  ?? 0);
                    const pruS       = Number(row[cols.pruSortie]  ?? 0);
                    const valeurMvt  = Number(row[cols.valeurMvt]  ?? 0);
                    const solde      = Number(row[cols.solde]      ?? 0);
                    const stockFinal = Number(row[cols.stockFinal] ?? 0);
                    const hasMvt     = e > 0 || s > 0;

                    return (
                      <tr
                        key={idx}
                        className={`border-b border-[#f8f8f8] transition-colors duration-100 ${hasMvt ? 'hover:bg-[rgba(18,166,224,0.03)]' : 'opacity-60 hover:bg-[#fafafa]'}`}
                      >
                        {/* Date */}
                        <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888] whitespace-nowrap">
                          {fmtDate(row[cols.date])}
                        </td>

                        {/* Article */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-block font-mono text-[0.72rem] text-[#0b7db0] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.15)] rounded-md px-2 py-0.5">
                            {row[cols.article] ?? '—'}
                          </span>
                        </td>

                        {/* Désignation */}
                        <td className="px-4 py-3 text-[#444444] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]" title={row[cols.design]}>
                          {row[cols.design] ?? '—'}
                        </td>

                        {/* Dépôt */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-block font-mono text-[0.72rem] text-[#666666] bg-[#f4f4f4] border border-[#e8e8e8] rounded-md px-2 py-0.5">
                            {row[cols.depot] ?? '—'}
                          </span>
                        </td>

                        {/* Nom Dépôt */}
                        <td className="px-4 py-3 text-[#555555] text-[0.75rem] whitespace-nowrap">
                          {row[cols.nomDepot] ?? '—'}
                        </td>

                        {/* Entrées */}
                        <td className="px-4 py-3 text-right">
                          {e > 0
                            ? <span className="inline-block text-[#01773d] font-semibold text-[0.8rem] bg-[rgba(1,168,46,0.07)] border border-[rgba(1,168,46,0.18)] rounded-md px-2 py-0.5">
                                {fmtNum(e)}
                              </span>
                            : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                          }
                        </td>

                        {/* PRU Entrée */}
                        <td className="px-4 py-3 text-right">
                          {pruE > 0
                            ? <span className="text-[#555555] text-[0.75rem]">{fmtNum(pruE)}</span>
                            : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                          }
                        </td>

                        {/* Sorties */}
                        <td className="px-4 py-3 text-right">
                          {s > 0
                            ? <span className="inline-block text-[#b71c1c] font-semibold text-[0.8rem] bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-md px-2 py-0.5">
                                {fmtNum(s)}
                              </span>
                            : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                          }
                        </td>

                        {/* PRU Sortie */}
                        <td className="px-4 py-3 text-right">
                          {pruS > 0
                            ? <span className="text-[#555555] text-[0.75rem]">{fmtNum(pruS)}</span>
                            : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                          }
                        </td>

                        {/* Total Valeur Mouvement */}
                        <td className="px-4 py-3 text-right">
                          {valeurMvt !== 0
                            ? <span
                                className="inline-block text-[0.75rem] font-medium rounded-md px-2 py-0.5 border"
                                style={
                                  valeurMvt > 0
                                    ? { color: '#4a4a4a', background: '#f7f7f7', borderColor: '#e4e4e4' }
                                    : { color: '#b71c1c', background: 'rgba(229,57,53,0.05)', borderColor: 'rgba(229,57,53,0.15)' }
                                }
                              >
                                {fmtNum(valeurMvt)}
                              </span>
                            : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                          }
                        </td>

                        {/* Solde Permanent */}
                        <td className="px-4 py-3 text-right">
                          {cols.solde
                            ? <span
                                className="inline-block font-semibold text-[0.8rem] rounded-md px-2 py-0.5 border"
                                style={
                                  solde > 0
                                    ? { color: '#0b7db0', background: 'rgba(18,166,224,0.07)', borderColor: 'rgba(18,166,224,0.18)' }
                                    : solde < 0
                                    ? { color: '#b71c1c', background: 'rgba(229,57,53,0.07)', borderColor: 'rgba(229,57,53,0.18)' }
                                    : { color: '#c5c5c5', background: '#fafafa', borderColor: '#eeeeee' }
                                }
                              >
                                {fmtNum(solde)}
                              </span>
                            : <span className="text-[0.7rem] italic text-[#cccccc]">—</span>
                          }
                        </td>

                        {/* Stock Final */}
                        <td className="px-4 py-3 text-right">
                          {!cols.stockFinal
                            ? <span className="text-[0.7rem] italic text-[#cccccc]">—</span>
                            : stockFinal > 0
                            ? <span className="inline-flex items-center gap-1 text-[#c47a00] font-semibold text-[0.8rem] bg-[rgba(224,138,0,0.08)] border border-[rgba(224,138,0,0.2)] rounded-md px-2 py-0.5">
                                <TrendingUp size={11} />{fmtNum(stockFinal)}
                              </span>
                            : stockFinal < 0
                            ? <span className="inline-flex items-center gap-1 text-[#b71c1c] font-semibold text-[0.8rem] bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-md px-2 py-0.5">
                                <TrendingDown size={11} />{fmtNum(stockFinal)}
                              </span>
                            : <span className="inline-flex items-center gap-1 text-[#c5c5c5] text-[0.75rem] bg-[#fafafa] border border-[#eeeeee] rounded-md px-2 py-0.5">
                                <Minus size={10} />0
                              </span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
              <span className="text-[#c5c5c5] text-[0.75rem]">Page {page} / {totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed"
                >← Préc.</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-[0.75rem] cursor-pointer transition-all ${page === p ? 'bg-[#12a6e0] text-white font-semibold border-0' : 'bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] hover:bg-[#eaeaea]'}`}
                    >{p}</button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed"
                >Suiv. →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}