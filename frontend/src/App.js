import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import SidebarP from './components/SidebarP';
import Filters from './components/Filters';
import StockTable from './components/StockTable';
import { fetchStock } from './api/stockApi';

export default function App() {

  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 1024
  );

  const [tableData,   setTableData]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [lastFilters, setLastFilters] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
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

  const statCards = tableData && tableData.length > 0 && !loading
    ? [
        {
          label: 'Lignes',
          value: tableData.length.toLocaleString('fr-FR'),
          accent: '#12a6e0',
          bg: 'rgba(18,166,224,0.07)',
          border: 'rgba(18,166,224,0.18)',
        },
        {
          label: 'Total Entrées',
          value: tableData.reduce((s, r) => s + Number(r['Total Entrees'] ?? 0), 0).toLocaleString('fr-FR'),
          accent: '#01a82e',
          bg: 'rgba(1,214,58,0.07)',
          border: 'rgba(1,214,58,0.20)',
        },
        {
          label: 'Total Sorties',
          value: tableData.reduce((s, r) => s + Number(r['Total Sorties'] ?? 0), 0).toLocaleString('fr-FR'),
          accent: '#e08a00',
          bg: 'rgba(224,138,0,0.07)',
          border: 'rgba(224,138,0,0.20)',
        },
        {
          label: 'Articles distincts',
          value: new Set(tableData.map(r => r['Article'])).size.toLocaleString('fr-FR'),
          accent: '#7c4dff',
          bg: 'rgba(124,77,255,0.07)',
          border: 'rgba(124,77,255,0.18)',
        },
      ]
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f5f7',
      display: 'flex',
      overflow: 'hidden',
    }}>

      {/* Sidebar gauche */}
      <Sidebar open={sidebarOpen} />

      {/* Overlay mobile */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(13,12,12,0.35)',
            zIndex: 20,
          }}
        />
      )}

      {/* Contenu principal */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.3s ease-in-out',
          marginLeft: sidebarOpen && window.innerWidth >= 1024 ? '240px' : '0',
        }}
      >

        {/* Topbar */}
        <SidebarP
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
        />

        {/* Zone contenu */}
        <main style={{
          flex: 1,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowX: 'hidden',
        }}>

          {/* Filtres */}
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

          {/* Stats rapides */}
          {statCards && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
            }}>
              {statCards.map(({ label, value, accent, bg, border }) => (
                <div key={label} style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderLeft: `3px solid ${accent}`,
                }}>
                  <p style={{
                    color: '#888888',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.09em',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    marginTop: 0,
                  }}>
                    {label}
                  </p>
                  <p style={{
                    color: accent,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    margin: 0,
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tableau résultat */}
          {(loading || tableData !== null) && (
            <StockTable
              data={tableData}
              loading={loading}
            />
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
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                background: '#ffffff',
                border: '1px solid #e8e8e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ color: '#c5c5c5' }}
                >
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


