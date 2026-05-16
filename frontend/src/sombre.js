// filter.js 
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Database,
//   Layers,
//   Package,
//   Warehouse,
//   CalendarDays,
//   Search,
//   RefreshCw,
//   ChevronDown,
//   Loader2,
// } from 'lucide-react';
// import { fetchBases, fetchFiltres } from '../api/stockApi';

// // ── Composant Select réutilisable ────────────────────────────
// function Select({ label, icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
//         {Icon && <Icon size={11} />}
//         {label}
//       </label>
//       <div className="relative">
//         <select
//           value={value}
//           onChange={e => onChange(e.target.value)}
//           disabled={disabled || loading}
//           className={`
//             w-full appearance-none bg-[#1a2235] border rounded-lg px-3 py-2.5
//             text-sm pr-8 outline-none transition-all cursor-pointer
//             ${disabled || loading
//               ? 'border-white/5 text-white/20 cursor-not-allowed'
//               : 'border-white/10 text-white/70 hover:border-sky-500/40 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20'
//             }
//           `}
//         >
//           <option value="">{placeholder}</option>
//           {options.map(o => (
//             <option key={o.value} value={o.value}>
//               {o.label}
//             </option>
//           ))}
//         </select>
//         <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
//           {loading
//             ? <Loader2 size={13} className="text-sky-400 animate-spin" />
//             : <ChevronDown size={13} className="text-white/25" />
//           }
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Composant Input date ─────────────────────────────────────
// function DateInput({ label, value, onChange, min, max }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
//         <CalendarDays size={11} />
//         {label}
//       </label>
//       <input
//         type="date"
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         min={min}
//         max={max}
//         className="
//           w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5
//           text-sm text-white/70 outline-none transition-all
//           hover:border-sky-500/40 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
//           [color-scheme:dark]
//         "
//       />
//     </div>
//   );
// }

// // ── Composant principal Filters ──────────────────────────────
// export default function Filters({ onFilter }) {
//   // --- États des listes ---
//   const [bases,    setBases]    = useState([]);
//   const [articles, setArticles] = useState([]);
//   const [depots,   setDepots]   = useState([]);
//   const [cat1List, setCat1List] = useState([]);
//   const [cat2List, setCat2List] = useState([]);
//   const [cat3List, setCat3List] = useState([]);
//   const [cat4List, setCat4List] = useState([]);

//   // --- États des valeurs sélectionnées ---
//   const [base,      setBase]      = useState('');
//   const [article,   setArticle]   = useState('');
//   const [depot,     setDepot]     = useState('');
//   const [cat1,      setCat1]      = useState('');
//   const [cat2,      setCat2]      = useState('');
//   const [cat3,      setCat3]      = useState('');
//   const [cat4,      setCat4]      = useState('');
//   const [dateDebut, setDateDebut] = useState('');
//   const [dateFin,   setDateFin]   = useState('');

//   // --- Loading ---
//   const [loadingBases,   setLoadingBases]   = useState(true);
//   const [loadingFiltres, setLoadingFiltres] = useState(false);
//   const [isFiltering,    setIsFiltering]    = useState(false);

//   // ── Chargement des bases au montage ─────────────────────────
//   useEffect(() => {
//     fetchBases()
//       .then(data => {
//         setBases(data.map(b => ({ value: b.BaseName, label: b.BaseLabel })));
//       })
//       .catch(console.error)
//       .finally(() => setLoadingBases(false));
//   }, []);

//   // ── Chargement des filtres quand la base ou cat1 change ─────
//   const loadFiltres = useCallback(async (selectedBase, selectedCat1 = null) => {
//     if (!selectedBase) return;
//     setLoadingFiltres(true);
//     try {
//       const data = await fetchFiltres(selectedBase, selectedCat1 || null);
//       setArticles((data.articles || []).map(a => ({ value: a.Code, label: `${a.Code} — ${a.Libelle}` })));
//       setDepots  ((data.depots   || []).map(d => ({ value: d.Code, label: d.Libelle })));
//       setCat1List((data.cat1     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//       setCat2List((data.cat2     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//       setCat3List((data.cat3     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//       setCat4List((data.cat4     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingFiltres(false);
//     }
//   }, []);

