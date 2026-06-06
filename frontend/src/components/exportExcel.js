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