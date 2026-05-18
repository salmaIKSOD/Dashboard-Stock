import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import SidebarP from './components/SidebarP';
import Filters from './components/Filters';
import StockTable from './components/StockTable';
import { fetchStock } from './api/stockApi';
// App.js — ajout de l'InnerSidebar
import InnerSidebar from './components/InnerSidebar';


// ── Dates par défaut : 1er jour du mois actuel → aujourd'hui ─
function getDefaultDates() {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  return {
    dateDebut: `${yyyy}-${mm}-01`,
    dateFin:   `${yyyy}-${mm}-${dd}`,
  };
}

// ── Sparkline 
function Sparkline({ data = [], color = '#12a6e0' }) {
  const W = 96, H = 36;
  const pts = data.length >= 2 ? data : [2, 5, 3, 8, 6, 9, 7, 11, 9, 13, 10, 12, 14, 13];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const coords = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 5) - 2,
  }));
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x},${c.y}`).join(' ');
  const last = coords[coords.length - 1];
  const first = coords[0];
  const fillPath = `${linePath} L ${last.x},${H} L ${first.x},${H} Z`;
  const gradId = `sg-a-${color.replace('#', '')}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="5"   fill={color} opacity="0.18" />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
    </svg>
  );
}

// ── Icônes 
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

// ── Formatteurs 
const fmtNum = (n) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// ── Hook responsive 
function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return {
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// ── KPI Card 
function KpiCard({ title, value, unit, bottomContent, icon, iconBg, iconColor, valueColor, sparkColor, sparkData }) {
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '0.75rem',
          background: iconBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: iconColor, flexShrink: 0,
        }}>
          {icon}
        </div>
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
        <div style={{ paddingTop: '0.5rem', flexShrink: 0 }}>
          <Sparkline data={sparkData} color={sparkColor} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid #f5f5f5', marginTop: '0.875rem', paddingTop: '0.625rem' }}>
        {bottomContent}
      </div>
    </div>
  );
}

// ── KPI Grid responsive 
function KpiGrid({ children }) {
  const { isMobile, isTablet } = useBreakpoint();

  // Mobile  (<640px)  : 1 colonne
  // Tablette (640–1023px) : 2 colonnes (2+1 centré)
  // Desktop (≥1024px) : 3 colonnes côte à côte (comportement original)
  const gridStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? 'repeat(2, 1fr)'
        : 'repeat(3, 1fr)',
  };

  // Sur tablette, la 3e card prend toute la largeur (centré)
  const items = React.Children.toArray(children);

  if (isTablet && items.length === 3) {
    return (
      <div style={gridStyle}>
        {items[0]}
        {items[1]}
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 'calc(50% - 0.5rem)' }}>
            {items[2]}
          </div>
        </div>
      </div>
    );
  }

  return <div style={gridStyle}>{children}</div>;
}

// ── App principal 
const BASE_PAR_DEFAUT = 'STE_NGDM';