//   // Quand la base change
//   const handleBaseChange = (val) => {
//     setBase(val);
//     setArticle(''); setDepot('');
//     setCat1(''); setCat2(''); setCat3(''); setCat4('');
//     setArticles([]); setDepots([]);
//     setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
//     if (val) loadFiltres(val);
//   };

//   // Quand Cat1 change → re-filtrer Cat2, Cat3, Cat4, Articles
//   const handleCat1Change = (val) => {
//     setCat1(val);
//     setCat2(''); setCat3(''); setCat4('');
//     setArticle('');
//     if (base) loadFiltres(base, val || null);
//   };

//   // ── Bouton Filtrer ───────────────────────────────────────────
//   const handleFilter = async () => {
//     if (!base) return;
//     setIsFiltering(true);
//     try {
//       await onFilter({
//         base,
//         dateDebut: dateDebut || null,
//         dateFin:   dateFin   || null,
//         depot:     depot     || null,
//         article:   article   || null,
//         cl_no1:    cat1      || null,
//         cl_no2:    cat2      || null,
//         cl_no3:    cat3      || null,
//         cl_no4:    cat4      || null,
//       });
//     } finally {
//       setIsFiltering(false);
//     }
//   };

//   // ── Bouton Actualiser (réinitialiser) ────────────────────────
//   const handleReset = () => {
//     setBase(''); setArticle(''); setDepot('');
//     setCat1(''); setCat2(''); setCat3(''); setCat4('');
//     setDateDebut(''); setDateFin('');
//     setArticles([]); setDepots([]);
//     setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
//     onFilter(null);
//   };

//   return (
//     <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-5 shadow-xl shadow-black/20">

//       {/* Titre section */}
//       <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
//         <Search size={14} className="text-sky-400" />
//         <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
//           Filtres de recherche
//         </span>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

//         {/* ── Base ── */}
//         <Select
//           label="Base SAGE"
//           icon={Database}
//           value={base}
//           onChange={handleBaseChange}
//           options={bases}
//           placeholder="Sélectionner une base"
//           loading={loadingBases}
//         />

//         {/* ── Catalogue N1 ── */}
//         <Select
//           label="Catalogue Niveau 1"
//           icon={Layers}
//           value={cat1}
//           onChange={handleCat1Change}
//           options={cat1List}
//           placeholder="Tous les catalogues N1"
//           disabled={!base}
//           loading={loadingFiltres && !cat1List.length}
//         />

//         {/* ── Catalogue N2 ── */}
//         <Select
//           label="Catalogue Niveau 2"
//           icon={Layers}
//           value={cat2}
//           onChange={setCat2}
//           options={cat2List}
//           placeholder="Tous les catalogues N2"
//           disabled={!base}
//           loading={loadingFiltres && !cat2List.length}
//         />

//         {/* ── Catalogue N3 ── */}
//         <Select
//           label="Catalogue Niveau 3"
//           icon={Layers}
//           value={cat3}
//           onChange={setCat3}
//           options={cat3List}
//           placeholder="Tous les catalogues N3"
//           disabled={!base}
//           loading={loadingFiltres && !cat3List.length}
//         />

//         {/* ── Catalogue N4 ── */}
//         <Select
//           label="Catalogue Niveau 4"
//           icon={Layers}
//           value={cat4}
//           onChange={setCat4}
//           options={cat4List}
//           placeholder="Tous les catalogues N4"
//           disabled={!base}
//           loading={loadingFiltres && !cat4List.length}
//         />

//         {/* ── Article ── */}
//         <Select
//           label="Article"
//           icon={Package}
//           value={article}
//           onChange={setArticle}
//           options={articles}
//           placeholder="Tous les articles"
//           disabled={!base}
//           loading={loadingFiltres && !articles.length}
//         />

//         {/* ── Dépôt ── */}
//         <Select
//           label="Dépôt"
//           icon={Warehouse}
//           value={depot}
//           onChange={setDepot}
//           options={depots}
//           placeholder="Tous les dépôts"
//           disabled={!base}
//           loading={loadingFiltres && !depots.length}
//         />

//         {/* ── Date début ── */}
//         <DateInput
//           label="Date début"
//           value={dateDebut}
//           onChange={setDateDebut}
//           max={dateFin || undefined}
//         />

