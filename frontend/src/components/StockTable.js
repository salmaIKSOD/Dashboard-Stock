import React, { useMemo, useState, useEffect } from 'react';
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

function StockBadge({ value }) {
  if (value === null || value === undefined || value === '') {
    return <span style={{ color: '#c5c5c5' }}>—</span>;
  }
  const v = Number(value);
  if (isNaN(v)) return <span style={{ color: '#c5c5c5' }}>—</span>;
  if (v > 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#01a82e', fontWeight: 600 }}>
      <TrendingUp size={11} /> {fmtNum(v)}
    </span>
  );
  if (v < 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#e53935', fontWeight: 600 }}>
      <TrendingDown size={11} /> {fmtNum(v)}
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#c5c5c5' }}>
      <Minus size={11} /> 0
    </span>
  );
}

function Th({ label, colKey, sortKey, sortDir, onSort, align = 'left' }) {
  const active = sortKey === colKey;
  const isRight = align === 'right';
  return (
    <th
      onClick={() => colKey && onSort(colKey)}
      style={{
        padding: '0.75rem 1rem',
        textAlign: align,
        cursor: colKey ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        background: '#f8f8f8',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        justifyContent: isRight ? 'flex-end' : 'flex-start',
      }}>
        {colKey && isRight && (
          <span style={{ color: active ? '#12a6e0' : '#c5c5c5' }}>
            {active
              ? (sortDir === 'asc' ? <ArrowUp size={11} style={{ color: '#12a6e0' }} /> : <ArrowDown size={11} style={{ color: '#12a6e0' }} />)
              : <ArrowUpDown size={11} />
            }
          </span>
        )}
        <span style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: active ? '#12a6e0' : '#888888',
          transition: 'color 0.15s',
        }}>
          {label}
        </span>
        {colKey && !isRight && (
          <span style={{ color: active ? '#12a6e0' : '#c5c5c5' }}>
            {active
              ? (sortDir === 'asc' ? <ArrowUp size={11} style={{ color: '#12a6e0' }} /> : <ArrowDown size={11} style={{ color: '#12a6e0' }} />)
              : <ArrowUpDown size={11} />
            }
          </span>
        )}
      </div>
    </th>
  );
}

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
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page,    setPage]    = useState(1);
  const PAGE_SIZE = 50;

  const cols = useMemo(() => detectColumns(data), [data]);

  useEffect(() => { setPage(1); }, [data]);

  const sorted = useMemo(() => {
    if (!data || !data.length) return [];
    if (!sortKey) return data;
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

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#12a6e0', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '12px', width: '160px', background: '#f0f0f0', borderRadius: '4px' }} />
        </div>
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              height: '40px',
              background: '#f8f8f8',
              borderRadius: '8px',
              animationDelay: `${i * 50}ms`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  // Vide
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: '1rem',
        padding: '4rem',
        textAlign: 'center',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      }}>
        <PackageX size={36} style={{ color: '#e0e0e0', margin: '0 auto 0.75rem' }} />
        <p style={{ color: '#c5c5c5', fontSize: '0.875rem' }}>
          Aucun résultat — ajustez vos filtres et cliquez sur Filtrer
        </p>
      </div>
    );
  }

  const pageBtnBase = {
    padding: '0.375rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    background: '#f5f5f5',
    color: '#666666',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.15s',
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8e8e8',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#01d63a' }} />
          <span style={{ color: '#0d0c0c', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Résultats
          </span>
          <span style={{
            background: '#f0f0f0',
            color: '#666666',
            fontSize: '0.6875rem',
            fontFamily: 'monospace',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            {sorted.length.toLocaleString('fr-FR')} lignes
          </span>
        </div>
        <button
          onClick={() => exportCSV(sorted, cols)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            background: '#f5f5f5',
            color: '#666666',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#eaeaea'; e.currentTarget.style.color = '#0d0c0c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666666'; }}
        >
          <Download size={12} />
          Exporter CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '100px' }} /> {/* Date */}
            <col style={{ width: '120px' }} /> {/* Catalogue N1 */}
            <col style={{ width: '70px'  }} /> {/* Dépôt */}
            <col style={{ width: '130px' }} /> {/* Nom Dépôt */}
            <col style={{ width: '100px' }} /> {/* Article */}
            <col style={{ width: '180px' }} /> {/* Nom Article */}
            <col style={{ width: '110px' }} /> {/* Total Entrées */}
            <col style={{ width: '110px' }} /> {/* Total Sorties */}
            <col style={{ width: '110px' }} /> {/* Solde */}
            <col style={{ width: '110px' }} /> {/* Stock Final */}
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <Th label="Date"          colKey={cols.date}       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <Th label="Catalogue N1" />
              <Th label="Dépôt"         colKey={cols.depot}      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
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
                <tr key={idx}
                  style={{
                    borderBottom: '1px solid #f8f8f8',
                    transition: 'background 0.1s',
                    opacity: hasMvt ? 1 : 0.75,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = hasMvt ? 'rgba(18,166,224,0.04)' : '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Date */}
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#888888', whiteSpace: 'nowrap' }}>
                    {fmtDate(row[cols.date])}
                  </td>

                  {/* Catalogue N1 */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {row[cols.catN1]
                      ? <span style={{
                          display: 'inline-block',
                          background: 'rgba(18,166,224,0.08)',
                          color: '#0b7db0',
                          fontSize: '0.6875rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(18,166,224,0.18)',
                          whiteSpace: 'nowrap',
                        }}>
                          {row[cols.catN1]}
                        </span>
                      : <span style={{ color: '#e0e0e0' }}>—</span>
                    }
                  </td>

                  {/* Dépôt */}
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#888888' }}>
                    {row[cols.depot] ?? '—'}
                  </td>

                  {/* Nom Dépôt */}
                  <td style={{ padding: '0.75rem 1rem', color: '#555555', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {row[cols.nomDepot] ?? '—'}
                  </td>

                  {/* Article */}
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#12a6e0' }}>
                    {row[cols.article] ?? '—'}
                  </td>

                  {/* Nom Article */}
                  <td style={{ padding: '0.75rem 1rem', color: '#444444', fontSize: '0.75rem', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    title={row[cols.design]}>
                    {row[cols.design] ?? '—'}
                  </td>

                  {/* Total Entrées */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    {entrees > 0
                      ? <span style={{ color: '#01a82e', fontWeight: 600 }}>{fmtNum(entrees)}</span>
                      : <span style={{ color: '#e0e0e0', fontSize: '0.75rem' }}>—</span>
                    }
                  </td>

                  {/* Total Sorties */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    {sorties > 0
                      ? <span style={{ color: '#e08a00', fontWeight: 600 }}>{fmtNum(sorties)}</span>
                      : <span style={{ color: '#e0e0e0', fontSize: '0.75rem' }}>—</span>
                    }
                  </td>

                  {/* Solde */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: solde > 0 ? '#12a6e0' : solde < 0 ? '#e53935' : '#c5c5c5',
                    }}>
                      {fmtNum(solde)}
                    </span>
                  </td>

                  {/* Stock Final */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid #f0f0f0',
        }}>
          <span style={{ color: '#c5c5c5', fontSize: '0.75rem' }}>
            Page {page} / {totalPages}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...pageBtnBase, opacity: page === 1 ? 0.35 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (page !== 1) { e.currentTarget.style.background = '#eaeaea'; e.currentTarget.style.color = '#0d0c0c'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666666'; }}
            >
              ← Préc.
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    border: page === p ? 'none' : '1px solid #e0e0e0',
                    background: page === p ? '#12a6e0' : '#f5f5f5',
                    color: page === p ? '#ffffff' : '#666666',
                    fontWeight: page === p ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ ...pageBtnBase, opacity: page === totalPages ? 0.35 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (page !== totalPages) { e.currentTarget.style.background = '#eaeaea'; e.currentTarget.style.color = '#0d0c0c'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666666'; }}
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

