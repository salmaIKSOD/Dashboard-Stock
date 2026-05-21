// import React, { useMemo, useState, useEffect, useRef } from 'react';
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

// // Stock Final badge 
// function StockBadge({ value }) {
//   if (value === null || value === undefined || value === '') {
//     return <span className="text-[#c5c5c5]">—</span>;
//   }
//   const v = Number(value);
//   if (isNaN(v)) return <span className="text-[#c5c5c5]">—</span>;
//   if (v > 0) return (
//     <span className="inline-flex items-center gap-1 text-[#e08a00] font-semibold">
//       <TrendingUp size={11} /> {fmtNum(v)}
//     </span>
//   );
//   if (v < 0) return (
//     <span className="inline-flex items-center gap-1 text-[#e53935] font-semibold">
//       <TrendingDown size={11} /> {fmtNum(v)}
//     </span>
//   );
//   return (
//     <span className="inline-flex items-center gap-1 text-[#c5c5c5]">
//       <Minus size={11} /> 0
//     </span>
//   );
// }

// function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
//   const active = sortKey === colKey;
//   const isRight = align === 'right';
//   return (
//     <th
//       onClick={() => colKey && onSort(colKey)}
//       className={`
//         px-4 py-3 bg-[#f8f8f8] whitespace-nowrap overflow-hidden
//         ${colKey ? 'cursor-pointer select-none' : 'cursor-default'}
//         ${isRight ? 'text-right' : 'text-left'}
//       `}
//     >
//       <div className={`flex items-center gap-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
//         {colKey && isRight && (
//           <span className={active ? 'text-[#12a6e0]' : 'text-[#c5c5c5]'}>
//             {active
//               ? (sortDir === 'asc'
//                   ? <ArrowUp size={11} className="text-[#12a6e0]" />
//                   : <ArrowDown size={11} className="text-[#12a6e0]" />)
//               : <ArrowUpDown size={11} />
//             }
//           </span>
//         )}
//         <span className={`
//           text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-150
//           ${active ? 'text-[#12a6e0]' : 'text-[#888888]'}
//         `}>
//           {label}
//         </span>
//         {colKey && !isRight && (
//           <span className={active ? 'text-[#12a6e0]' : 'text-[#c5c5c5]'}>
//             {active
//               ? (sortDir === 'asc'
//                   ? <ArrowUp size={11} className="text-[#12a6e0]" />
//                   : <ArrowDown size={11} className="text-[#12a6e0]" />)
//               : <ArrowUpDown size={11} />
//             }
//           </span>
//         )}
//       </div>
//     </th>
//   );
// }

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

// export default function StockTable({ data, loading }) {
//   const [sortKey, setSortKey] = useState(null);
//   const [sortDir, setSortDir] = useState('asc');
//   const [page,    setPage]    = useState(1);
//   const PAGE_SIZE = 50;

//   const tableTopRef = useRef(null);

//   const cols = useMemo(() => detectColumns(data), [data]);

//   useEffect(() => { setPage(1); }, [data]);

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