//         {/* ── Date fin ── */}
//         <DateInput
//           label="Date fin"
//           value={dateFin}
//           onChange={setDateFin}
//           min={dateDebut || undefined}
//         />
//       </div>

//       {/* ── Boutons ── */}
//       <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
//         <button
//           onClick={handleFilter}
//           disabled={!base || isFiltering}
//           className={`
//             flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
//             transition-all duration-200
//             ${!base || isFiltering
//               ? 'bg-sky-500/10 text-sky-400/30 cursor-not-allowed'
//               : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30'
//             }
//           `}
//         >
//           {isFiltering
//             ? <Loader2 size={15} className="animate-spin" />
//             : <Search size={15} />
//           }
//           {isFiltering ? 'Chargement…' : 'Filtrer'}
//         </button>

//         <button
//           onClick={handleReset}
//           className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
//             bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80
//             border border-white/8 hover:border-white/15 transition-all duration-200"
//         >
//           <RefreshCw size={15} />
//           Actualiser
//         </button>

//         {/* Indicateur base sélectionnée */}
//         {base && (
//           <div className="ml-auto flex items-center gap-2 bg-sky-500/8 border border-sky-500/15 rounded-lg px-3 py-1.5">
//             <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
//             <span className="text-sky-400 text-xs font-medium">{base}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }













// SidebarP.js
// import React, { useState } from 'react';
// import {
//   Menu,
//   X,
//   Bell,
//   UserCircle2,
//   TrendingUp,
//   Moon,
//   Sun,
// } from 'lucide-react';

// export default function SidebarP({ sidebarOpen, onToggleSidebar }) {
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [userOpen, setUserOpen] = useState(false);

//   const now = new Date();
//   const dateStr = now.toLocaleDateString('fr-FR', {
//     weekday: 'long',
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   });

//   return (
//     <header className="flex items-center justify-between px-5 py-3 bg-[#0f1623] border-b border-white/5 sticky top-0 z-20">
      

//       {/* ── Gauche : hamburger + titre ── */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onToggleSidebar}
//           className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
//           title={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
//         >
//           {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
//         </button>

//         <div className="flex items-center gap-2">
//           <TrendingUp size={16} className="text-sky-400" />
//           <span className="text-white font-semibold text-sm tracking-wide">
//             Stock Dashboard
//           </span>
//           <span className="hidden sm:inline text-white/20 text-xs ml-2 font-light">
//             {dateStr}
//           </span>
//         </div>
//       </div>

//       {/* ── Droite : thème + notifs + user ── */}
//       <div className="flex items-center gap-2 relative">

//         {/* Theme Icon */}
//         <button
//           className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
//         >
//           {/* Change juste l'icône selon le thème */}
//           <Moon size={17} />

//           {/* Exemple mode clair */}
//           {/* <Sun size={17} /> */}
//         </button>

//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
//             className="relative w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
//           >
//             <Bell size={17} />
//             {/* Badge */}
//             <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-72 bg-[#1a2235] border border-white/8 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
//               <div className="px-4 py-3 border-b border-white/5">
//                 <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Notifications</p>
//               </div>
//               <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/4 transition-colors">
//                 <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
//                 <div>
//                   <p className="text-white/70 text-xs">Base STE_NGDM synchronisée</p>
//                   <p className="text-white/25 text-[10px] mt-0.5">Il y a 2 min</p>
//                 </div>
//               </div>
//               <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/4 transition-colors">
//                 <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
//                 <div>
//                   <p className="text-white/70 text-xs">Nouveaux mouvements détectés (BIJOU)</p>
//                   <p className="text-white/25 text-[10px] mt-0.5">Il y a 15 min</p>
//                 </div>
//               </div>
//               <div className="px-4 py-2 border-t border-white/5 text-center">
//                 <button className="text-sky-400 text-[11px] hover:text-sky-300 transition-colors">
//                   Voir tout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* User */}
//         <div className="relative">
//           <button
//             onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
//             className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
//           >
//             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
//               AD
//             </div>
//             <span className="hidden sm:inline text-white/50 text-xs">Admin</span>
//           </button>

