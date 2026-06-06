// import ExcelJS from 'exceljs';

// /* ── helpers ─────────────────────────────────────────────────── */
// const fmtDate = (d) => {
//   if (!d) return '';
//   const date = new Date(d);
//   return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
// };

// const MONTH_NAMES = [
//   'Janvier','Février','Mars','Avril','Mai','Juin',
//   'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
// ];

// /* ── couleurs ────────────────────────────────────────────────── */
// const C = {
//   headerBg:      'FF0D8FC4',
//   headerFont:    'FFFFFFFF',
//   subHeaderBg:   'FFE8F6FD',
//   subHeaderFont: 'FF0D0C0C',
//   articleBg:     'FFDFF2FB',
//   articleFont:   'FF0B5E7F',
//   subtotalBg:    'FFCCE8F6',
//   subtotalFont:  'FF065070',
//   totalBg:       'FF0D8FC4',
//   totalFont:     'FFFFFFFF',
//   green:         'FF01773D',
//   greenBg:       'FFE6F9EF',
//   red:           'FFB71C1C',
//   redBg:         'FFFDE8E8',
//   blue:          'FF0B7DB0',
//   blueBg:        'FFE8F6FD',
//   amber:         'FFC47A00',
//   amberBg:       'FFFFF3CD',
//   gray:          'FF888888',
//   border:        'FFD0E8F5',
//   altRow:        'FFF7FBFF',
//   white:         'FFFFFFFF',
// };

// const border = (color = C.border) => ({
//   top:    { style: 'thin', color: { argb: color } },
//   left:   { style: 'thin', color: { argb: color } },
//   bottom: { style: 'thin', color: { argb: color } },
//   right:  { style: 'thin', color: { argb: color } },
// });

// const borderMedium = (color = 'FF0A7BAE') => ({
//   top:    { style: 'medium', color: { argb: color } },
//   left:   { style: 'medium', color: { argb: color } },
//   bottom: { style: 'medium', color: { argb: color } },
//   right:  { style: 'medium', color: { argb: color } },
// });

// const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });

// const font = (argb, bold = false, size = 10) => ({
//   name: 'Arial', size, bold, color: { argb },
// });

// const align = (h = 'left', v = 'middle', wrap = false) => ({
//   horizontal: h, vertical: v, wrapText: wrap,
// });

// /* ── helper : applique le style fond+bordure sur une plage de colonnes ── */
// function styleCells(ws, row, colStart, colEnd, fillArgb, bFn) {
//   for (let c = colStart; c <= colEnd; c++) {
//     const cell  = ws.getCell(row, c);
//     cell.fill   = fill(fillArgb);
//     cell.border = bFn();
//   }
// }

// /* ── export principal ────────────────────────────────────────── */
// export async function exportExcel(data, cols, dateDebut, dateFin) {
//   if (!data || data.length === 0) return;

//   const wb = new ExcelJS.Workbook();
//   wb.creator  = 'Stock Dashboard';
//   wb.created  = new Date();

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
//     await saveWorkbook(wb, dateDebut, dateFin);
//     return;
//   }

//   monthKeys.forEach(key => {
//     const [year, month] = key.split('-').map(Number);
//     buildSheet(wb, `${MONTH_NAMES[month - 1]} ${year}`, byMonth[key], cols, month, year);
//   });

//   await saveWorkbook(wb, dateDebut, dateFin);
// }

// /* ── construction d'un onglet ────────────────────────────────── */
// function buildSheet(wb, sheetName, rows, cols) {
//   const ws = wb.addWorksheet(sheetName, {
//     pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
//     views: [{ state: 'frozen', ySplit: 3 }],
//   });