export default function App() {

  // Dans le state  sidebar inner :
const [innerTab, setInnerTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [tableData,   setTableData]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // ── Filtres courants (partagés avec Filters.js via props) ─
  const { dateDebut: defaultDebut, dateFin: defaultFin } = getDefaultDates();
  const [currentFilters, setCurrentFilters] = useState({
    base:      BASE_PAR_DEFAUT,
    dateDebut: defaultDebut,
    dateFin:   defaultFin,
    depot:     null,
    article:   null,
    cl_no1:    null,
    cl_no2:    null,
    cl_no3:    null,
    cl_no4:    null,
  });

  // ── Chargement des données
  const loadData = async (params) => {
    setLoading(true);
    setError(null);
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

  // ── Chargement automatique au démarrage 
  useEffect(() => {
    loadData(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Appelé par Filters quand l'utilisateur clique Filtrer ─
  const handleFilter = async (params) => {
    if (!params) {
      const defaultParams = {
        base:      BASE_PAR_DEFAUT,
        dateDebut: defaultDebut,
        dateFin:   defaultFin,
        depot:     null,
        article:   null,
        cl_no1:    null,
        cl_no2:    null,
        cl_no3:    null,
        cl_no4:    null,
      };
      setCurrentFilters(defaultParams);
      await loadData(defaultParams);
      return;
    }
    setCurrentFilters(params);
    await loadData(params);
  };

  // ── Calcul des KPIs 
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

    const allDates = tableData.map(r => r[kDate] ? new Date(r[kDate]) : null).filter(Boolean);
    const maxDate  = allDates.length ? new Date(Math.max(...allDates)) : null;

    const lignesDernierJour = maxDate
      ? tableData.filter(r => r[kDate] && new Date(r[kDate]).toDateString() === maxDate.toDateString())
      : [];

    const stockFinalDernierJour       = lignesDernierJour.reduce((s, r) => s + Number(r[kStockFinal] ?? 0), 0);
    const valeurPermanenteDernierJour = lignesDernierJour.reduce((s, r) => s + Number(r[kSolde]      ?? 0), 0);

    const totalEntrees = tableData.reduce((s, r) => s + Number(r[kEntrees] ?? 0), 0);
    const totalSorties = tableData.reduce((s, r) => s + Number(r[kSorties] ?? 0), 0);

    const entreesParJour = {};
    const sortiesParJour = {};
    const stockParJour   = {};

    tableData.forEach(r => {
      const d = r[kDate] ? fmtDate(r[kDate]) : null;
      if (!d) return;
      entreesParJour[d] = (entreesParJour[d] || 0) + Number(r[kEntrees]    ?? 0);
      sortiesParJour[d] = (sortiesParJour[d] || 0) + Number(r[kSorties]    ?? 0);
      stockParJour[d]   = (stockParJour[d]   || 0) + Number(r[kStockFinal] ?? 0);
    });

    const parse = s => { const [dd, mm, yy] = s.split('/'); return new Date(`${yy}-${mm}-${dd}`); };
    const sortedDates = Object.keys(entreesParJour).sort((a, b) => parse(a) - parse(b));

    const picEntreeJour    = Object.entries(entreesParJour).reduce((best, [d, v]) => v > best[1] ? [d, v] : best, ['', 0]);
    const picSortieJour    = Object.entries(sortiesParJour).reduce((best, [d, v]) => v > best[1] ? [d, v] : best, ['', 0]);
    const joursAvecEntrees = Object.values(entreesParJour).filter(v => v > 0).length;
    const joursAvecSorties = Object.values(sortiesParJour).filter(v => v > 0).length;

    return {
      stockFinalDernierJour,
      valeurPermanenteDernierJour,
      dateFinalLabel: maxDate ? fmtDate(maxDate) : '',
      totalEntrees,
      totalSorties,
      picEntreeJour,
      picSortieJour,
      joursAvecEntrees,
      joursAvecSorties,
      sparkStock:   sortedDates.map(d => stockParJour[d]   || 0),
      sparkEntrees: sortedDates.map(d => entreesParJour[d] || 0),
      sparkSorties: sortedDates.map(d => sortiesParJour[d] || 0),
    };
  }, [tableData]);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', display: 'flex', overflow: 'hidden' }}>

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

         {/* Layout horizontal : InnerSidebar + contenu */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <InnerSidebar activeKey={innerTab} onSelect={setInnerTab} />

        <main style={{
          flex: 1,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowX: 'hidden',
        }}>

          <Filters
            onFilter={handleFilter}
            initialBase={BASE_PAR_DEFAUT}
            initialDateDebut={defaultDebut}
            initialDateFin={defaultFin}
          />

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

          {/* ── 3 KPI Cards responsive ── */}
          {kpis && !loading && (
            <KpiGrid>
              <KpiCard
                title="Stock total"
                value={kpis.stockFinalDernierJour}
                unit="Unités"
                icon={<IconStock />}
                iconBg="rgba(18,166,224,0.10)"
                iconColor="#12a6e0"
                valueColor="#12a6e0"
                sparkColor="#12a6e0"
                sparkData={kpis.sparkStock}
                bottomContent={
                  <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.75rem' }}>
                    Valeur permanente au{' '}
                    <span style={{ color: '#555555', fontWeight: 600 }}>{kpis.dateFinalLabel}</span>
                    {' '}:{' '}
                    <span style={{ color: '#12a6e0', fontWeight: 600 }}>{fmtNum(kpis.valeurPermanenteDernierJour)} MAD</span>
                  </p>
                }
              />

              <KpiCard
                title="Entrées totales"
                value={kpis.totalEntrees}
                unit="Unités sur la période"
                icon={<IconEntrees />}
                iconBg="rgba(1,168,46,0.10)"
                iconColor="#01a82e"
                valueColor="#01a82e"
                sparkColor="#01a82e"
                sparkData={kpis.sparkEntrees}
                bottomContent={
                  <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.75rem' }}>
                    {kpis.joursAvecEntrees > 0 ? (
                      <>
                        Pic le{' '}
                        <span style={{ color: '#555555', fontWeight: 600 }}>{kpis.picEntreeJour[0]}</span>
                        {' '}:{' '}
                        <span style={{ color: '#01a82e', fontWeight: 600 }}>{fmtNum(kpis.picEntreeJour[1])} unités</span>
                        {' '}·{' '}
                        <span style={{ color: '#aaaaaa' }}>{kpis.joursAvecEntrees} jour{kpis.joursAvecEntrees > 1 ? 's' : ''} actif{kpis.joursAvecEntrees > 1 ? 's' : ''}</span>
                      </>
                    ) : (
                      <span>Aucune entrée sur la période</span>
                    )}
                  </p>
                }
              />

              <KpiCard
                title="Sorties totales"
                value={kpis.totalSorties}
                unit="Unités sur la période"
                icon={<IconSorties />}
                iconBg="rgba(229,57,53,0.10)"
                iconColor="#e53935"
                valueColor="#e53935"
                sparkColor="#e53935"
                sparkData={kpis.sparkSorties}
                bottomContent={
                  <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.75rem' }}>
                    {kpis.joursAvecSorties > 0 ? (
                      <>
                        Pic le{' '}
                        <span style={{ color: '#555555', fontWeight: 600 }}>{kpis.picSortieJour[0]}</span>
                        {' '}:{' '}
                        <span style={{ color: '#e53935', fontWeight: 600 }}>{fmtNum(kpis.picSortieJour[1])} unités</span>
                        {' '}·{' '}
                        <span style={{ color: '#aaaaaa' }}>{kpis.joursAvecSorties} jour{kpis.joursAvecSorties > 1 ? 's' : ''} actif{kpis.joursAvecSorties > 1 ? 's' : ''}</span>
                      </>
                    ) : (
                      <span>Aucune sortie sur la période</span>
                    )}
                  </p>
                }
              />
            </KpiGrid>
          )}

          {/* Tableau */}
          {(loading || tableData !== null) && (
            <StockTable data={tableData} loading={loading} />
          )}

          {/* Aucun résultat après chargement */}
          {!loading && tableData !== null && tableData.length === 0 && !error && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '4rem 1rem', textAlign: 'center',
            }}>
              <p style={{ color: '#888888', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
                Aucune donnée pour cette période ou ces filtres.
              </p>
            </div>
          )}

        </main>
        </div>
      </div>
    </div>
  );
}