//           {userOpen && (
//             <div className="absolute right-0 mt-2 w-52 bg-[#1a2235] border border-white/8 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
//               <div className="px-4 py-3 border-b border-white/5">
//                 <p className="text-white/80 text-xs font-medium">Administrateur</p>
//                 <p className="text-white/30 text-[10px]">admin@sage.local</p>
//               </div>
//               <button className="w-full text-left px-4 py-2.5 text-white/50 text-xs hover:text-white/80 hover:bg-white/4 transition-all flex items-center gap-2">
//                 <UserCircle2 size={13} />
//                 Mon profil
//               </button>
//               <button className="w-full text-left px-4 py-2.5 text-red-400/70 text-xs hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center gap-2 border-t border-white/5">
//                 Déconnexion
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }







// Sidebar.js
// import React from 'react';
// import {
//   LayoutDashboard,
//   PackageSearch,
//   ArrowDownUp,
//   BarChart3,
//   Settings,
//   ChevronRight,
//   Boxes,
//   Warehouse,
//   BellRing,
//   BrainCircuit,
//   FileText,
// } from 'lucide-react';

// const NAV_ITEMS = [
//   {
//     label: 'Tableau de bord',
//     icon: LayoutDashboard,
//     active: true,
//   },
//   {
//     label: 'Stock journalier',
//     icon: PackageSearch,
//     active: false,
//   },
//   {
//     label: 'Mouvements',
//     icon: ArrowDownUp,
//     active: false,
//   },
//   {
//     label: 'Articles',
//     icon: Boxes,
//     active: false,
//   },
//   {
//     label: 'Dépôts',
//     icon: Warehouse,
//     active: false,
//   },
//   {
//     label: 'Analyses',
//     icon: BarChart3,
//     active: false,
//   },
//   {
//     label: 'Alertes',
//     icon: BellRing,
//     active: false,
//   },
//   {
//     label: 'AI Prévisions',
//     icon: BrainCircuit,
//     active: false,
//   },
//   {
//     label: 'Rapports',
//     icon: FileText,
//     active: false,
//   },
//   {
//     label: 'Paramètres',
//     icon: Settings,
//     active: false,
//   },
// ];

// export default function Sidebar({ open }) {
//   return (
//     <aside
//       className={`
//         fixed top-0 left-0 h-full z-30
//         flex flex-col
//         bg-[#0f1623] border-r border-white/5
//         transition-all duration-300 ease-in-out
//         ${open ? 'w-60' : 'w-0 overflow-hidden'}
//       `}
//     >
//       {/* ── Logo ── */}
//       <div className="flex flex-col items-center gap-1 px-6 py-5 border-b border-white/5 shrink-0">
//         <img
//           src="/logo.png"
//           alt="StockAnalytics"
//           className="w-50 h-50 object-contain"
//         />
//         <p className="text-white font-semibold text-sm tracking-wide">
//           StockAnalytics
//         </p>
//       </div>

//       {/* ── Navigation ── */}
//       <nav className="flex-1 py-4 overflow-y-auto">
//         <p className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/20">
//           Menu
//         </p>

//         <ul className="space-y-0.5 px-3">
//           {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
//             <li key={label}>
//               <button
//                 className={`
//                   w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
//                   transition-all duration-150 group
//                   ${
//                     active
//                       ? 'bg-sky-500/10 text-sky-400 font-medium'
//                       : 'text-white/40 hover:text-white/80 hover:bg-white/5'
//                   }
//                 `}
//               >
//                 <Icon
//                   size={16}
//                   className={
//                     active
//                       ? 'text-sky-400'
//                       : 'text-white/30 group-hover:text-white/60'
//                   }
//                 />

//                 <span className="flex-1 text-left">{label}</span>

//                 {active && (
//                   <ChevronRight
//                     size={14}
//                     className="text-sky-400/60"
//                   />
//                 )}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* ── Pied de page ── */}
//       <div className="px-5 py-4 border-t border-white/5 shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
//             AD
//           </div>

//           <div className="leading-tight min-w-0">
//             <p className="text-white/70 text-xs font-medium truncate">
//               Administrateur
//             </p>

//             <p className="text-white/25 text-[10px] truncate">
//               admin@sage.local
//             </p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }





// StockTable.js 
// import React, { useMemo, useState, useEffect } from 'react';
// import {
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   PackageX,
//   Download,
//   TrendingUp,
//   TrendingDown,
//   Minus,
// } from 'lucide-react';

// // ── Formatteurs ──────────────────────────────────────────────
// const fmtDate = (d) => {
//   if (!d) return '—';
//   const date = new Date(d);
//   return date.toLocaleDateString('fr-FR', {
//     day: '2-digit', month: '2-digit', year: 'numeric',
//   });
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

// // ── Détecte automatiquement les noms de colonnes réels ───────
// function detectColumns(data) {
//   if (!data || data.length === 0) return {};
//   const keys = Object.keys(data[0]);
//   console.log('📋 Colonnes reçues du backend:', keys);

//   const find = (...variants) =>
//     keys.find(k =>
//       variants.some(v =>
//         k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, '')
//       )
//     ) || null;

//   return {
//     date:       find('Date', 'DateJour', 'datejour'),
//     catN1:      find('CatN1', 'Cat N1', 'CL_Intitule1', 'clintitule1'),
//     depot:      find('Depot', 'DE_No', 'deno'),
//     nomDepot:   find('NomDepot', 'Nom Depot', 'DE_Intitule', 'deintitule'),
//     article:    find('Article', 'AR_Ref', 'arref'),
//     design:     find('Designation', 'AR_Design', 'ardesign', 'Désignation'),
//     entrees:    find('TotalEntrees', 'Total Entrees', 'TotalEntree', 'totalentree'),
//     sorties:    find('TotalSorties', 'Total Sorties', 'TotalSortie', 'totalsortie'),
//     solde:      find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde', 'solde'),
//     stockFinal: find('StockFinal', 'Stock Final', 'stockfinal'),
//   };
// }

// // ── Badge Stock Final ────────────────────────────────────────
// function StockBadge({ value }) {
//   if (value === null || value === undefined || value === '') {
//     return <span className="text-white/20">—</span>;
//   }
//   const v = Number(value);
//   if (isNaN(v)) return <span className="text-white/20">—</span>;
//   if (v > 0) return (
//     <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
//       <TrendingUp size={11} /> {fmtNum(v)}
//     </span>
//   );
//   if (v < 0) return (
//     <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
//       <TrendingDown size={11} /> {fmtNum(v)}
//     </span>
//   );
//   return (
//     <span className="inline-flex items-center gap-1 text-white/30">
//       <Minus size={11} /> 0
//     </span>
//   );
// }

// // ── En-tête triable ───────────────────────────────────────────
// function Th({ label, colKey, sortKey, sortDir, onSort }) {
//   const active = sortKey === colKey;
//   return (
//     <th
//       onClick={() => colKey && onSort(colKey)}
//       className="px-4 py-3 text-left cursor-pointer select-none group whitespace-nowrap"
//     >
//       <div className="flex items-center gap-1.5">
//         <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors
//           ${active ? 'text-sky-400' : 'text-white/30 group-hover:text-white/60'}`}>
//           {label}
//         </span>
//         {colKey && (
//           <span className="text-white/20 group-hover:text-white/40 transition-colors">
//             {active
//               ? (sortDir === 'asc'
//                   ? <ArrowUp size={11} className="text-sky-400" />
//                   : <ArrowDown size={11} className="text-sky-400" />)
//               : <ArrowUpDown size={11} />
//             }
//           </span>
//         )}
//       </div>
//     </th>
//   );
// }

// // ── Export CSV ────────────────────────────────────────────────
// function exportCSV(data, cols) {
//   const headers = [
//     'Date', 'Catalogue N1', 'Dépôt', 'Nom Dépôt',
//     'Article', 'Nom Article', 'Total Entrées', 'Total Sorties',
//     'Solde', 'Stock Final',
//   ];
//   const rows = data.map(r => [
//     fmtDate(r[cols.date]),
//     r[cols.catN1]      ?? '',
//     r[cols.depot]      ?? '',
//     r[cols.nomDepot]   ?? '',
//     r[cols.article]    ?? '',
//     r[cols.design]     ?? '',
//     r[cols.entrees]    ?? 0,
//     r[cols.sorties]    ?? 0,
//     r[cols.solde]      ?? 0,
//     r[cols.stockFinal] ?? 0,
//   ]);
//   const csv = [headers, ...rows]
//     .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
//     .join('\n');
//   const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
//   const url  = URL.createObjectURL(blob);
//   const a    = document.createElement('a');
//   a.href     = url;
//   a.download = `stock_${new Date().toISOString().slice(0, 10)}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// // ── Composant principal ───────────────────────────────────────
// export default function StockTable({ data, loading }) {
//   const [sortKey, setSortKey] = useState(null);
//   const [sortDir, setSortDir] = useState('asc');
//   const [page,    setPage]    = useState(1);
//   const PAGE_SIZE = 50;