//   /*
//     COLONNES
//     --------
//     1  Date        14
//     2  Catalogue   24
//     3  Dépôt       26
//     4  Article     18
//     5  Désignation 38   ← colonne la plus large, recevra les labels de sous-total/total
//     6  Entrées     16
//     7  Sorties     16
//     8  Solde       16
//     9  Stock Final 16
//   */
//   ws.columns = [
//     { key: 'date',     width: 14 },
//     { key: 'catN1',    width: 24 },
//     { key: 'depot',    width: 26 },
//     { key: 'article',  width: 18 },
//     { key: 'design',   width: 38 },
//     { key: 'entrees',  width: 16 },
//     { key: 'sorties',  width: 16 },
//     { key: 'solde',    width: 16 },
//     { key: 'stockFin', width: 16 },
//   ];

//   const COL_COUNT = 9;

//   /* ── Ligne 1 : titre principal ── */
//   ws.mergeCells(1, 1, 1, COL_COUNT);
//   const titleCell     = ws.getCell(1, 1);
//   titleCell.value     = `📦  Mouvements de stock — ${sheetName}`;
//   titleCell.font      = font(C.headerFont, true, 13);
//   titleCell.fill      = fill(C.headerBg);
//   titleCell.alignment = align('center', 'middle');
//   titleCell.border    = borderMedium();
//   ws.getRow(1).height = 28;

//   /* ── Ligne 2 : en-têtes colonnes ── */
//   const headers = ['Date','Catalogue N1','Dépôt','Article','Désignation','Entrées','Sorties','Solde','Stock Final'];
//   headers.forEach((h, i) => {
//     const cell     = ws.getCell(2, i + 1);
//     cell.value     = h;
//     cell.font      = font(C.subHeaderFont, true, 9);
//     cell.fill      = fill(C.subHeaderBg);
//     cell.alignment = align(i >= 5 ? 'right' : 'left', 'middle');
//     cell.border    = border();
//   });
//   ws.getRow(2).height = 20;

//   /* ── Regrouper par article ── */
//   const byArticle = {};
//   rows.forEach(row => {
//     const artCode = row[cols.article] ?? '(sans code)';
//     if (!byArticle[artCode]) byArticle[artCode] = [];
//     byArticle[artCode].push(row);
//   });

//   let currentRow      = 3;
//   let grandEntrees    = 0;
//   let grandSorties    = 0;
//   let grandStockFinal = 0;

//   const artEntries = Object.entries(byArticle);

//   artEntries.forEach(([artCode, artRows], artIdx) => {
//     artRows.sort((a, b) => new Date(a[cols.date]) - new Date(b[cols.date]));
//     const design = artRows[0][cols.design] ?? '';

//     /* ── Ligne titre article (fusion toute largeur, texte court) ── */
//     ws.mergeCells(currentRow, 1, currentRow, COL_COUNT);
//     const artTitle     = ws.getCell(currentRow, 1);
//     artTitle.value     = `  ${artCode}  —  ${design}`;
//     artTitle.font      = font(C.articleFont, true, 10);
//     artTitle.fill      = fill(C.articleBg);
//     artTitle.alignment = align('left', 'middle');
//     artTitle.border    = border('FF8CC8E8');
//     ws.getRow(currentRow).height = 20;
//     currentRow++;

//     /* ── Stock final par dépôt ── */
//     const byDepot = {};
//     artRows.forEach(row => {
//       const dk = row[cols.depot] ?? row[cols.nomDepot] ?? '(sans dépôt)';
//       if (!byDepot[dk]) byDepot[dk] = [];
//       byDepot[dk].push(row);
//     });

//     let artEntrees         = 0;
//     let artSorties         = 0;
//     let artStockFinalTotal = 0;

//     Object.values(byDepot).forEach(dr => {
//       const sorted = [...dr].sort((a, b) => new Date(b[cols.date]) - new Date(a[cols.date]));
//       const last   = sorted.find(r => r[cols.stockFinal] != null);
//       if (last) artStockFinalTotal += Number(last[cols.stockFinal]);
//     });

