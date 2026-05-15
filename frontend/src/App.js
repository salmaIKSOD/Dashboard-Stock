import React, { useState } from 'react';
import Sidebar  from './components/Sidebar';
import SidebarP from './components/SidebarP';
import Filters  from './components/Filters';
import StockTable from './components/StockTable';
import { fetchStock } from './api/stockApi';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tableData,   setTableData]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [lastFilters, setLastFilters] = useState(null);

  // ── Appelé par Filters quand on clique "Filtrer" ─────────
  const handleFilter = async (params) => {
    if (!params) {
      // Bouton Actualiser → reset
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

  return (
    <div className="min-h-screen bg-[#0b1120] flex">

      {/* ── Sidebar gauche ── */}
      <Sidebar open={sidebarOpen} />

      {/* ── Contenu principal ── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '256px' : '0' }}
      >
        {/* ── Topbar (sous Sidebar) ── */}
        <SidebarP
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
        />

        {/* ── Zone de contenu ── */}
        <main className="flex-1 p-5 space-y-5">

          {/* Filtres */}
          <Filters onFilter={handleFilter} />

          {/* Erreur */}
          {error && (
            <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stats rapides (résumé) */}
          {tableData && tableData.length > 0 && !loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: 'Lignes',
                  value: tableData.length.toLocaleString('fr-FR'),
                  color: 'text-sky-400',
                  bg: 'bg-sky-500/8 border-sky-500/15',
                },
                {
                  label: 'Total Entrées',
                  value: tableData.reduce((s, r) => s + Number(r['Total Entrees'] ?? 0), 0).toLocaleString('fr-FR'),
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/8 border-emerald-500/15',
                },
                {
                  label: 'Total Sorties',
                  value: tableData.reduce((s, r) => s + Number(r['Total Sorties'] ?? 0), 0).toLocaleString('fr-FR'),
                  color: 'text-amber-400',
                  bg: 'bg-amber-500/8 border-amber-500/15',
                },
                {
                  label: 'Articles distincts',
                  value: new Set(tableData.map(r => r['Article'])).size.toLocaleString('fr-FR'),
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/8 border-purple-500/15',
                },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} border rounded-xl px-4 py-3`}>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">{label}</p>
                  <p className={`${color} text-xl font-bold font-mono`}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tableau résultat */}
          {(loading || tableData !== null) && (
            <StockTable data={tableData} loading={loading} />
          )}

          {/* État initial (aucun filtre appliqué) */}
          {!loading && tableData === null && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/15">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <p className="text-white/20 text-sm font-medium">Sélectionnez une base et cliquez sur Filtrer</p>
              <p className="text-white/10 text-xs mt-1">Le tableau de stock s'affichera ici</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}








// import { useState } from 'react';
// import axios from 'axios';
// import Sidebar from './components/Sidebar';
// import Filters from './components/Filters';
// import StockTable from './components/StockTable';
// import KpiCards from './components/KpiCards';

// const API = 'http://localhost:5000/api';

// export default function App() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState('');

//   const handleFilter = async (filters) => {
//     setLoading(true);
//     setError('');
//     setData([]);
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
//       const res = await axios.get(`${API}/stock?${params}`, { timeout: 120000 });
//       setData(res.data);
//     } catch (err) {
//       setError('Erreur : ' + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 p-4 pt-16 md:pt-4 overflow-auto">
//         <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">Mouvements de Stock</h2>
//         <Filters onFilter={handleFilter} />
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-3 md:px-4 py-2 rounded mb-3 text-xs md:text-sm">
//             {error}
//           </div>
//         )}
//         {/* <KpiCards data={data} /> */}
//         <StockTable data={data} loading={loading} />
//       </div>
//     </div>
//   );
// }