//   const cols = useMemo(() => detectColumns(data), [data]);

//   useEffect(() => { setPage(1); }, [data]);

//   // Tri
//   const sorted = useMemo(() => {
//     if (!data || !data.length) return [];
//     if (!sortKey) return data;
//     return [...data].sort((a, b) => {
//       let av = a[sortKey] ?? '';
//       let bv = b[sortKey] ?? '';
//       const na = Number(av), nb = Number(bv);
//       if (!isNaN(na) && !isNaN(nb)) {
//         return sortDir === 'asc' ? na - nb : nb - na;
//       }
//       return sortDir === 'asc'
//         ? String(av).localeCompare(String(bv), 'fr')
//         : String(bv).localeCompare(String(av), 'fr');
//     });
//   }, [data, sortKey, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSort = (key) => {
//     if (!key) return;
//     if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
//     else { setSortKey(key); setSortDir('asc'); }
//     setPage(1);
//   };

//   // ── Loading ───────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="bg-[#131c2e] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
//         <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
//           <div className="h-3 w-40 bg-white/8 rounded animate-pulse" />
//         </div>
//         <div className="p-5 space-y-2">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <div key={i} className="h-10 bg-white/4 rounded-lg animate-pulse"
//               style={{ animationDelay: `${i * 50}ms` }} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ── Vide ──────────────────────────────────────────────────
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-16 text-center shadow-xl shadow-black/20">
//         <PackageX size={36} className="text-white/10 mx-auto mb-3" />
//         <p className="text-white/30 text-sm">
//           Aucun résultat — ajustez vos filtres et cliquez sur Filtrer
//         </p>
//       </div>
//     );
//   }

//   // ── Tableau ───────────────────────────────────────────────
//   return (
//     <div className="bg-[#131c2e] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">

//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-emerald-400" />
//           <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">
//             Résultats
//           </span>
//           <span className="bg-white/8 text-white/50 text-[11px] font-mono px-2 py-0.5 rounded-md">
//             {sorted.length.toLocaleString('fr-FR')} lignes
//           </span>
//         </div>
//         <button
//           onClick={() => exportCSV(sorted, cols)}
//           className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
//             bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70
//             border border-white/8 hover:border-white/15 transition-all"
//         >
//           <Download size={12} />
//           Exporter CSV
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm border-collapse">
//           <thead>
//             <tr className="border-b border-white/5 bg-white/2">
//               <Th label="Date"          colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               {/* <Th label="Catalogue N1"  colKey={cols.catN1}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /> */}
//               <Th label="Catalogue N1"       />
//               <Th label="Dépôt"         colKey={cols.depot}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               {/* <Th label="Nom Dépôt"     colKey={cols.nomDepot}   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /> */}
//               <Th label="Nom Dépôt"      />
//               {/* <Th label="Article"       colKey={cols.article}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /> */}
//               <Th label="Article"   />
//               {/* <Th label="Nom Article"   colKey={cols.design}     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /> */}
//               <Th label="Nom Article"   />
//               <Th label="Total Entrées" colKey={cols.entrees}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Total Sorties" colKey={cols.sorties}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Solde"         colKey={cols.solde}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Stock Final"   colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((row, idx) => {
//               const entrees = Number(row[cols.entrees]    ?? 0);
//               const sorties = Number(row[cols.sorties]    ?? 0);
//               const solde   = Number(row[cols.solde]      ?? 0);
//               const hasMvt  = entrees > 0 || sorties > 0;