//     /* ── Lignes de détail ── */
//     artRows.forEach((row, rowIdx) => {
//       const entrees  = Number(row[cols.entrees]  ?? 0);
//       const sorties  = Number(row[cols.sorties]  ?? 0);
//       const solde    = Number(row[cols.solde]    ?? 0);
//       const stockFin = row[cols.stockFinal] != null ? Number(row[cols.stockFinal]) : null;

//       artEntrees += entrees;
//       artSorties += sorties;

//       const rf = (rowIdx % 2 === 1) ? fill(C.altRow) : fill(C.white);

//       const setCell = (col, value, options = {}) => {
//         const cell     = ws.getCell(currentRow, col);
//         cell.value     = value;
//         cell.fill      = rf;
//         cell.border    = border();
//         cell.font      = options.font  || font('FF333333', false, 9);
//         cell.alignment = options.align || align('left', 'middle');
//         if (options.numFmt) cell.numFmt = options.numFmt;
//       };

//       setCell(1, fmtDate(row[cols.date]), { font: font(C.gray,false,9), align: align('center','middle') });
//       setCell(2, row[cols.catN1]    ?? '');
//       setCell(3, row[cols.nomDepot] ?? '');
//       setCell(4, row[cols.article]  ?? '', { font: font(C.blue,false,9), align: align('center','middle') });
//       setCell(5, row[cols.design]   ?? '');

//       if (entrees > 0) {
//         const c = ws.getCell(currentRow, 6);
//         c.value = entrees; c.fill = fill(C.greenBg); c.font = font(C.green,true,9);
//         c.alignment = align('right','middle'); c.numFmt = '#,##0.##'; c.border = border();
//       } else {
//         setCell(6, '—', { align: align('right','middle'), font: font('FFDDDDDD',false,9) });
//       }

//       if (sorties > 0) {
//         const c = ws.getCell(currentRow, 7);
//         c.value = sorties; c.fill = fill(C.redBg); c.font = font(C.red,true,9);
//         c.alignment = align('right','middle'); c.numFmt = '#,##0.##'; c.border = border();
//       } else {
//         setCell(7, '—', { align: align('right','middle'), font: font('FFDDDDDD',false,9) });
//       }

//       const sc     = ws.getCell(currentRow, 8);
//       sc.value     = solde !== 0 ? solde : '—';
//       sc.fill      = solde > 0 ? fill(C.blueBg) : solde < 0 ? fill(C.redBg) : rf;
//       sc.font      = solde > 0 ? font(C.blue,true,9) : solde < 0 ? font(C.red,true,9) : font('FFDDDDDD',false,9);
//       sc.alignment = align('right','middle'); sc.numFmt = '#,##0.##'; sc.border = border();

//       if (stockFin !== null) {
//         const c = ws.getCell(currentRow, 9);
//         c.value = stockFin;
//         c.fill  = stockFin > 0 ? fill(C.amberBg) : stockFin < 0 ? fill(C.redBg) : rf;
//         c.font  = stockFin > 0 ? font(C.amber,true,9) : stockFin < 0 ? font(C.red,true,9) : font(C.gray,false,9);
//         c.alignment = align('right','middle'); c.numFmt = '#,##0.##'; c.border = border();
//       } else {
//         setCell(9, '—', { align: align('right','middle'), font: font('FFDDDDDD',false,9) });
//       }

//       currentRow++;
//     });

//     /* ────────────────────────────────────────────────────────────
//        LIGNE SOUS-TOTAL ARTICLE
//        Stratégie : cols 1-4 = fond coloré vides
//                    col  5   = label complet  ← colonne large (38) jamais tronquée
//                    cols 6-9 = valeurs
//     ──────────────────────────────────────────────────────────── */
//     grandEntrees    += artEntrees;
//     grandSorties    += artSorties;
//     grandStockFinal += artStockFinalTotal;

