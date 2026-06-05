/**
 * exportExcel.js
 * ─────────────────────────────────────────────────────────────────
 * Remplace exportCSV dans StockTable.js
 *
 * Usage :
 *   import { exportExcel } from './exportExcel';
 *   // puis dans le bouton :
 *   onClick={() => exportExcel(sorted, cols, dateDebut, dateFin)}
 *
 * Dépendance : exceljs  →  npm install exceljs
 * ─────────────────────────────────────────────────────────────────
 */
import ExcelJS from 'exceljs';

/* ── helpers ─────────────────────────────────────────────────── */
const fmtDate = (d) => {
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
  headerBg:      'FF0D8FC4',   // bleu principal
  headerFont:    'FFFFFFFF',
  subHeaderBg:   'FFE8F6FD',
  subHeaderFont: 'FF0D0C0C',
  articleBg:     'FFDFF2FB',   // ligne sous-titre article
  articleFont:   'FF0B5E7F',
  subtotalBg:    'FFCCE8F6',   // ligne sous-total article
  subtotalFont:  'FF065070',
  totalBg:       'FF0D8FC4',   // ligne grand total
  totalFont:     'FFFFFFFF',
  green:         'FF01773D',
  greenBg:       'FFE6F9EF',
  red:           'FFB71C1C',
  redBg:         'FFFDE8E8',
  blue:          'FF0B7DB0',
  blueBg:        'FFE8F6FD',
  amber:         'FFC47A00',
  amberBg:       'FFFFF3CD',
  gray:          'FF888888',
  border:        'FFD0E8F5',
  altRow:        'FFF7FBFF',
  white:         'FFFFFFFF',
};

const border = (color = C.border) => ({
  top:    { style: 'thin', color: { argb: color } },
  left:   { style: 'thin', color: { argb: color } },
  bottom: { style: 'thin', color: { argb: color } },
  right:  { style: 'thin', color: { argb: color } },
});

const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });

const font = (argb, bold = false, size = 10) => ({
  name: 'Arial', size, bold, color: { argb },
});

const align = (h = 'left', v = 'middle', wrap = false) => ({
  horizontal: h, vertical: v, wrapText: wrap,
});

/* ── export principal ────────────────────────────────────────── */
export async function exportExcel(data, cols, dateDebut, dateFin) {
  if (!data || data.length === 0) return;

  const wb = new ExcelJS.Workbook();
  wb.creator  = 'Stock Dashboard';
  wb.created  = new Date();

  /* ── Regrouper les données par mois ── */
  const byMonth = {};          // { 'YYYY-MM': [rows...] }

  data.forEach(row => {
    const raw = row[cols.date];
    if (!raw) return;
    const d   = new Date(raw);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(row);
  });

  const monthKeys = Object.keys(byMonth).sort();

  if (monthKeys.length === 0) {
    /* fallback : une seule feuille si pas de dates */
    buildSheet(wb, 'Données', data, cols);
    await saveWorkbook(wb, dateDebut, dateFin);
    return;
  }

  /* ── Créer un onglet par mois ── */
  monthKeys.forEach(key => {
    const [year, month] = key.split('-').map(Number);
    const sheetName = `${MONTH_NAMES[month - 1]} ${year}`;
    buildSheet(wb, sheetName, byMonth[key], cols, month, year);
  });

  await saveWorkbook(wb, dateDebut, dateFin);
}