//   const goToPage = (p, scroll = false) => {
//     setPage(p);
//     if (scroll) {
//       tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   // Loading skeleton
//   if (loading) {
//     return (
//       <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
//         <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-[#12a6e0] animate-pulse" />
//           <div className="h-3 w-40 bg-[#f0f0f0] rounded" />
//         </div>
//         <div className="p-5 flex flex-col gap-2">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-10 bg-[#f8f8f8] rounded-lg"
//               style={{ animationDelay: `${i * 50}ms` }}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Vide
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-white border border-[#e8e8e8] rounded-2xl p-16 text-center shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
//         <PackageX size={36} className="text-[#e0e0e0] mx-auto mb-3" />
//         <p className="text-[#c5c5c5] text-sm">
//           Aucun résultat — ajustez vos filtres et cliquez sur Filtrer
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={tableTopRef}
//       className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
//     >

//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
//           <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
//             Résultats
//           </span>
//           <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
//             {sorted.length.toLocaleString('fr-FR')} lignes
//           </span>
//         </div>
//         <button
//           onClick={() => exportCSV(sorted, cols)}
//           className="
//             flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.75rem]
//             bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer
//             transition-all duration-150
//             hover:bg-[#eaeaea] hover:text-[#0d0c0c]
//           "
//         >
//           <Download size={12} />
//           Exporter CSV
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm border-collapse table-fixed">
//           <colgroup>
//             <col className="w-[100px]" />
//             <col className="w-[120px]" />
//             <col className="w-[70px]" />
//             <col className="w-[130px]" />
//             <col className="w-[100px]" />
//             <col className="w-[180px]" />
//             <col className="w-[110px]" />
//             <col className="w-[110px]" />
//             <col className="w-[110px]" />
//             <col className="w-[110px]" />
//           </colgroup>
//           <thead>
//             <tr className="border-b border-[#f0f0f0]">
//               <Th label="Date"          colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Catalogue N1" />
//               <Th label="Dépôt" />
//               <Th label="Nom Dépôt" />
//               <Th label="Article" />
//               <Th label="Nom Article" />
//               <Th label="Total Entrées" colKey={cols.entrees}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//               <Th label="Total Sorties" colKey={cols.sorties}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//               <Th label="Solde"         colKey={cols.solde}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//               <Th label="Stock Final"   colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((row, idx) => {
//               const entrees = Number(row[cols.entrees]    ?? 0);
//               const sorties = Number(row[cols.sorties]    ?? 0);
//               const solde   = Number(row[cols.solde]      ?? 0);
//               const hasMvt  = entrees > 0 || sorties > 0;

//               return (
//                 <tr
//                   key={idx}
//                   className={`
//                     border-b border-[#f8f8f8] transition-colors duration-100
//                     ${hasMvt ? 'opacity-100 hover:bg-[rgba(18,166,224,0.04)]' : 'opacity-75 hover:bg-[#fafafa]'}
//                   `}
//                 >
//                   {/* Date */}
//                   <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888] whitespace-nowrap">
//                     {fmtDate(row[cols.date])}
//                   </td>

//                   {/* Catalogue N1 */}
//                   <td className="px-4 py-3">
//                     {row[cols.catN1]
//                       ? <span className="
//                           inline-block bg-[rgba(18,166,224,0.08)] text-[#0b7db0]
//                           text-[0.6875rem] px-2 py-0.5 rounded
//                           border border-[rgba(18,166,224,0.18)] whitespace-nowrap
//                         ">
//                           {row[cols.catN1]}
//                         </span>
//                       : <span className="text-[#e0e0e0]">—</span>
//                     }
//                   </td>

//                   {/* Dépôt */}
//                   <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888]">
//                     {row[cols.depot] ?? '—'}
//                   </td>

//                   {/* Nom Dépôt */}
//                   <td className="px-4 py-3 text-[#555555] text-[0.75rem] whitespace-nowrap">
//                     {row[cols.nomDepot] ?? '—'}
//                   </td>

//                   {/* Article */}
//                   <td className="px-4 py-3 font-mono text-[0.75rem] text-[#12a6e0]">
//                     {row[cols.article] ?? '—'}
//                   </td>

//                   {/* Nom Article */}
//                   <td
//                     className="px-4 py-3 text-[#444444] text-[0.75rem] whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
//                     title={row[cols.design]}
//                   >
//                     {row[cols.design] ?? '—'}
//                   </td>

//                   {/* Total Entrées */}
//                   <td className="px-4 py-3 text-right">
//                     {entrees > 0
//                       ? <span className="text-[#01a82e] font-semibold">{fmtNum(entrees)}</span>
//                       : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
//                     }
//                   </td>

//                   {/* Total Sorties */}
//                   <td className="px-4 py-3 text-right">
//                     {sorties > 0
//                       ? <span className="text-[#e53935] font-semibold">{fmtNum(sorties)}</span>
//                       : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
//                     }
//                   </td>

//                   {/* Solde */}
//                   <td className="px-4 py-3 text-right">
//                     <span className={`
//                       font-semibold text-[0.875rem]
//                       ${solde > 0 ? 'text-[#12a6e0]' : solde < 0 ? 'text-[#e53935]' : 'text-[#c5c5c5]'}
//                     `}>
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
//         <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
//           <span className="text-[#c5c5c5] text-[0.75rem]">
//             Page {page} / {totalPages}
//           </span>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => goToPage(Math.max(1, page - 1))}
//               disabled={page === 1}
//               className={`
//                 px-3 py-1.5 rounded-lg text-[0.75rem]
//                 bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0]
//                 transition-all duration-150
//                 hover:bg-[#eaeaea] hover:text-[#0d0c0c]
//                 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f5] disabled:hover:text-[#666666]
//               `}
//             >
//               ← Préc.
//             </button>

//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
//               if (p < 1 || p > totalPages) return null;
//               return (
//                 <button
//                   key={p}
//                   onClick={() => goToPage(p, true)}
//                   className={`
//                     w-8 h-8 rounded-lg text-[0.75rem] cursor-pointer transition-all duration-150
//                     ${page === p
//                       ? 'bg-[#12a6e0] text-white font-semibold border-0'
//                       : 'bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] font-normal hover:bg-[#eaeaea] hover:text-[#0d0c0c]'
//                     }
//                   `}
//                 >
//                   {p}
//                 </button>
//               );
//             })}

//             <button
//               onClick={() => goToPage(Math.min(totalPages, page + 1))}
//               disabled={page === totalPages}
//               className={`
//                 px-3 py-1.5 rounded-lg text-[0.75rem]
//                 bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0]
//                 transition-all duration-150
//                 hover:bg-[#eaeaea] hover:text-[#0d0c0c]
//                 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f5] disabled:hover:text-[#666666]
//               `}
//             >
//               Suiv. →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PackageX,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
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

function detectColumns(data) {
  if (!data || data.length === 0) return {};
  const keys = Object.keys(data[0]);
  console.log('📋 Colonnes reçues du backend:', keys);

  const find = (...variants) =>
    keys.find(k =>
      variants.some(v =>
        k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, '')
      )
    ) || null;

  return {
    date:       find('Date', 'DateJour', 'datejour'),
    catN1:      find('CatN1', 'Cat N1', 'CL_Intitule1', 'clintitule1'),
    depot:      find('Depot', 'DE_No', 'deno'),
    nomDepot:   find('NomDepot', 'Nom Depot', 'DE_Intitule', 'deintitule'),
    article:    find('Article', 'AR_Ref', 'arref'),
    design:     find('Designation', 'AR_Design', 'ardesign', 'Désignation'),
    entrees:    find('TotalEntrees', 'Total Entrees', 'TotalEntree', 'totalentree'),
    sorties:    find('TotalSorties', 'Total Sorties', 'TotalSortie', 'totalsortie'),
    solde:      find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde', 'solde'),
    stockFinal: find('StockFinal', 'Stock Final', 'stockfinal'),
  };
}