//     // Cols 1-4 : fond + bordure, pas de texte
//     for (let c = 1; c <= 4; c++) {
//       const cell  = ws.getCell(currentRow, c);
//       cell.value  = '';
//       cell.fill   = fill(C.subtotalBg);
//       cell.border = borderMedium('FF8CC8E8');
//     }

//     // Col 5 : LABEL — colonne Désignation (38 unités), jamais tronquée
//     const stLabel     = ws.getCell(currentRow, 5);
//     stLabel.value     = `▶  Sous-total : ${artCode} — ${design}`;
//     stLabel.font      = font(C.subtotalFont, true, 10);
//     stLabel.fill      = fill(C.subtotalBg);
//     stLabel.alignment = align('left', 'middle');
//     stLabel.border    = borderMedium('FF8CC8E8');

//     // Col 6 : entrées
//     const stE     = ws.getCell(currentRow, 6);
//     stE.value     = artEntrees;
//     stE.fill      = fill(C.subtotalBg);
//     stE.font      = font(C.green, true, 10);
//     stE.alignment = align('right', 'middle');
//     stE.numFmt    = '#,##0.##';
//     stE.border    = borderMedium('FF8CC8E8');

//     // Col 7 : sorties
//     const stS     = ws.getCell(currentRow, 7);
//     stS.value     = artSorties;
//     stS.fill      = fill(C.subtotalBg);
//     stS.font      = font(C.red, true, 10);
//     stS.alignment = align('right', 'middle');
//     stS.numFmt    = '#,##0.##';
//     stS.border    = borderMedium('FF8CC8E8');

//     // Col 8 : vide
//     const stSolde  = ws.getCell(currentRow, 8);
//     stSolde.value  = '';
//     stSolde.fill   = fill(C.subtotalBg);
//     stSolde.border = borderMedium('FF8CC8E8');

//     // Col 9 : stock final
//     const stSF     = ws.getCell(currentRow, 9);
//     stSF.value     = artStockFinalTotal;
//     stSF.fill      = fill(C.subtotalBg);
//     stSF.font      = font(C.amber, true, 10);
//     stSF.alignment = align('right', 'middle');
//     stSF.numFmt    = '#,##0.##';
//     stSF.border    = borderMedium('FF8CC8E8');

//     ws.getRow(currentRow).height = 26;
//     currentRow++;

//     // Séparateur
//     if (artIdx < artEntries.length - 1) {
//       ws.getRow(currentRow).height = 6;
//       for (let c = 1; c <= COL_COUNT; c++)
//         ws.getCell(currentRow, c).fill = fill('FFF0F8FF');
//       currentRow++;
//     }
//   });

//   /* ────────────────────────────────────────────────────────────
//      LIGNE GRAND TOTAL
//      Même stratégie : label dans col 5
//   ──────────────────────────────────────────────────────────── */
//   currentRow++; // ligne séparation

//   // Cols 1-4 : fond + bordure, pas de texte
//   for (let c = 1; c <= 4; c++) {
//     const cell  = ws.getCell(currentRow, c);
//     cell.value  = '';
//     cell.fill   = fill(C.totalBg);
//     cell.border = borderMedium();
//   }

//   // Col 5 : LABEL grand total — visible, jamais tronqué
//   const gtLabel     = ws.getCell(currentRow, 5);
//   gtLabel.value     = '◆  GRAND TOTAL — Total général';
//   gtLabel.font      = font(C.totalFont, true, 12);
//   gtLabel.fill      = fill(C.totalBg);
//   gtLabel.alignment = align('left', 'middle');
//   gtLabel.border    = borderMedium();

//   // Col 6 : grand total entrées
//   const gtE     = ws.getCell(currentRow, 6);
//   gtE.value     = grandEntrees;
//   gtE.fill      = fill(C.totalBg);
//   gtE.font      = font('FF90EEB8', true, 11);
//   gtE.alignment = align('right', 'middle');
//   gtE.numFmt    = '#,##0.##';
//   gtE.border    = borderMedium();