/* ── construction d'un onglet ────────────────────────────────── */
function buildSheet(wb, sheetName, rows, cols, month, year) {
  const ws = wb.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    views: [{ state: 'frozen', ySplit: 3 }],
  });

  /* ── Colonnes ── */
  ws.columns = [
    { key: 'date',      width: 13 },
    { key: 'catN1',     width: 20 },
    { key: 'depot',     width: 22 },
    { key: 'article',   width: 16 },
    { key: 'design',    width: 38 },
    { key: 'entrees',   width: 16 },
    { key: 'sorties',   width: 16 },
    { key: 'solde',     width: 16 },
    { key: 'stockFin',  width: 16 },
  ];

  const COL_COUNT = 9;

  /* ── Ligne 1 : titre principal ── */
  ws.mergeCells(1, 1, 1, COL_COUNT);
  const titleCell = ws.getCell(1, 1);
  titleCell.value         = sheetName
    ? `📦  Mouvements de stock — ${sheetName}`
    : '📦  Mouvements de stock';
  titleCell.font          = font(C.headerFont, true, 13);
  titleCell.fill          = fill(C.headerBg);
  titleCell.alignment     = align('center', 'middle');
  titleCell.border        = border('FF0A7BAE');
  ws.getRow(1).height     = 28;

  /* ── Ligne 2 : en-têtes colonnes ── */
  const headers = [
    'Date', 'Catalogue N1', 'Dépôt', 'Article', 'Désignation',
    'Entrées', 'Sorties', 'Solde', 'Stock Final',
  ];
  headers.forEach((h, i) => {
    const cell      = ws.getCell(2, i + 1);
    cell.value      = h;
    cell.font       = font(C.subHeaderFont, true, 9);
    cell.fill       = fill(C.subHeaderBg);
    cell.alignment  = align(i >= 5 ? 'right' : 'left', 'middle');
    cell.border     = border();
  });
  ws.getRow(2).height = 20;

  /* ── Regrouper par article ── */
  const byArticle = {};    // { articleCode: [rows...] }
  rows.forEach(row => {
    const artCode = row[cols.article] ?? '(sans code)';
    if (!byArticle[artCode]) byArticle[artCode] = [];
    byArticle[artCode].push(row);
  });

  let currentRow  = 3;      // ligne Excel courante (1-indexed)
  let grandEntrees = 0;
  let grandSorties = 0;
  let grandStockFinal = null;   // dernier stock final global

  /* ── Parcourir chaque article ── */
  Object.entries(byArticle).forEach(([artCode, artRows], artIdx) => {

    /* Trier les lignes de l'article par date croissante */
    artRows.sort((a, b) => new Date(a[cols.date]) - new Date(b[cols.date]));

    const design   = artRows[0][cols.design]   ?? '';
    const catN1    = artRows[0][cols.catN1]    ?? '';
    const depot    = artRows[0][cols.nomDepot] ?? '';

    /* ── Ligne titre article ── */
    ws.mergeCells(currentRow, 1, currentRow, COL_COUNT);
    const artTitleCell       = ws.getCell(currentRow, 1);
    artTitleCell.value       = `  ${artCode}  —  ${design}`;
    artTitleCell.font        = font(C.articleFont, true, 10);
    artTitleCell.fill        = fill(C.articleBg);
    artTitleCell.alignment   = align('left', 'middle');
    artTitleCell.border      = border('FF8CC8E8');
    ws.getRow(currentRow).height = 18;
    currentRow++;

    /* ── Lignes de détail (un par jour) ── */
    let artEntrees   = 0;
    let artSorties   = 0;
    let artLastStock = null;
    const detailStartRow = currentRow;

    artRows.forEach((row, rowIdx) => {
      const entrees   = Number(row[cols.entrees]    ?? 0);
      const sorties   = Number(row[cols.sorties]    ?? 0);
      const solde     = Number(row[cols.solde]      ?? 0);
      const stockFin  = row[cols.stockFinal] !== undefined && row[cols.stockFinal] !== null
        ? Number(row[cols.stockFinal])
        : null;

      artEntrees  += entrees;
      artSorties  += sorties;
      artLastStock = stockFin ?? artLastStock;  // conserver dernier non-null

      const isAlt  = rowIdx % 2 === 1;
      const rowFill = isAlt ? fill(C.altRow) : fill(C.white);

      const setCell = (col, value, options = {}) => {
        const cell       = ws.getCell(currentRow, col);
        cell.value       = value;
        cell.fill        = rowFill;
        cell.border      = border();
        cell.font        = options.font  || font('FF333333', false, 9);
        cell.alignment   = options.align || align('left', 'middle');
        if (options.numFmt) cell.numFmt = options.numFmt;
      };

      /* Date */
      setCell(1, fmtDate(row[cols.date]), { font: font(C.gray, false, 9), align: align('center', 'middle') });

      /* Catalogue N1 */
      setCell(2, row[cols.catN1] ?? '');

      /* Dépôt */
      setCell(3, row[cols.nomDepot] ?? '');

      /* Article */
      setCell(4, row[cols.article] ?? '', { font: font(C.blue, false, 9), align: align('center', 'middle') });

      /* Désignation */
      setCell(5, row[cols.design] ?? '');

      /* Entrées */
      if (entrees > 0) {
        const c      = ws.getCell(currentRow, 6);
        c.value      = entrees;
        c.fill       = fill(C.greenBg);
        c.font       = font(C.green, true, 9);
        c.alignment  = align('right', 'middle');
        c.numFmt     = '#,##0.##';
        c.border     = border();
      } else {
        setCell(6, '—', { align: align('right', 'middle'), font: font('FFDDDDDD', false, 9) });
      }

      /* Sorties */
      if (sorties > 0) {
        const c      = ws.getCell(currentRow, 7);
        c.value      = sorties;
        c.fill       = fill(C.redBg);
        c.font       = font(C.red, true, 9);
        c.alignment  = align('right', 'middle');
        c.numFmt     = '#,##0.##';
        c.border     = border();
      } else {
        setCell(7, '—', { align: align('right', 'middle'), font: font('FFDDDDDD', false, 9) });
      }

      /* Solde */
      const soldeC     = ws.getCell(currentRow, 8);
      soldeC.value     = solde !== 0 ? solde : '—';
      soldeC.fill      = solde > 0 ? fill(C.blueBg) : solde < 0 ? fill(C.redBg) : rowFill;
      soldeC.font      = solde > 0 ? font(C.blue, true, 9) : solde < 0 ? font(C.red, true, 9) : font('FFDDDDDD', false, 9);
      soldeC.alignment = align('right', 'middle');
      soldeC.numFmt    = '#,##0.##';
      soldeC.border    = border();

      /* Stock Final */
      if (stockFin !== null) {
        const c      = ws.getCell(currentRow, 9);
        c.value      = stockFin;
        c.fill       = stockFin > 0 ? fill(C.amberBg) : stockFin < 0 ? fill(C.redBg) : rowFill;
        c.font       = stockFin > 0 ? font(C.amber, true, 9) : stockFin < 0 ? font(C.red, true, 9) : font(C.gray, false, 9);
        c.alignment  = align('right', 'middle');
        c.numFmt     = '#,##0.##';
        c.border     = border();
      } else {
        setCell(9, '—', { align: align('right', 'middle'), font: font('FFDDDDDD', false, 9) });
      }

      currentRow++;
    });

    /* ── Ligne sous-total article ── */
    grandEntrees   += artEntrees;
    grandSorties   += artSorties;
    if (artLastStock !== null) grandStockFinal = artLastStock;

    const subtotalLabels = [
      `Sous-total : ${artCode}`, '', '', '', 'Total article',
    ];
    subtotalLabels.forEach((lbl, i) => {
      const c      = ws.getCell(currentRow, i + 1);
      c.value      = lbl;
      c.fill       = fill(C.subtotalBg);
      c.font       = font(C.subtotalFont, true, 9);
      c.border     = border('FF8CC8E8');
      c.alignment  = align(i >= 4 ? 'right' : 'left', 'middle');
    });

    /* Total Entrées article */
    const stEntrees       = ws.getCell(currentRow, 6);
    stEntrees.value       = artEntrees;
    stEntrees.fill        = fill(C.subtotalBg);
    stEntrees.font        = font(C.green, true, 9);
    stEntrees.alignment   = align('right', 'middle');
    stEntrees.numFmt      = '#,##0.##';
    stEntrees.border      = border('FF8CC8E8');

    /* Total Sorties article */
    const stSorties       = ws.getCell(currentRow, 7);
    stSorties.value       = artSorties;
    stSorties.fill        = fill(C.subtotalBg);
    stSorties.font        = font(C.red, true, 9);
    stSorties.alignment   = align('right', 'middle');
    stSorties.numFmt      = '#,##0.##';
    stSorties.border      = border('FF8CC8E8');

    /* Solde sous-total (vide) */
    const stSolde         = ws.getCell(currentRow, 8);
    stSolde.fill          = fill(C.subtotalBg);
    stSolde.border        = border('FF8CC8E8');

    /* Dernier Stock Final article */
    const stStock         = ws.getCell(currentRow, 9);
    stStock.value         = artLastStock ?? '—';
    stStock.fill          = fill(C.subtotalBg);
    stStock.font          = font(C.amber, true, 9);
    stStock.alignment     = align('right', 'middle');
    stStock.numFmt        = '#,##0.##';
    stStock.border        = border('FF8CC8E8');

    ws.getRow(currentRow).height = 18;
    currentRow++;

    /* Ligne vide séparatrice (sauf dernier article) */
    currentRow++;
  });

  /* ── Ligne grand total ── */
  const totalLabels = ['GRAND TOTAL', '', '', '', 'Total général'];
  totalLabels.forEach((lbl, i) => {
    const c      = ws.getCell(currentRow, i + 1);
    c.value      = lbl;
    c.fill       = fill(C.totalBg);
    c.font       = font(C.totalFont, true, 10);
    c.border     = border('FF0A7BAE');
    c.alignment  = align(i >= 4 ? 'right' : 'left', 'middle');
  });

  const gtEntrees     = ws.getCell(currentRow, 6);
  gtEntrees.value     = grandEntrees;
  gtEntrees.fill      = fill(C.totalBg);
  gtEntrees.font      = font('FF90EEB8', true, 10);
  gtEntrees.alignment = align('right', 'middle');
  gtEntrees.numFmt    = '#,##0.##';
  gtEntrees.border    = border('FF0A7BAE');

  const gtSorties     = ws.getCell(currentRow, 7);
  gtSorties.value     = grandSorties;
  gtSorties.fill      = fill(C.totalBg);
  gtSorties.font      = font('FFFFAAAA', true, 10);
  gtSorties.alignment = align('right', 'middle');
  gtSorties.numFmt    = '#,##0.##';
  gtSorties.border    = border('FF0A7BAE');

  const gtSolde       = ws.getCell(currentRow, 8);
  gtSolde.fill        = fill(C.totalBg);
  gtSolde.border      = border('FF0A7BAE');

  const gtStock       = ws.getCell(currentRow, 9);
  gtStock.value       = grandStockFinal ?? '—';
  gtStock.fill        = fill(C.totalBg);
  gtStock.font        = font('FFFFFFAA', true, 10);
  gtStock.alignment   = align('right', 'middle');
  gtStock.numFmt      = '#,##0.##';
  gtStock.border      = border('FF0A7BAE');

  ws.getRow(currentRow).height = 22;

  /* ── Activation du filtre automatique sur la ligne 2 ── */
  ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: COL_COUNT } };
}

/* ── Sauvegarde du fichier ───────────────────────────────────── */
async function saveWorkbook(wb, dateDebut, dateFin) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  const suffix = dateDebut && dateFin
    ? `${dateDebut}_au_${dateFin}`
    : new Date().toISOString().slice(0, 10);
  a.href       = url;
  a.download   = `stock_${suffix}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}