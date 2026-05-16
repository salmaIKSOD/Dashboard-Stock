import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import SidebarP from './components/SidebarP';
import Filters from './components/Filters';
import StockTable from './components/StockTable';
import { fetchStock } from './api/stockApi';

// ── Mini sparkline SVG ───────────────────────────────────────
function Sparkline({ color }) {
  const points = [0, 3, 1, 5, 2, 6, 4, 7, 5, 8, 6, 7, 8, 9];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 80, h = 32;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={coords} stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </svg>
  );
}

// ── Icônes ───────────────────────────────────────────────────
function IconStock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}
function IconEntrees() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function IconSorties() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

// ── Formatteur ───────────────────────────────────────────────
const fmtNum = (n) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n || 0);

const fmtDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

// ── KPI Card ─────────────────────────────────────────────────
function KpiCard({ title, value, unit, bottomContent, icon, iconBg, iconColor, valueColor, sparkColor }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #eeeeee',
      borderRadius: '1rem',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
    }}>
      {/* Haut : icône + texte + sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>

        {/* Icône */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '0.75rem',
          background: iconBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: iconColor, flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Titre + valeur + unité */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#888888', fontSize: '0.8125rem', fontWeight: 500, margin: '0 0 0.3rem' }}>
            {title}
          </p>
          <p style={{ color: valueColor, fontSize: '1.75rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
            {fmtNum(value)}
          </p>
          <p style={{ color: '#bbbbbb', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
            {unit}
          </p>
        </div>

        {/* Sparkline */}
        <div style={{ paddingTop: '0.5rem', flexShrink: 0 }}>
          <Sparkline color={sparkColor} />
        </div>
      </div>

      {/* Bas */}
      <div style={{ borderTop: '1px solid #f5f5f5', marginTop: '0.875rem', paddingTop: '0.625rem' }}>
        {bottomContent}
      </div>
    </div>
  );
}

// ── App principal ─────────────────────────────────────────────
export default function App() {

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [tableData,   setTableData]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [lastFilters, setLastFilters] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilter = async (params) => {
    if (!params) {
      setTableData(null);
      setLastFilters(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setLastFilters(params);
    try {
      const data = await fetchStock(params);
      setTableData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setTableData(null);
    } finally {
      setLoading(false);
    }
  };

  // ── Calcul des KPIs depuis SP_GetStockJournalier ──────────
  // Colonnes disponibles : TotalEntree, TotalSortie,
  //                        StockFinal, ValeurFinale (valeur permanente)
  const kpis = useMemo(() => {
    if (!tableData || tableData.length === 0) return null;

    const keys = Object.keys(tableData[0]);
    const find = (...variants) =>
      keys.find(k =>
        variants.some(v =>
          k.toLowerCase().replace(/[\s_()]/g, '') === v.toLowerCase().replace(/[\s_()]/g, '')
        )
      ) || null;

    const kDate       = find('Date', 'DateJour', 'datejour');
    const kEntrees    = find('TotalEntrees', 'Total Entrees', 'TotalEntree', 'totalentree');
    const kSorties    = find('TotalSorties', 'Total Sorties', 'TotalSortie', 'totalsortie');
    const kStockFinal = find('StockFinal', 'Stock Final', 'stockfinal');
    const kSolde      = find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde');

    // ── 1. Stock total : dernier jour de la période ──────────
    const allDates = tableData
      .map(r => r[kDate] ? new Date(r[kDate]) : null)
      .filter(Boolean);
    const maxDate = allDates.length ? new Date(Math.max(...allDates)) : null;

    const lignesDernierJour = maxDate
      ? tableData.filter(r => {
          if (!r[kDate]) return false;
          return new Date(r[kDate]).toDateString() === maxDate.toDateString();
        })
      : [];

    const stockFinalDernierJour = lignesDernierJour
      .reduce((s, r) => s + Number(r[kStockFinal] ?? 0), 0);

    const valeurPermanenteDernierJour = lignesDernierJour
      .reduce((s, r) => s + Number(r[kSolde] ?? 0), 0);

    // ── 2. Total Entrées sur toute la période ────────────────
    const totalEntrees = tableData
      .reduce((s, r) => s + Number(r[kEntrees] ?? 0), 0);

    // Jour avec le pic d'entrées (max sur un seul jour)
    // On agrège par date d'abord
    const entreesParJour = {};
    tableData.forEach(r => {
      const d = r[kDate] ? fmtDate(r[kDate]) : null;
      if (!d) return;
      entreesParJour[d] = (entreesParJour[d] || 0) + Number(r[kEntrees] ?? 0);
    });
    const picEntreeJour  = Object.entries(entreesParJour)
      .reduce((best, [d, v]) => v > best[1] ? [d, v] : best, ['', 0]);

    // Nombre de jours avec au moins une entrée
    const joursAvecEntrees = Object.values(entreesParJour).filter(v => v > 0).length;

    // ── 3. Total Sorties sur toute la période ────────────────
    const totalSorties = tableData
      .reduce((s, r) => s + Number(r[kSorties] ?? 0), 0);

    // Jour avec le pic de sorties
    const sortiesParJour = {};
    tableData.forEach(r => {
      const d = r[kDate] ? fmtDate(r[kDate]) : null;
      if (!d) return;
      sortiesParJour[d] = (sortiesParJour[d] || 0) + Number(r[kSorties] ?? 0);
    });
    const picSortieJour = Object.entries(sortiesParJour)
      .reduce((best, [d, v]) => v > best[1] ? [d, v] : best, ['', 0]);

    const joursAvecSorties = Object.values(sortiesParJour).filter(v => v > 0).length;

    return {
      // Stock
      stockFinalDernierJour,
      valeurPermanenteDernierJour,
      dateFinalLabel: maxDate ? fmtDate(maxDate) : '',
      // Entrées
      totalEntrees,
      picEntreeJour,
      joursAvecEntrees,
      // Sorties
      totalSorties,
      picSortieJour,
      joursAvecSorties,
    };
  }, [tableData]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f5f7',
      display: 'flex',
      overflow: 'hidden',
    }}>

      <Sidebar open={sidebarOpen} />

      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(13,12,12,0.35)', zIndex: 20 }}
        />
      )}

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        transition: 'margin-left 0.3s ease-in-out',
        marginLeft: sidebarOpen && window.innerWidth >= 1024 ? '240px' : '0',
      }}>

        <SidebarP
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
        />

        <main style={{
          flex: 1,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowX: 'hidden',
        }}>

          <Filters onFilter={handleFilter} />

          {/* Erreur */}
          {error && (
            <div style={{
              background: 'rgba(229,57,53,0.06)',
              border: '1px solid rgba(229,57,53,0.20)',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              color: '#c62828',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e53935', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* ── 3 KPI Cards ── */}
          {kpis && !loading && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

              {/* KPI 1 : Stock total — dernier jour de la période */}
              <KpiCard
                title="Stock total"
                value={kpis.stockFinalDernierJour}
                unit="Unités"
                icon={<IconStock />}
                iconBg="rgba(18,166,224,0.10)"
                iconColor="#12a6e0"
                valueColor="#12a6e0"
                sparkColor="#12a6e0"
                bottomContent={
                  <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.75rem' }}>
                    Valeur permanente au{' '}
                    <span style={{ color: '#555555', fontWeight: 600 }}>
                      {kpis.dateFinalLabel}
                    </span>{' '}:{' '}
                    <span style={{ color: '#12a6e0', fontWeight: 600 }}>
                      {fmtNum(kpis.valeurPermanenteDernierJour)} MAD
                    </span>
                  </p>
                }
              />

              {/* KPI 2 : Total Entrées */}
              <KpiCard
                title="Entrées totales"
                value={kpis.totalEntrees}
                unit="Unités sur la période"
                icon={<IconEntrees />}
                iconBg="rgba(1,168,46,0.10)"
                iconColor="#01a82e"
                valueColor="#01a82e"
                sparkColor="#01a82e"
                bottomContent={
                  <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.75rem' }}>
                    {kpis.joursAvecEntrees > 0 ? (
                      <>
                        Pic le{' '}
                        <span style={{ color: '#555555', fontWeight: 600 }}>
                          {kpis.picEntreeJour[0]}
                        </span>{' '}:{' '}
                        <span style={{ color: '#01a82e', fontWeight: 600 }}>
                          {fmtNum(kpis.picEntreeJour[1])} unités
                        </span>
                        {' '}·{' '}
                        <span style={{ color: '#aaaaaa' }}>
                          {kpis.joursAvecEntrees} jour{kpis.joursAvecEntrees > 1 ? 's' : ''} actif{kpis.joursAvecEntrees > 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <span>Aucune entrée sur la période</span>
                    )}
                  </p>
                }
              />

              {/* KPI 3 : Total Sorties */}
              <KpiCard
                title="Sorties totales"
                value={kpis.totalSorties}
                unit="Unités sur la période"
                icon={<IconSorties />}
                iconBg="rgba(229,57,53,0.10)"
                iconColor="#e53935"
                valueColor="#e53935"
                sparkColor="#e53935"
                bottomContent={
                  <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.75rem' }}>
                    {kpis.joursAvecSorties > 0 ? (
                      <>
                        Pic le{' '}
                        <span style={{ color: '#555555', fontWeight: 600 }}>
                          {kpis.picSortieJour[0]}
                        </span>{' '}:{' '}
                        <span style={{ color: '#e53935', fontWeight: 600 }}>
                          {fmtNum(kpis.picSortieJour[1])} unités
                        </span>
                        {' '}·{' '}
                        <span style={{ color: '#aaaaaa' }}>
                          {kpis.joursAvecSorties} jour{kpis.joursAvecSorties > 1 ? 's' : ''} actif{kpis.joursAvecSorties > 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <span>Aucune sortie sur la période</span>
                    )}
                  </p>
                }
              />
            </div>
          )}

          {/* Tableau */}
          {(loading || tableData !== null) && (
            <StockTable data={tableData} loading={loading} />
          )}

          {/* État initial */}
          {!loading && tableData === null && !error && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 1rem',
              textAlign: 'center',
            }}>
              <div style={{
                width: '4rem', height: '4rem', borderRadius: '1rem',
                background: '#ffffff', border: '1px solid #e8e8e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" style={{ color: '#c5c5c5' }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p style={{ color: '#888888', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 4px' }}>
                Sélectionnez une base et cliquez sur Filtrer
              </p>
              <p style={{ color: '#c5c5c5', fontSize: '0.75rem', margin: 0 }}>
                Le tableau de stock s'affichera ici
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