//   // Col 7 : grand total sorties
//   const gtS     = ws.getCell(currentRow, 7);
//   gtS.value     = grandSorties;
//   gtS.fill      = fill(C.totalBg);
//   gtS.font      = font('FFFFAAAA', true, 11);
//   gtS.alignment = align('right', 'middle');
//   gtS.numFmt    = '#,##0.##';
//   gtS.border    = borderMedium();

//   // Col 8 : vide
//   const gtSolde  = ws.getCell(currentRow, 8);
//   gtSolde.value  = '';
//   gtSolde.fill   = fill(C.totalBg);
//   gtSolde.border = borderMedium();

//   // Col 9 : grand total stock final
//   const gtSF     = ws.getCell(currentRow, 9);
//   gtSF.value     = grandStockFinal;
//   gtSF.fill      = fill(C.totalBg);
//   gtSF.font      = font('FFFFFFAA', true, 12);
//   gtSF.alignment = align('right', 'middle');
//   gtSF.numFmt    = '#,##0.##';
//   gtSF.border    = borderMedium();

//   ws.getRow(currentRow).height = 30;

//   /* ── Filtre automatique ── */
//   ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: COL_COUNT } };
// }

// /* ── Sauvegarde du fichier ───────────────────────────────────── */
// async function saveWorkbook(wb, dateDebut, dateFin) {
//   const buffer = await wb.xlsx.writeBuffer();
//   const blob   = new Blob([buffer], {
//     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   });
//   const url    = URL.createObjectURL(blob);
//   const a      = document.createElement('a');
//   const suffix = dateDebut && dateFin
//     ? `${dateDebut}_au_${dateFin}`
//     : new Date().toISOString().slice(0, 10);
//   a.href     = url;
//   a.download = `stock_${suffix}.xlsx`;
//   a.click();
//   URL.revokeObjectURL(url);
// }
import ExcelJS from 'exceljs';

/* ── helpers ─────────────────────────────────────────────────── */
const fmtDateExcel = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const MONTH_NAMES = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

/* ── couleurs ────────────────────────────────────────────────── */
const C = {
  headerBg:    'FF0D8FC4', headerFont:  'FFFFFFFF',
  subHeaderBg: 'FFE8F6FD',
  articleBg:   'FFDFF2FB', articleFont: 'FF0B5E7F',
  subtotalBg:  'FFCCE8F6', subtotalFont:'FF065070',
  totalBg:     'FF0D8FC4', totalFont:   'FFFFFFFF',
  green:       'FF01773D', greenBg:     'FFE6F9EF',
  red:         'FFB71C1C', redBg:       'FFFDE8E8',
  blue:        'FF0B7DB0', blueBg:      'FFE8F6FD',
  amber:       'FFC47A00', amberBg:     'FFFFF3CD',
  gray:        'FF888888', border:      'FFD0E8F5',
  altRow:      'FFF7FBFF', white:       'FFFFFFFF',
};

const xlBorder  = (color = C.border) => ({
  top:    { style: 'thin',   color: { argb: color } },
  left:   { style: 'thin',   color: { argb: color } },
  bottom: { style: 'thin',   color: { argb: color } },
  right:  { style: 'thin',   color: { argb: color } },
});
const xlBorderM = (color = 'FF0A7BAE') => ({
  top:    { style: 'medium', color: { argb: color } },
  left:   { style: 'medium', color: { argb: color } },
  bottom: { style: 'medium', color: { argb: color } },
  right:  { style: 'medium', color: { argb: color } },
});
const xlFill  = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
const xlFont  = (argb, bold = false, size = 10) => ({ name: 'Arial', size, bold, color: { argb } });
const xlAlign = (h = 'left', v = 'middle') => ({ horizontal: h, vertical: v });