// Stock Final badge
function StockBadge({ value }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-[#c5c5c5]">—</span>;
  }
  const v = Number(value);
  if (isNaN(v)) return <span className="text-[#c5c5c5]">—</span>;
  if (v > 0) return (
    <span className="inline-flex items-center gap-1 text-[#e08a00] font-semibold">
      <TrendingUp size={11} /> {fmtNum(v)}
    </span>
  );
  if (v < 0) return (
    <span className="inline-flex items-center gap-1 text-[#e53935] font-semibold">
      <TrendingDown size={11} /> {fmtNum(v)}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[#c5c5c5]">
      <Minus size={11} /> 0
    </span>
  );
}

// ─── Th corrigé ───────────────────────────────────────────────────────────────
// - Une seule icône (SortIcon) définie une fois, pas de duplication
// - isRight → icône AVANT le label ; sinon icône APRÈS le label
// - Les deux blocs sont mutuellement exclusifs → plus de double-rendu
function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
  const active  = sortKey === colKey;
  const isRight = align === 'right';

  const SortIcon = () => {
    if (!colKey) return null;
    if (active) {
      return sortDir === 'asc'
        ? <ArrowUp   size={11} className="text-[#12a6e0]" />
        : <ArrowDown size={11} className="text-[#12a6e0]" />;
    }
    return <ArrowUpDown size={11} className="text-[#c5c5c5]" />;
  };

  return (
    <th
      onClick={() => colKey && onSort(colKey)}
      className={`
        px-4 py-3 bg-[#f8f8f8] whitespace-nowrap overflow-hidden
        ${colKey ? 'cursor-pointer select-none' : 'cursor-default'}
        ${isRight ? 'text-right' : 'text-left'}
      `}
    >
      <div className={`flex items-center gap-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
        {isRight  && <SortIcon />}
        <span className={`
          text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-150
          ${active ? 'text-[#12a6e0]' : 'text-[#888888]'}
        `}>
          {label}
        </span>
        {!isRight && <SortIcon />}
      </div>
    </th>
  );
}
// ──────────────────────────────────────────────────────────────────────────────

function exportCSV(data, cols) {
  const headers = [
    'Date', 'Catalogue N1', 'Dépôt', 'Nom Dépôt',
    'Article', 'Nom Article', 'Total Entrées', 'Total Sorties',
    'Solde', 'Stock Final',
  ];
  const rows = data.map(r => [
    fmtDate(r[cols.date]),
    r[cols.catN1]      ?? '',
    r[cols.depot]      ?? '',
    r[cols.nomDepot]   ?? '',
    r[cols.article]    ?? '',
    r[cols.design]     ?? '',
    r[cols.entrees]    ?? 0,
    r[cols.sorties]    ?? 0,
    r[cols.solde]      ?? 0,
    r[cols.stockFinal] ?? 0,
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `stock_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StockTable({ data, loading }) {
  // sortDir a 3 états : 'asc' → 'desc' → null (reset)
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [page,    setPage]    = useState(1);
  const PAGE_SIZE = 50;

  const tableTopRef = useRef(null);
  const cols = useMemo(() => detectColumns(data), [data]);

  useEffect(() => { setPage(1); }, [data]);

  const sorted = useMemo(() => {
    if (!data || !data.length) return [];
    // Si pas de tri actif, on retourne l'ordre original
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      let av = a[sortKey] ?? '';
      let bv = b[sortKey] ?? '';
      const na = Number(av), nb = Number(bv);
      if (!isNaN(na) && !isNaN(nb)) {
        return sortDir === 'asc' ? na - nb : nb - na;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'fr')
        : String(bv).localeCompare(String(av), 'fr');
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ─── Logique de tri : 3 clics pour revenir à l'état initial ────────────────
  // 1er clic  → asc
  // 2e  clic  → desc
  // 3e  clic  → reset (sortKey = null, sortDir = null = ordre original)
  const handleSort = (key) => {
    if (!key) return;
    if (sortKey !== key) {
      // Nouvelle colonne → commence en asc
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      // 3e clic → reset complet
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  };
  // ──────────────────────────────────────────────────────────────────────────

  const goToPage = (p, scroll = false) => {
    setPage(p);
    if (scroll) {
      tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#12a6e0] animate-pulse" />
          <div className="h-3 w-40 bg-[#f0f0f0] rounded" />
        </div>
        <div className="p-5 flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-[#f8f8f8] rounded-lg"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Vide
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e8e8e8] rounded-2xl p-16 text-center shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
        <PackageX size={36} className="text-[#e0e0e0] mx-auto mb-3" />
        <p className="text-[#c5c5c5] text-sm">
          Aucun résultat — ajustez vos filtres et cliquez sur Filtrer
        </p>
      </div>
    );
  }

  return (
    <div
      ref={tableTopRef}
      className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
          <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
            Résultats
          </span>
          <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
            {sorted.length.toLocaleString('fr-FR')} lignes
          </span>
        </div>
        <button
          onClick={() => exportCSV(sorted, cols)}
          className="
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.75rem]
            bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer
            transition-all duration-150
            hover:bg-[#eaeaea] hover:text-[#0d0c0c]
          "
        >
          <Download size={12} />
          Exporter CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse table-fixed">
          <colgroup>
            <col className="w-[100px]" />
            <col className="w-[120px]" />
            <col className="w-[70px]" />
            <col className="w-[130px]" />
            <col className="w-[100px]" />
            <col className="w-[180px]" />
            <col className="w-[110px]" />
            <col className="w-[110px]" />
            <col className="w-[110px]" />
            <col className="w-[110px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#f0f0f0]">
              <Th label="Date"          colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th label="Catalogue N1" />
              <Th label="Dépôt" />
              <Th label="Nom Dépôt" />
              <Th label="Article" />
              <Th label="Nom Article" />
              <Th label="Total Entrées" colKey={cols.entrees}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th label="Total Sorties" colKey={cols.sorties}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th label="Solde"         colKey={cols.solde}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th label="Stock Final"   colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => {
              const entrees = Number(row[cols.entrees]    ?? 0);
              const sorties = Number(row[cols.sorties]    ?? 0);
              const solde   = Number(row[cols.solde]      ?? 0);
              const hasMvt  = entrees > 0 || sorties > 0;

              return (
                <tr
                  key={idx}
                  className={`
                    border-b border-[#f8f8f8] transition-colors duration-100
                    ${hasMvt ? 'opacity-100 hover:bg-[rgba(18,166,224,0.04)]' : 'opacity-75 hover:bg-[#fafafa]'}
                  `}
                >
                  {/* Date */}
                  <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888] whitespace-nowrap">
                    {fmtDate(row[cols.date])}
                  </td>

                  {/* Catalogue N1 */}
                  <td className="px-4 py-3">
                    {row[cols.catN1]
                      ? <span className="
                          inline-block bg-[rgba(18,166,224,0.08)] text-[#0b7db0]
                          text-[0.6875rem] px-2 py-0.5 rounded
                          border border-[rgba(18,166,224,0.18)] whitespace-nowrap
                        ">
                          {row[cols.catN1]}
                        </span>
                      : <span className="text-[#e0e0e0]">—</span>
                    }
                  </td>

                  {/* Dépôt */}
                  <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888]">
                    {row[cols.depot] ?? '—'}
                  </td>

                  {/* Nom Dépôt */}
                  <td className="px-4 py-3 text-[#555555] text-[0.75rem] whitespace-nowrap">
                    {row[cols.nomDepot] ?? '—'}
                  </td>

                  {/* Article */}
                  <td className="px-4 py-3 font-mono text-[0.75rem] text-[#12a6e0]">
                    {row[cols.article] ?? '—'}
                  </td>

                  {/* Nom Article */}
                  <td
                    className="px-4 py-3 text-[#444444] text-[0.75rem] whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                    title={row[cols.design]}
                  >
                    {row[cols.design] ?? '—'}
                  </td>

                  {/* Total Entrées */}
                  <td className="px-4 py-3 text-right">
                    {entrees > 0
                      ? <span className="text-[#01a82e] font-semibold">{fmtNum(entrees)}</span>
                      : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                    }
                  </td>

                  {/* Total Sorties */}
                  <td className="px-4 py-3 text-right">
                    {sorties > 0
                      ? <span className="text-[#e53935] font-semibold">{fmtNum(sorties)}</span>
                      : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>
                    }
                  </td>

                  {/* Solde */}
                  <td className="px-4 py-3 text-right">
                    <span className={`
                      font-semibold text-[0.875rem]
                      ${solde > 0 ? 'text-[#12a6e0]' : solde < 0 ? 'text-[#e53935]' : 'text-[#c5c5c5]'}
                    `}>
                      {fmtNum(solde)}
                    </span>
                  </td>

                  {/* Stock Final */}
                  <td className="px-4 py-3 text-right">
                    <StockBadge value={row[cols.stockFinal]} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
          <span className="text-[#c5c5c5] text-[0.75rem]">
            Page {page} / {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`
                px-3 py-1.5 rounded-lg text-[0.75rem]
                bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0]
                transition-all duration-150
                hover:bg-[#eaeaea] hover:text-[#0d0c0c]
                disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f5] disabled:hover:text-[#666666]
              `}
            >
              ← Préc.
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p, true)}
                  className={`
                    w-8 h-8 rounded-lg text-[0.75rem] cursor-pointer transition-all duration-150
                    ${page === p
                      ? 'bg-[#12a6e0] text-white font-semibold border-0'
                      : 'bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] font-normal hover:bg-[#eaeaea] hover:text-[#0d0c0c]'
                    }
                  `}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`
                px-3 py-1.5 rounded-lg text-[0.75rem]
                bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0]
                transition-all duration-150
                hover:bg-[#eaeaea] hover:text-[#0d0c0c]
                disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#f5f5f5] disabled:hover:text-[#666666]
              `}
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}