//               return (
//                 <tr key={idx}
//                   className={`border-b border-white/3 transition-colors
//                     ${hasMvt ? 'hover:bg-sky-500/4' : 'hover:bg-white/2 opacity-70'}`}
//                 >
//                   {/* Date */}
//                   <td className="px-4 py-3 font-mono text-xs text-white/40 whitespace-nowrap">
//                     {fmtDate(row[cols.date])}
//                   </td>

//                   {/* Catalogue N1 */}
//                   <td className="px-4 py-3">
//                     {row[cols.catN1]
//                       ? <span className="inline-block bg-indigo-500/10 text-indigo-300 text-[11px] px-2 py-0.5 rounded-md border border-indigo-500/15 whitespace-nowrap">
//                           {row[cols.catN1]}
//                         </span>
//                       : <span className="text-white/15">—</span>
//                     }
//                   </td>

//                   {/* Dépôt */}
//                   <td className="px-4 py-3 font-mono text-xs text-white/40">
//                     {row[cols.depot] ?? '—'}
//                   </td>

//                   {/* Nom Dépôt */}
//                   <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">
//                     {row[cols.nomDepot] ?? '—'}
//                   </td>

//                   {/* Article */}
//                   <td className="px-4 py-3 font-mono text-xs text-sky-400/80">
//                     {row[cols.article] ?? '—'}
//                   </td>

//                   {/* Nom Article */}
//                   <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap max-w-[200px] truncate"
//                     title={row[cols.design]}>
//                     {row[cols.design] ?? '—'}
//                   </td>

//                   {/* Total Entrées */}
//                   <td className="px-4 py-3 text-right">
//                     {entrees > 0
//                       ? <span className="text-emerald-400 font-semibold">{fmtNum(entrees)}</span>
//                       : <span className="text-white/15 text-xs">—</span>
//                     }
//                   </td>

//                   {/* Total Sorties */}
//                   <td className="px-4 py-3 text-right">
//                     {sorties > 0
//                       ? <span className="text-amber-400 font-semibold">{fmtNum(sorties)}</span>
//                       : <span className="text-white/15 text-xs">—</span>
//                     }
//                   </td>

//                   {/* Solde (Valeur Finale Permanente) */}
//                   <td className="px-4 py-3 text-right">
//                     <span className={`font-semibold text-sm ${
//                       solde > 0 ? 'text-sky-400' :
//                       solde < 0 ? 'text-red-400' :
//                       'text-white/25'
//                     }`}>
//                       {fmtNum(solde)}
//                     </span>
//                   </td>

//                   {/* Stock Final */}
//                   <td className="px-4 py-3 text-right">
//                     <StockBadge value={row[cols.stockFinal]} />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
//           <span className="text-white/25 text-xs">
//             Page {page} / {totalPages}
//           </span>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10
//                 text-white/40 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed
//                 border border-white/8 transition-all"
//             >
//               ← Préc.
//             </button>

//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
//               if (p < 1 || p > totalPages) return null;
//               return (
//                 <button key={p} onClick={() => setPage(p)}
//                   className={`w-8 h-8 rounded-lg text-xs transition-all border
//                     ${page === p
//                       ? 'bg-sky-500 border-sky-500 text-white font-semibold'
//                       : 'bg-white/4 border-white/8 text-white/40 hover:bg-white/10 hover:text-white/70'
//                     }`}
//                 >
//                   {p}
//                 </button>
//               );
//             })}

//             <button
//               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10
//                 text-white/40 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed
//                 border border-white/8 transition-all"
//             >
//               Suiv. →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// App.js
// import React, { useEffect, useState } from 'react';
// import Sidebar from './components/Sidebar';
// import SidebarP from './components/SidebarP';
// import Filters from './components/Filters';
// import StockTable from './components/StockTable';
// import { fetchStock } from './api/stockApi';

// export default function App() {

//   // ── Sidebar responsive ─────────────────────
//   const [sidebarOpen, setSidebarOpen] = useState(
//     window.innerWidth >= 1024
//   );

//   const [tableData, setTableData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [lastFilters, setLastFilters] = useState(null);

//   // ── Responsive automatique ─────────────────
//   useEffect(() => {

//     const handleResize = () => {