/* ── construction d'un onglet ────────────────────────────────── */
function buildSheet(wb, sheetName, rows, cols) {
  const ws = wb.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    views: [{ state: 'frozen', ySplit: 2 }],
  });

  const COL_COUNT = 9;
  ws.columns = [
    { key: 'date',     width: 13 },
    { key: 'catN1',    width: 22 },
    { key: 'depot',    width: 24 },
    { key: 'article',  width: 16 },
    { key: 'design',   width: 40 },
    { key: 'entrees',  width: 16 },
    { key: 'sorties',  width: 16 },
    { key: 'solde',    width: 16 },
    { key: 'stockFin', width: 16 },
  ];

  /* ── Ligne 1 : titre ── */
  ws.mergeCells(1, 1, 1, COL_COUNT);
  const titleCell     = ws.getCell(1, 1);
  titleCell.value     = `Mouvements de stock — ${sheetName}`;
  titleCell.font      = xlFont(C.headerFont, true, 13);
  titleCell.fill      = xlFill(C.headerBg);
  titleCell.alignment = xlAlign('center');
  titleCell.border    = xlBorderM();
  ws.getRow(1).height = 28;

  /* ── Ligne 2 : en-têtes ── */
  const headers = ['Date','Catalogue N1','Dépôt','Article','Désignation','Entrées','Sorties','Solde','Stock Final'];
  headers.forEach((h, i) => {
    const cell     = ws.getCell(2, i + 1);
    cell.value     = h;
    cell.font      = xlFont('FF0D0C0C', true, 9);
    cell.fill      = xlFill(C.subHeaderBg);
    cell.alignment = xlAlign(i >= 5 ? 'right' : 'left');
    cell.border    = xlBorder();
  });
  ws.getRow(2).height = 20;

  /* ── Regrouper par article ── */
  const byArticle = {};
  rows.forEach(row => {
    const code = row[cols.article] ?? '(sans code)';
    if (!byArticle[code]) byArticle[code] = [];
    byArticle[code].push(row);
  });

  let currentRow      = 3;
  let grandEntrees    = 0;
  let grandSorties    = 0;
  let grandStockFinal = 0;

  Object.entries(byArticle).forEach(([artCode, artRows]) => {
    artRows.sort((a, b) => new Date(a[cols.date]) - new Date(b[cols.date]));
    const design = artRows[0][cols.design] ?? '';

    /* ── Bandeau article ── */
    ws.mergeCells(currentRow, 1, currentRow, COL_COUNT);
    const artCell     = ws.getCell(currentRow, 1);
    artCell.value     = `  ${artCode}  —  ${design}`;
    artCell.font      = xlFont(C.articleFont, true, 10);
    artCell.fill      = xlFill(C.articleBg);
    artCell.alignment = xlAlign('left');
    artCell.border    = xlBorder('FF8CC8E8');
    ws.getRow(currentRow).height = 18;
    currentRow++;

    /* ── Stock final par dépôt ── */
    const byDepot = {};
    artRows.forEach(row => {
      const dk = String(row['Depot'] ?? row[cols.nomDepot] ?? '(sans dépôt)');
      if (!byDepot[dk]) byDepot[dk] = [];
      byDepot[dk].push(row);
    });
    let artStockFinalTotal = 0;
    Object.values(byDepot).forEach(dr => {
      const sorted = [...dr].sort((a, b) => new Date(b[cols.date]) - new Date(a[cols.date]));
      for (const r of sorted) {
        if (r[cols.stockFinal] !== undefined && r[cols.stockFinal] !== null) {
          artStockFinalTotal += Number(r[cols.stockFinal]);
          break;
        }
      }
    });

    /* ── Lignes de détail ── */
    let artEntrees = 0;
    let artSorties = 0;

    artRows.forEach((row, rowIdx) => {
      const entrees  = Number(row[cols.entrees]  ?? 0);
      const sorties  = Number(row[cols.sorties]  ?? 0);
      const solde    = Number(row[cols.solde]    ?? 0);
      const stockFin = (row[cols.stockFinal] !== undefined && row[cols.stockFinal] !== null)
        ? Number(row[cols.stockFinal]) : null;

      artEntrees += entrees;
      artSorties += sorties;

      const rowFill = rowIdx % 2 === 1 ? xlFill(C.altRow) : xlFill(C.white);
      const set = (col, value, fnt, aln, numFmt, customFill) => {
        const cell     = ws.getCell(currentRow, col);
        cell.value     = value;
        cell.fill      = customFill || rowFill;
        cell.font      = fnt  || xlFont('FF333333', false, 9);
        cell.alignment = aln  || xlAlign('left');
        cell.border    = xlBorder();
        if (numFmt) cell.numFmt = numFmt;
      };

      set(1, fmtDateExcel(row[cols.date]), xlFont(C.gray, false, 9), xlAlign('center'));
      set(2, row[cols.catN1]    ?? '');
      set(3, row[cols.nomDepot] ?? '');
      set(4, row[cols.article]  ?? '', xlFont(C.blue, false, 9), xlAlign('center'));
      set(5, row[cols.design]   ?? '');

      if (entrees > 0) {
        set(6, entrees, xlFont(C.green, true, 9), xlAlign('right'), '#,##0.##', xlFill(C.greenBg));
      } else {
        set(6, '—', xlFont('FFDDDDDD', false, 9), xlAlign('right'));
      }
      if (sorties > 0) {
        set(7, sorties, xlFont(C.red, true, 9), xlAlign('right'), '#,##0.##', xlFill(C.redBg));
      } else {
        set(7, '—', xlFont('FFDDDDDD', false, 9), xlAlign('right'));
      }

      const soldeFill = solde > 0 ? xlFill(C.blueBg) : solde < 0 ? xlFill(C.redBg) : rowFill;
      const soldeFont = solde > 0 ? xlFont(C.blue, true, 9) : solde < 0 ? xlFont(C.red, true, 9) : xlFont('FFDDDDDD', false, 9);
      set(8, solde !== 0 ? solde : '—', soldeFont, xlAlign('right'), '#,##0.##', soldeFill);

      if (stockFin !== null) {
        const sf = stockFin > 0 ? xlFill(C.amberBg) : stockFin < 0 ? xlFill(C.redBg) : rowFill;
        const ff = stockFin > 0 ? xlFont(C.amber, true, 9) : stockFin < 0 ? xlFont(C.red, true, 9) : xlFont(C.gray, false, 9);
        set(9, stockFin, ff, xlAlign('right'), '#,##0.##', sf);
      } else {
        set(9, '—', xlFont('FFDDDDDD', false, 9), xlAlign('right'));
      }

      currentRow++;
    });

    /* ══════════════════════════════════════════════════════════
       LIGNE SOUS-TOTAL — cols 1-5 fusionnées
    ══════════════════════════════════════════════════════════ */
    grandEntrees    += artEntrees;
    grandSorties    += artSorties;
    grandStockFinal += artStockFinalTotal;

    ws.mergeCells(currentRow, 1, currentRow, 5);
    const stLabel     = ws.getCell(currentRow, 1);
    stLabel.value     = `▶  Sous-total : ${artCode} — ${design}`;
    stLabel.font      = xlFont(C.subtotalFont, true, 10);
    stLabel.fill      = xlFill(C.subtotalBg);
    stLabel.alignment = xlAlign('left');
    stLabel.border    = xlBorderM('FF8CC8E8');

    const stE     = ws.getCell(currentRow, 6);
    stE.value     = artEntrees;
    stE.fill      = xlFill(C.subtotalBg);
    stE.font      = xlFont(C.green, true, 9);
    stE.alignment = xlAlign('right');
    stE.numFmt    = '#,##0.##';
    stE.border    = xlBorderM('FF8CC8E8');

    const stS     = ws.getCell(currentRow, 7);
    stS.value     = artSorties;
    stS.fill      = xlFill(C.subtotalBg);
    stS.font      = xlFont(C.red, true, 9);
    stS.alignment = xlAlign('right');
    stS.numFmt    = '#,##0.##';
    stS.border    = xlBorderM('FF8CC8E8');

    const stSolde  = ws.getCell(currentRow, 8);
    stSolde.value  = '';
    stSolde.fill   = xlFill(C.subtotalBg);
    stSolde.border = xlBorderM('FF8CC8E8');

    const stSF     = ws.getCell(currentRow, 9);
    stSF.value     = artStockFinalTotal;
    stSF.fill      = xlFill(C.subtotalBg);
    stSF.font      = xlFont(C.amber, true, 9);
    stSF.alignment = xlAlign('right');
    stSF.numFmt    = '#,##0.##';
    stSF.border    = xlBorderM('FF8CC8E8');

    ws.getRow(currentRow).height = 22;
    currentRow++;

    /* séparation */
    currentRow++;
  });

  /* ══════════════════════════════════════════════════════════
     LIGNE GRAND TOTAL — cols 1-5 fusionnées
  ══════════════════════════════════════════════════════════ */
  ws.mergeCells(currentRow, 1, currentRow, 5);
  const gtLabel     = ws.getCell(currentRow, 1);
  gtLabel.value     = '◆  GRAND TOTAL — Total général';
  gtLabel.font      = xlFont(C.totalFont, true, 11);
  gtLabel.fill      = xlFill(C.totalBg);
  gtLabel.alignment = xlAlign('left');
  gtLabel.border    = xlBorderM();

  const gtE     = ws.getCell(currentRow, 6);
  gtE.value     = grandEntrees;
  gtE.fill      = xlFill(C.totalBg);
  gtE.font      = xlFont('FF90EEB8', true, 11);
  gtE.alignment = xlAlign('right');
  gtE.numFmt    = '#,##0.##';
  gtE.border    = xlBorderM();

  const gtS     = ws.getCell(currentRow, 7);
  gtS.value     = grandSorties;
  gtS.fill      = xlFill(C.totalBg);
  gtS.font      = xlFont('FFFFAAAA', true, 11);
  gtS.alignment = xlAlign('right');
  gtS.numFmt    = '#,##0.##';
  gtS.border    = xlBorderM();

  const gtSolde  = ws.getCell(currentRow, 8);
  gtSolde.value  = '';
  gtSolde.fill   = xlFill(C.totalBg);
  gtSolde.border = xlBorderM();

  const gtSF     = ws.getCell(currentRow, 9);
  gtSF.value     = grandStockFinal;
  gtSF.fill      = xlFill(C.totalBg);
  gtSF.font      = xlFont('FFFFFFAA', true, 11);
  gtSF.alignment = xlAlign('right');
  gtSF.numFmt    = '#,##0.##';
  gtSF.border    = xlBorderM();

  ws.getRow(currentRow).height = 26;

  ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: COL_COUNT } };
}

/* ── export principal ────────────────────────────────────────── */
export async function exportExcel(data, cols, dateDebut, dateFin) {
  if (!data || data.length === 0) return;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Stock Dashboard';
  wb.created = new Date();

  const byMonth = {};
  data.forEach(row => {
    const raw = row[cols.date];
    if (!raw) return;
    const d = new Date(raw);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(row);
  });

  const monthKeys = Object.keys(byMonth).sort();
  if (monthKeys.length === 0) {
    buildSheet(wb, 'Données', data, cols);
  } else {
    monthKeys.forEach(key => {
      const [year, month] = key.split('-').map(Number);
      buildSheet(wb, `${MONTH_NAMES[month - 1]} ${year}`, byMonth[key], cols);
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  const suffix = dateDebut && dateFin ? `${dateDebut}_au_${dateFin}` : new Date().toISOString().slice(0, 10);
  a.href = url; a.download = `stock_${suffix}.xlsx`; a.click();
  URL.revokeObjectURL(url);
}