// import React, { useMemo, useState, useEffect, useRef } from 'react';
// import {
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   PackageX,
//   TrendingUp,
//   TrendingDown,
//   Minus,
// } from 'lucide-react';
// import ExcelJS from 'exceljs';

// /* ══════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */
// const fmtDate = (d) => {
//   if (!d) return '—';
//   const date = new Date(d);
//   return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
// };

// const fmtDateExcel = (d) => {
//   if (!d) return '';
//   const date = new Date(d);
//   return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
// };

// const fmtNum = (n) => {
//   if (n === null || n === undefined || n === '') return '—';
//   const num = Number(n);
//   if (isNaN(num)) return '—';
//   return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);
// };

// const MONTH_NAMES = [
//   'Janvier','Février','Mars','Avril','Mai','Juin',
//   'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
// ];

// /* ══════════════════════════════════════════════════════════════
//    DETECT COLUMNS
// ══════════════════════════════════════════════════════════════ */
// function detectColumns(data) {
//   if (!data || data.length === 0) return {};
//   const keys = Object.keys(data[0]);
//   const find = (...variants) =>
//     keys.find(k =>
//       variants.some(v => k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, ''))
//     ) || null;
//   return {
//     date:       find('Date', 'DateJour', 'datejour'),
//     catN1:      find('CatN1', 'Cat N1', 'CL_Intitule1', 'clintitule1'),
//     nomDepot:   find('NomDepot', 'Nom Depot', 'DE_Intitule', 'deintitule'),
//     article:    find('Article', 'AR_Ref', 'arref'),
//     design:     find('Designation', 'AR_Design', 'ardesign', 'Désignation'),
//     entrees:    find('TotalEntrees', 'Total Entrees', 'TotalEntree', 'totalentree'),
//     sorties:    find('TotalSorties', 'Total Sorties', 'TotalSortie', 'totalsortie'),
//     solde:      find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde', 'solde'),
//     stockFinal: find('StockFinal', 'Stock Final', 'stockfinal'),
//   };
// }

// /* ══════════════════════════════════════════════════════════════
//    EXCEL EXPORT
// ══════════════════════════════════════════════════════════════ */
// const C = {
//   headerBg:    'FF0D8FC4', headerFont:  'FFFFFFFF',
//   subHeaderBg: 'FFE8F6FD',
//   articleBg:   'FFDFF2FB', articleFont: 'FF0B5E7F',
//   subtotalBg:  'FFCCE8F6', subtotalFont:'FF065070',
//   totalBg:     'FF0D8FC4', totalFont:   'FFFFFFFF',
//   green:       'FF01773D', greenBg:     'FFE6F9EF',
//   red:         'FFB71C1C', redBg:       'FFFDE8E8',
//   blue:        'FF0B7DB0', blueBg:      'FFE8F6FD',
//   amber:       'FFC47A00', amberBg:     'FFFFF3CD',
//   gray:        'FF888888', border:      'FFD0E8F5',
//   altRow:      'FFF7FBFF', white:       'FFFFFFFF',
// };

// const xlBorder  = (color = C.border) => ({
//   top:    { style: 'thin',   color: { argb: color } },
//   left:   { style: 'thin',   color: { argb: color } },
//   bottom: { style: 'thin',   color: { argb: color } },
//   right:  { style: 'thin',   color: { argb: color } },
// });
// const xlBorderM = (color = 'FF0A7BAE') => ({
//   top:    { style: 'medium', color: { argb: color } },
//   left:   { style: 'medium', color: { argb: color } },
//   bottom: { style: 'medium', color: { argb: color } },
//   right:  { style: 'medium', color: { argb: color } },
// });
// const xlFill  = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
// const xlFont  = (argb, bold = false, size = 10) => ({ name: 'Arial', size, bold, color: { argb } });
// const xlAlign = (h = 'left', v = 'middle') => ({ horizontal: h, vertical: v });

// function buildSheet(wb, sheetName, rows, cols) {
//   const ws = wb.addWorksheet(sheetName, {
//     pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
//     views: [{ state: 'frozen', ySplit: 2 }],
//   });

//   const COL_COUNT = 9;
//   ws.columns = [
//     { key: 'date',     width: 13 },
//     { key: 'catN1',    width: 22 },
//     { key: 'depot',    width: 24 },
//     { key: 'article',  width: 16 },
//     { key: 'design',   width: 40 },
//     { key: 'entrees',  width: 16 },
//     { key: 'sorties',  width: 16 },
//     { key: 'solde',    width: 16 },
//     { key: 'stockFin', width: 16 },
//   ];

//   /* ── Ligne 1 : titre ── */
//   ws.mergeCells(1, 1, 1, COL_COUNT);
//   const titleCell     = ws.getCell(1, 1);
//   titleCell.value     = `Mouvements de stock — ${sheetName}`;
//   titleCell.font      = xlFont(C.headerFont, true, 13);
//   titleCell.fill      = xlFill(C.headerBg);
//   titleCell.alignment = xlAlign('center');
//   titleCell.border    = xlBorderM();
//   ws.getRow(1).height = 28;

//   /* ── Ligne 2 : en-têtes ── */
//   const headers = ['Date','Catalogue N1','Dépôt','Article','Désignation','Entrées','Sorties','Solde','Stock Final'];
//   headers.forEach((h, i) => {
//     const cell     = ws.getCell(2, i + 1);
//     cell.value     = h;
//     cell.font      = xlFont('FF0D0C0C', true, 9);
//     cell.fill      = xlFill(C.subHeaderBg);
//     cell.alignment = xlAlign(i >= 5 ? 'right' : 'left');
//     cell.border    = xlBorder();
//   });
//   ws.getRow(2).height = 20;

//   /* ── Regrouper par article ── */
//   const byArticle = {};
//   rows.forEach(row => {
//     const code = row[cols.article] ?? '(sans code)';
//     if (!byArticle[code]) byArticle[code] = [];
//     byArticle[code].push(row);
//   });

//   let currentRow      = 3;
//   let grandEntrees    = 0;
//   let grandSorties    = 0;
//   let grandStockFinal = 0;

//   Object.entries(byArticle).forEach(([artCode, artRows]) => {
//     artRows.sort((a, b) => new Date(a[cols.date]) - new Date(b[cols.date]));
//     const design = artRows[0][cols.design] ?? '';

//     /* ── Bandeau article ── */
//     ws.mergeCells(currentRow, 1, currentRow, COL_COUNT);
//     const artCell     = ws.getCell(currentRow, 1);
//     artCell.value     = `  ${artCode}  —  ${design}`;
//     artCell.font      = xlFont(C.articleFont, true, 10);
//     artCell.fill      = xlFill(C.articleBg);
//     artCell.alignment = xlAlign('left');
//     artCell.border    = xlBorder('FF8CC8E8');
//     ws.getRow(currentRow).height = 18;
//     currentRow++;

//     /* ── Stock final par dépôt ── */
//     const byDepot = {};
//     artRows.forEach(row => {
//       const dk = String(row['Depot'] ?? row[cols.nomDepot] ?? '(sans dépôt)');
//       if (!byDepot[dk]) byDepot[dk] = [];
//       byDepot[dk].push(row);
//     });
//     let artStockFinalTotal = 0;
//     Object.values(byDepot).forEach(dr => {
//       const sorted = [...dr].sort((a, b) => new Date(b[cols.date]) - new Date(a[cols.date]));
//       for (const r of sorted) {
//         if (r[cols.stockFinal] !== undefined && r[cols.stockFinal] !== null) {
//           artStockFinalTotal += Number(r[cols.stockFinal]);
//           break;
//         }
//       }
//     });

//     /* ── Lignes de détail ── */
//     let artEntrees = 0;
//     let artSorties = 0;

//     artRows.forEach((row, rowIdx) => {
//       const entrees  = Number(row[cols.entrees]  ?? 0);
//       const sorties  = Number(row[cols.sorties]  ?? 0);
//       const solde    = Number(row[cols.solde]    ?? 0);
//       const stockFin = (row[cols.stockFinal] !== undefined && row[cols.stockFinal] !== null)
//         ? Number(row[cols.stockFinal]) : null;

//       artEntrees += entrees;
//       artSorties += sorties;

//       const rowFill = rowIdx % 2 === 1 ? xlFill(C.altRow) : xlFill(C.white);
//       const set = (col, value, fnt, aln, numFmt, customFill) => {
//         const cell     = ws.getCell(currentRow, col);
//         cell.value     = value;
//         cell.fill      = customFill || rowFill;
//         cell.font      = fnt  || xlFont('FF333333', false, 9);
//         cell.alignment = aln  || xlAlign('left');
//         cell.border    = xlBorder();
//         if (numFmt) cell.numFmt = numFmt;
//       };

//       set(1, fmtDateExcel(row[cols.date]), xlFont(C.gray, false, 9), xlAlign('center'));
//       set(2, row[cols.catN1]    ?? '');
//       set(3, row[cols.nomDepot] ?? '');
//       set(4, row[cols.article]  ?? '', xlFont(C.blue, false, 9), xlAlign('center'));
//       set(5, row[cols.design]   ?? '');

//       if (entrees > 0) {
//         set(6, entrees, xlFont(C.green, true, 9), xlAlign('right'), '#,##0.##', xlFill(C.greenBg));
//       } else {
//         set(6, '—', xlFont('FFDDDDDD', false, 9), xlAlign('right'));
//       }
//       if (sorties > 0) {
//         set(7, sorties, xlFont(C.red, true, 9), xlAlign('right'), '#,##0.##', xlFill(C.redBg));
//       } else {
//         set(7, '—', xlFont('FFDDDDDD', false, 9), xlAlign('right'));
//       }

//       const soldeFill = solde > 0 ? xlFill(C.blueBg) : solde < 0 ? xlFill(C.redBg) : rowFill;
//       const soldeFont = solde > 0 ? xlFont(C.blue, true, 9) : solde < 0 ? xlFont(C.red, true, 9) : xlFont('FFDDDDDD', false, 9);
//       set(8, solde !== 0 ? solde : '—', soldeFont, xlAlign('right'), '#,##0.##', soldeFill);

//       if (stockFin !== null) {
//         const sf = stockFin > 0 ? xlFill(C.amberBg) : stockFin < 0 ? xlFill(C.redBg) : rowFill;
//         const ff = stockFin > 0 ? xlFont(C.amber, true, 9) : stockFin < 0 ? xlFont(C.red, true, 9) : xlFont(C.gray, false, 9);
//         set(9, stockFin, ff, xlAlign('right'), '#,##0.##', sf);
//       } else {
//         set(9, '—', xlFont('FFDDDDDD', false, 9), xlAlign('right'));
//       }

//       currentRow++;
//     });

//     /* ══════════════════════════════════════════════════════════
//        LIGNE SOUS-TOTAL — cols 1-5 fusionnées ← FIX
//     ══════════════════════════════════════════════════════════ */
//     grandEntrees    += artEntrees;
//     grandSorties    += artSorties;
//     grandStockFinal += artStockFinalTotal;

//     // Fusion cols 1-5 : le texte a toute la largeur disponible
//     ws.mergeCells(currentRow, 1, currentRow, 5);
//     const stLabel     = ws.getCell(currentRow, 1);
//     stLabel.value     = `▶  Sous-total : ${artCode} — ${design}`;
//     stLabel.font      = xlFont(C.subtotalFont, true, 10);
//     stLabel.fill      = xlFill(C.subtotalBg);
//     stLabel.alignment = xlAlign('left');
//     stLabel.border    = xlBorderM('FF8CC8E8');

//     // Col 6 : entrées
//     const stE     = ws.getCell(currentRow, 6);
//     stE.value     = artEntrees;
//     stE.fill      = xlFill(C.subtotalBg);
//     stE.font      = xlFont(C.green, true, 9);
//     stE.alignment = xlAlign('right');
//     stE.numFmt    = '#,##0.##';
//     stE.border    = xlBorderM('FF8CC8E8');

//     // Col 7 : sorties
//     const stS     = ws.getCell(currentRow, 7);
//     stS.value     = artSorties;
//     stS.fill      = xlFill(C.subtotalBg);
//     stS.font      = xlFont(C.red, true, 9);
//     stS.alignment = xlAlign('right');
//     stS.numFmt    = '#,##0.##';
//     stS.border    = xlBorderM('FF8CC8E8');

//     // Col 8 : vide
//     const stSolde  = ws.getCell(currentRow, 8);
//     stSolde.value  = '';
//     stSolde.fill   = xlFill(C.subtotalBg);
//     stSolde.border = xlBorderM('FF8CC8E8');

//     // Col 9 : stock final
//     const stSF     = ws.getCell(currentRow, 9);
//     stSF.value     = artStockFinalTotal;
//     stSF.fill      = xlFill(C.subtotalBg);
//     stSF.font      = xlFont(C.amber, true, 9);
//     stSF.alignment = xlAlign('right');
//     stSF.numFmt    = '#,##0.##';
//     stSF.border    = xlBorderM('FF8CC8E8');

//     ws.getRow(currentRow).height = 22;
//     currentRow++;

//     /* séparation */
//     currentRow++;
//   });

//   /* ══════════════════════════════════════════════════════════
//      LIGNE GRAND TOTAL — cols 1-5 fusionnées ← FIX
//   ══════════════════════════════════════════════════════════ */

//   // Fusion cols 1-5 : le texte a toute la largeur disponible
//   ws.mergeCells(currentRow, 1, currentRow, 5);
//   const gtLabel     = ws.getCell(currentRow, 1);
//   gtLabel.value     = '◆  GRAND TOTAL — Total général';
//   gtLabel.font      = xlFont(C.totalFont, true, 11);
//   gtLabel.fill      = xlFill(C.totalBg);
//   gtLabel.alignment = xlAlign('left');
//   gtLabel.border    = xlBorderM();

//   // Col 6 : total entrées
//   const gtE     = ws.getCell(currentRow, 6);
//   gtE.value     = grandEntrees;
//   gtE.fill      = xlFill(C.totalBg);
//   gtE.font      = xlFont('FF90EEB8', true, 11);
//   gtE.alignment = xlAlign('right');
//   gtE.numFmt    = '#,##0.##';
//   gtE.border    = xlBorderM();

//   // Col 7 : total sorties
//   const gtS     = ws.getCell(currentRow, 7);
//   gtS.value     = grandSorties;
//   gtS.fill      = xlFill(C.totalBg);
//   gtS.font      = xlFont('FFFFAAAA', true, 11);
//   gtS.alignment = xlAlign('right');
//   gtS.numFmt    = '#,##0.##';
//   gtS.border    = xlBorderM();

//   // Col 8 : vide
//   const gtSolde  = ws.getCell(currentRow, 8);
//   gtSolde.value  = '';
//   gtSolde.fill   = xlFill(C.totalBg);
//   gtSolde.border = xlBorderM();

//   // Col 9 : total stock final
//   const gtSF     = ws.getCell(currentRow, 9);
//   gtSF.value     = grandStockFinal;
//   gtSF.fill      = xlFill(C.totalBg);
//   gtSF.font      = xlFont('FFFFFFAA', true, 11);
//   gtSF.alignment = xlAlign('right');
//   gtSF.numFmt    = '#,##0.##';
//   gtSF.border    = xlBorderM();

//   ws.getRow(currentRow).height = 26;

//   ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: COL_COUNT } };
// }

// async function exportExcel(data, cols, dateDebut, dateFin) {
//   if (!data || data.length === 0) return;
//   const wb = new ExcelJS.Workbook();
//   wb.creator = 'Stock Dashboard';
//   wb.created = new Date();

//   const byMonth = {};
//   data.forEach(row => {
//     const raw = row[cols.date];
//     if (!raw) return;
//     const d = new Date(raw);
//     if (isNaN(d)) return;
//     const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
//     if (!byMonth[key]) byMonth[key] = [];
//     byMonth[key].push(row);
//   });

//   const monthKeys = Object.keys(byMonth).sort();
//   if (monthKeys.length === 0) {
//     buildSheet(wb, 'Données', data, cols);
//   } else {
//     monthKeys.forEach(key => {
//       const [year, month] = key.split('-').map(Number);
//       buildSheet(wb, `${MONTH_NAMES[month - 1]} ${year}`, byMonth[key], cols);
//     });
//   }

//   const buffer = await wb.xlsx.writeBuffer();
//   const blob   = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   const url    = URL.createObjectURL(blob);
//   const a      = document.createElement('a');
//   const suffix = dateDebut && dateFin ? `${dateDebut}_au_${dateFin}` : new Date().toISOString().slice(0, 10);
//   a.href = url; a.download = `stock_${suffix}.xlsx`; a.click();
//   URL.revokeObjectURL(url);
// }

// /* ══════════════════════════════════════════════════════════════
//    COMPOSANTS UI
// ══════════════════════════════════════════════════════════════ */
// function StockBadge({ value }) {
//   if (value === null || value === undefined || value === '') return <span className="text-[#c5c5c5]">—</span>;
//   const v = Number(value);
//   if (isNaN(v)) return <span className="text-[#c5c5c5]">—</span>;
//   if (v > 0) return (
//     <span className="inline-flex items-center gap-1 text-[#c47a00] font-semibold text-[0.8rem] bg-[rgba(224,138,0,0.08)] border border-[rgba(224,138,0,0.2)] rounded-md px-2 py-0.5">
//       <TrendingUp size={11} /> {fmtNum(v)}
//     </span>
//   );
//   if (v < 0) return (
//     <span className="inline-flex items-center gap-1 text-[#b71c1c] font-semibold text-[0.8rem] bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-md px-2 py-0.5">
//       <TrendingDown size={11} /> {fmtNum(v)}
//     </span>
//   );
//   return (
//     <span className="inline-flex items-center gap-1 text-[#c5c5c5] text-[0.75rem] bg-[#fafafa] border border-[#eeeeee] rounded-md px-2 py-0.5">
//       <Minus size={10} /> 0
//     </span>
//   );
// }

// function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
//   const active  = sortKey === colKey;
//   const isRight = align === 'right';
//   const SortIcon = () => {
//     if (!colKey) return null;
//     if (active) return sortDir === 'asc'
//       ? <ArrowUp   size={13} className="text-[#12a6e0] shrink-0" />
//       : <ArrowDown size={13} className="text-[#12a6e0] shrink-0" />;
//     return <ArrowUpDown size={13} className="text-[#c5c5c5] shrink-0" />;
//   };
//   return (
//     <th onClick={() => colKey && onSort(colKey)}
//       className={`px-4 py-3 bg-[#f8f8f8] whitespace-nowrap overflow-hidden ${colKey ? 'cursor-pointer select-none' : 'cursor-default'} ${isRight ? 'text-right' : 'text-left'}`}>
//       <div className={`flex items-center gap-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
//         <span className={`text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 ${active ? 'text-[#12a6e0]' : 'text-[#888888]'}`}>
//           {label}
//         </span>
//         <SortIcon />
//       </div>
//     </th>
//   );
// }

// /* ══════════════════════════════════════════════════════════════
//    COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════ */
// export default function StockTable({ data, loading, dateDebut, dateFin }) {
//   const [sortKey, setSortKey] = useState(null);
//   const [sortDir, setSortDir] = useState(null);
//   const [page,    setPage]    = useState(1);
//   const PAGE_SIZE = 31;

//   const tableTopRef = useRef(null);
//   const cols = useMemo(() => detectColumns(data), [data]);
//   useEffect(() => { setPage(1); }, [data]);

//   const sorted = useMemo(() => {
//     if (!data || !data.length) return [];
//     if (!sortKey || !sortDir) return data;
//     return [...data].sort((a, b) => {
//       let av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
//       const na = Number(av), nb = Number(bv);
//       if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
//       return sortDir === 'asc'
//         ? String(av).localeCompare(String(bv), 'fr')
//         : String(bv).localeCompare(String(av), 'fr');
//     });
//   }, [data, sortKey, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSort = (key) => {
//     if (!key) return;
//     if (sortKey !== key) { setSortKey(key); setSortDir('asc'); }
//     else if (sortDir === 'asc') setSortDir('desc');
//     else { setSortKey(null); setSortDir(null); }
//     setPage(1);
//   };

//   const goToPage = (p, scroll = false) => {
//     setPage(p);
//     if (scroll) tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   if (loading) return (
//     <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
//       <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center gap-3">
//         <div className="w-2 h-2 rounded-full bg-[#12a6e0] animate-pulse" />
//         <div className="h-3 w-40 bg-[#f0f0f0] rounded" />
//       </div>
//       <div className="p-5 flex flex-col gap-2">
//         {Array.from({ length: 8 }).map((_, i) => (
//           <div key={i} className="h-10 bg-[#f8f8f8] rounded-lg" />
//         ))}
//       </div>
//     </div>
//   );

//   if (!data || data.length === 0) return (
//     <div className="bg-white border border-[#e8e8e8] rounded-2xl p-16 text-center shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
//       <PackageX size={36} className="text-[#e0e0e0] mx-auto mb-3" />
//       <p className="text-[#c5c5c5] text-sm">Aucun résultat — ajustez vos filtres et cliquez sur Filtrer</p>
//     </div>
//   );

//   return (
//     <div ref={tableTopRef} className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
//           <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">Résultats</span>
//           <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
//             {sorted.length.toLocaleString('fr-FR')} lignes
//           </span>
//         </div>
//         <button
//           onClick={() => exportExcel(sorted, cols, dateDebut, dateFin)}
//           className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-[#f0fdf4] text-[#15803d] border border-[rgba(21,128,61,0.10)] cursor-pointer transition-all duration-150 hover:bg-[#dcfce7] hover:shadow-[0_1px_6px_rgba(21,128,61,0.18)] active:scale-[0.97]"
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//             <rect x="3" y="3" width="18" height="18" rx="2" fill="#15803d" opacity="0.12"/>
//             <path d="M8 10l2.5 4 1.5-2.5L14 14" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//             <path d="M12 16l-5-5h3V4h4v7h3l-5 5z" fill="#15803d"/>
//             <path d="M5 20h14" stroke="#15803d" strokeWidth="2" strokeLinecap="round"/>
//           </svg>
//           Exporter Excel
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm border-collapse table-auto">
//           <thead>
//             <tr className="border-b border-[#f0f0f0]">
//               <Th label="Date"         colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Catalogue N1" />
//               <Th label="Dépôt"        colKey={cols.nomDepot}   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Article"      colKey={cols.article}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
//               <Th label="Nom Article" />
//               <Th label="Entrées"      colKey={cols.entrees}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//               <Th label="Sorties"      colKey={cols.sorties}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//               <Th label="Solde"        colKey={cols.solde}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//               <Th label="Stock Final"  colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((row, idx) => {
//               const entrees  = Number(row[cols.entrees] ?? 0);
//               const sorties  = Number(row[cols.sorties] ?? 0);
//               const solde    = Number(row[cols.solde]   ?? 0);
//               const hasMvt   = entrees > 0 || sorties > 0;
//               const nomDepot = row[cols.nomDepot] ?? '—';
//               return (
//                 <tr key={idx} className={`border-b border-[#f8f8f8] transition-colors duration-100 ${hasMvt ? 'opacity-100 hover:bg-[rgba(18,166,224,0.04)]' : 'opacity-75 hover:bg-[#fafafa]'}`}>
//                   <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888] whitespace-nowrap">{fmtDate(row[cols.date])}</td>
//                   <td className="px-4 py-3">
//                     {row[cols.catN1]
//                       ? <span className="inline-block bg-[rgba(18,166,224,0.08)] text-[#0b7db0] text-[0.6875rem] px-2 py-0.5 rounded border border-[rgba(18,166,224,0.18)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px]" title={row[cols.catN1]}>{row[cols.catN1]}</span>
//                       : <span className="text-[#e0e0e0]">—</span>}
//                   </td>
//                   <td className="px-4 py-3 text-[#555555] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]" title={nomDepot}>{nomDepot}</td>
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <span className="inline-block font-mono text-[0.72rem] text-[#0b7db0] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.15)] rounded-md px-2 py-0.5">{row[cols.article] ?? '—'}</span>
//                   </td>
//                   <td className="px-4 py-3 text-[#444444] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[260px]" title={row[cols.design]}>{row[cols.design] ?? '—'}</td>
//                   <td className="px-4 py-3 text-right">
//                     {entrees > 0
//                       ? <span className="inline-block text-[#01773d] font-semibold text-[0.8rem] bg-[rgba(1,168,46,0.07)] border border-[rgba(1,168,46,0.18)] rounded-md px-2 py-0.5">{fmtNum(entrees)}</span>
//                       : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     {sorties > 0
//                       ? <span className="inline-block text-[#b71c1c] font-semibold text-[0.8rem] bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-md px-2 py-0.5">{fmtNum(sorties)}</span>
//                       : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className="inline-block font-semibold text-[0.8rem] rounded-md px-2 py-0.5 border"
//                       style={solde > 0
//                         ? { color: '#0b7db0', background: 'rgba(18,166,224,0.07)', borderColor: 'rgba(18,166,224,0.18)' }
//                         : solde < 0
//                         ? { color: '#b71c1c', background: 'rgba(229,57,53,0.07)', borderColor: 'rgba(229,57,53,0.18)' }
//                         : { color: '#c5c5c5', background: '#fafafa', borderColor: '#eeeeee' }}>
//                       {fmtNum(solde)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right"><StockBadge value={row[cols.stockFinal]} /></td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
//           <span className="text-[#c5c5c5] text-[0.75rem]">Page {page} / {totalPages}</span>
//           <div className="flex items-center gap-1">
//             <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1}
//               className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all duration-150 hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed">
//               ← Préc.
//             </button>
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
//               if (p < 1 || p > totalPages) return null;
//               return (
//                 <button key={p} onClick={() => goToPage(p, true)}
//                   className={`w-8 h-8 rounded-lg text-[0.75rem] cursor-pointer transition-all duration-150 ${page === p ? 'bg-[#12a6e0] text-white font-semibold border-0' : 'bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] font-normal hover:bg-[#eaeaea] hover:text-[#0d0c0c]'}`}>
//                   {p}
//                 </button>
//               );
//             })}
//             <button onClick={() => goToPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
//               className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all duration-150 hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed">
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
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { exportExcel } from './exportExcel.js';

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const fmtNum = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);
};

/* ══════════════════════════════════════════════════════════════
   DETECT COLUMNS
══════════════════════════════════════════════════════════════ */
function detectColumns(data) {
  if (!data || data.length === 0) return {};
  const keys = Object.keys(data[0]);
  const find = (...variants) =>
    keys.find(k =>
      variants.some(v => k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, ''))
    ) || null;
  return {
    date:       find('Date', 'DateJour', 'datejour'),
    catN1:      find('CatN1', 'Cat N1', 'CL_Intitule1', 'clintitule1'),
    nomDepot:   find('NomDepot', 'Nom Depot', 'DE_Intitule', 'deintitule'),
    article:    find('Article', 'AR_Ref', 'arref'),
    design:     find('Designation', 'AR_Design', 'ardesign', 'Désignation'),
    entrees:    find('TotalEntrees', 'Total Entrees', 'TotalEntree', 'totalentree'),
    sorties:    find('TotalSorties', 'Total Sorties', 'TotalSortie', 'totalsortie'),
    solde:      find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde', 'solde'),
    stockFinal: find('StockFinal', 'Stock Final', 'stockfinal'),
  };
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANTS UI
══════════════════════════════════════════════════════════════ */
function StockBadge({ value }) {
  if (value === null || value === undefined || value === '') return <span className="text-[#c5c5c5]">—</span>;
  const v = Number(value);
  if (isNaN(v)) return <span className="text-[#c5c5c5]">—</span>;
  if (v > 0) return (
    <span className="inline-flex items-center gap-1 text-[#c47a00] font-semibold text-[0.8rem] bg-[rgba(224,138,0,0.08)] border border-[rgba(224,138,0,0.2)] rounded-md px-2 py-0.5">
      <TrendingUp size={11} /> {fmtNum(v)}
    </span>
  );
  if (v < 0) return (
    <span className="inline-flex items-center gap-1 text-[#b71c1c] font-semibold text-[0.8rem] bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-md px-2 py-0.5">
      <TrendingDown size={11} /> {fmtNum(v)}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[#c5c5c5] text-[0.75rem] bg-[#fafafa] border border-[#eeeeee] rounded-md px-2 py-0.5">
      <Minus size={10} /> 0
    </span>
  );
}

function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
  const active  = sortKey === colKey;
  const isRight = align === 'right';
  const SortIcon = () => {
    if (!colKey) return null;
    if (active) return sortDir === 'asc'
      ? <ArrowUp   size={13} className="text-[#12a6e0] shrink-0" />
      : <ArrowDown size={13} className="text-[#12a6e0] shrink-0" />;
    return <ArrowUpDown size={13} className="text-[#c5c5c5] shrink-0" />;
  };
  return (
    <th
      onClick={() => colKey && onSort(colKey)}
      className={`px-4 py-3 bg-[#f8f8f8] whitespace-nowrap overflow-hidden ${colKey ? 'cursor-pointer select-none' : 'cursor-default'} ${isRight ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-center gap-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
        <span className={`text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 ${active ? 'text-[#12a6e0]' : 'text-[#888888]'}`}>
          {label}
        </span>
        <SortIcon />
      </div>
    </th>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════ */
export default function StockTable({ data, loading, dateDebut, dateFin }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [page,    setPage]    = useState(1);
  const PAGE_SIZE = 31;

  const tableTopRef = useRef(null);
  const cols = useMemo(() => detectColumns(data), [data]);
  useEffect(() => { setPage(1); }, [data]);

  const sorted = useMemo(() => {
    if (!data || !data.length) return [];
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      let av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const na = Number(av), nb = Number(bv);
      if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'fr')
        : String(bv).localeCompare(String(av), 'fr');
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortKey(null); setSortDir(null); }
    setPage(1);
  };

  const goToPage = (p, scroll = false) => {
    setPage(p);
    if (scroll) tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#12a6e0] animate-pulse" />
        <div className="h-3 w-40 bg-[#f0f0f0] rounded" />
      </div>
      <div className="p-5 flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#f8f8f8] rounded-lg" />
        ))}
      </div>
    </div>
  );

  if (!data || data.length === 0) return (
    <div className="bg-white border border-[#e8e8e8] rounded-2xl p-16 text-center shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <PackageX size={36} className="text-[#e0e0e0] mx-auto mb-3" />
      <p className="text-[#c5c5c5] text-sm">Aucun résultat — ajustez vos filtres et cliquez sur Filtrer</p>
    </div>
  );

  return (
    <div ref={tableTopRef} className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
          <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">Résultats</span>
          <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
            {sorted.length.toLocaleString('fr-FR')} lignes
          </span>
        </div>
        <button
          onClick={() => exportExcel(sorted, cols, dateDebut, dateFin)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-[#f0fdf4] text-[#15803d] border border-[rgba(21,128,61,0.10)] cursor-pointer transition-all duration-150 hover:bg-[#dcfce7] hover:shadow-[0_1px_6px_rgba(21,128,61,0.18)] active:scale-[0.97]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#15803d" opacity="0.12"/>
            <path d="M8 10l2.5 4 1.5-2.5L14 14" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5z" fill="#15803d"/>
            <path d="M5 20h14" stroke="#15803d" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Exporter Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse table-auto">
          <thead>
            <tr className="border-b border-[#f0f0f0]">
              <Th label="Date"         colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th label="Catalogue N1" />
              <Th label="Dépôt"        colKey={cols.nomDepot}   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th label="Article"      colKey={cols.article}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th label="Nom Article" />
              <Th label="Entrées"      colKey={cols.entrees}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th label="Sorties"      colKey={cols.sorties}    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th label="Solde"        colKey={cols.solde}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
              <Th label="Stock Final"  colKey={cols.stockFinal} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => {
              const entrees  = Number(row[cols.entrees] ?? 0);
              const sorties  = Number(row[cols.sorties] ?? 0);
              const solde    = Number(row[cols.solde]   ?? 0);
              const hasMvt   = entrees > 0 || sorties > 0;
              const nomDepot = row[cols.nomDepot] ?? '—';
              return (
                <tr key={idx} className={`border-b border-[#f8f8f8] transition-colors duration-100 ${hasMvt ? 'opacity-100 hover:bg-[rgba(18,166,224,0.04)]' : 'opacity-75 hover:bg-[#fafafa]'}`}>
                  <td className="px-4 py-3 font-mono text-[0.75rem] text-[#888888] whitespace-nowrap">{fmtDate(row[cols.date])}</td>
                  <td className="px-4 py-3">
                    {row[cols.catN1]
                      ? <span className="inline-block bg-[rgba(18,166,224,0.08)] text-[#0b7db0] text-[0.6875rem] px-2 py-0.5 rounded border border-[rgba(18,166,224,0.18)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px]" title={row[cols.catN1]}>{row[cols.catN1]}</span>
                      : <span className="text-[#e0e0e0]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[#555555] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]" title={nomDepot}>{nomDepot}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block font-mono text-[0.72rem] text-[#0b7db0] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.15)] rounded-md px-2 py-0.5">{row[cols.article] ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-[#444444] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[260px]" title={row[cols.design]}>{row[cols.design] ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {entrees > 0
                      ? <span className="inline-block text-[#01773d] font-semibold text-[0.8rem] bg-[rgba(1,168,46,0.07)] border border-[rgba(1,168,46,0.18)] rounded-md px-2 py-0.5">{fmtNum(entrees)}</span>
                      : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {sorties > 0
                      ? <span className="inline-block text-[#b71c1c] font-semibold text-[0.8rem] bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-md px-2 py-0.5">{fmtNum(sorties)}</span>
                      : <span className="text-[#e0e0e0] text-[0.75rem]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className="inline-block font-semibold text-[0.8rem] rounded-md px-2 py-0.5 border"
                      style={solde > 0
                        ? { color: '#0b7db0', background: 'rgba(18,166,224,0.07)', borderColor: 'rgba(18,166,224,0.18)' }
                        : solde < 0
                        ? { color: '#b71c1c', background: 'rgba(229,57,53,0.07)', borderColor: 'rgba(229,57,53,0.18)' }
                        : { color: '#c5c5c5', background: '#fafafa', borderColor: '#eeeeee' }}
                    >
                      {fmtNum(solde)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right"><StockBadge value={row[cols.stockFinal]} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0]">
          <span className="text-[#c5c5c5] text-[0.75rem]">Page {page} / {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all duration-150 hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed"
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
                  className={`w-8 h-8 rounded-lg text-[0.75rem] cursor-pointer transition-all duration-150 ${page === p ? 'bg-[#12a6e0] text-white font-semibold border-0' : 'bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] font-normal hover:bg-[#eaeaea] hover:text-[#0d0c0c]'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-[0.75rem] bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] transition-all duration-150 hover:bg-[#eaeaea] hover:text-[#0d0c0c] disabled:opacity-35 disabled:cursor-not-allowed"
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}