//       if (window.innerWidth < 1024) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(true);
//       }

//     };

//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);

//   }, []);

//   // ── Appelé par Filters quand on clique "Filtrer" ─────────
//   const handleFilter = async (params) => {

//     if (!params) {
//       // Bouton Actualiser → reset
//       setTableData(null);
//       setLastFilters(null);
//       setError(null);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setLastFilters(params);

//     try {

//       const data = await fetchStock(params);
//       setTableData(data);

//     } catch (err) {

//       console.error(err);
//       setError(err.message);
//       setTableData(null);

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0b1120] flex overflow-hidden">

//       {/* ── Sidebar gauche ── */}
//       <Sidebar open={sidebarOpen} />

//       {/* ── Overlay mobile ── */}
//       {sidebarOpen && window.innerWidth < 1024 && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//         />
//       )}

//       {/* ── Contenu principal ── */}
//       <div
//         className="flex-1 flex flex-col min-w-0 transition-all duration-300"
//         style={{
//           marginLeft:
//             sidebarOpen && window.innerWidth >= 1024
//               ? '240px'
//               : '0',
//         }}
//       >

//         {/* ── Topbar ── */}
//         <SidebarP
//           sidebarOpen={sidebarOpen}
//           onToggleSidebar={() => setSidebarOpen(o => !o)}
//         />

//         {/* ── Zone contenu ── */}
//         <main className="flex-1 p-5 space-y-5 overflow-x-hidden">

//           {/* Filtres */}
//           <Filters onFilter={handleFilter} />

//           {/* Erreur */}
//           {error && (
//             <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm flex items-center gap-3">
//               <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Stats rapides */}
//           {tableData && tableData.length > 0 && !loading && (
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

//               {[
//                 {
//                   label: 'Lignes',
//                   value: tableData.length.toLocaleString('fr-FR'),
//                   color: 'text-sky-400',
//                   bg: 'bg-sky-500/8 border-sky-500/15',
//                 },

//                 {
//                   label: 'Total Entrées',
//                   value: tableData
//                     .reduce(
//                       (s, r) =>
//                         s + Number(r['Total Entrees'] ?? 0),
//                       0
//                     )
//                     .toLocaleString('fr-FR'),
//                   color: 'text-emerald-400',
//                   bg: 'bg-emerald-500/8 border-emerald-500/15',
//                 },

//                 {
//                   label: 'Total Sorties',
//                   value: tableData
//                     .reduce(
//                       (s, r) =>
//                         s + Number(r['Total Sorties'] ?? 0),
//                       0
//                     )
//                     .toLocaleString('fr-FR'),
//                   color: 'text-amber-400',
//                   bg: 'bg-amber-500/8 border-amber-500/15',
//                 },

//                 {
//                   label: 'Articles distincts',
//                   value: new Set(
//                     tableData.map(r => r['Article'])
//                   ).size.toLocaleString('fr-FR'),
//                   color: 'text-purple-400',
//                   bg: 'bg-purple-500/8 border-purple-500/15',
//                 },

//               ].map(({ label, value, color, bg }) => (

//                 <div
//                   key={label}
//                   className={`${bg} border rounded-xl px-4 py-3`}
//                 >

//                   <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">
//                     {label}
//                   </p>

//                   <p className={`${color} text-xl font-bold font-mono`}>
//                     {value}
//                   </p>

//                 </div>

//               ))}
//             </div>
//           )}

//           {/* Tableau résultat */}
//           {(loading || tableData !== null) && (
//             <StockTable
//               data={tableData}
//               loading={loading}
//             />
//           )}

//           {/* État initial */}
//           {!loading && tableData === null && !error && (
//             <div className="flex flex-col items-center justify-center py-24 text-center">

//               <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">

//                 <svg
//                   width="28"
//                   height="28"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   className="text-white/15"
//                 >
//                   <circle cx="11" cy="11" r="8" />
//                   <path d="m21 21-4.35-4.35" />
//                 </svg>

//               </div>

//               <p className="text-white/20 text-sm font-medium">
//                 Sélectionnez une base et cliquez sur Filtrer
//               </p>

//               <p className="text-white/10 text-xs mt-1">
//                 Le tableau de stock s'affichera ici
//               </p>

//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }