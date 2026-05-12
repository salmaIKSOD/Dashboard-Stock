import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Filters({ onFilter }) {
  const [bases, setBases]       = useState([]);
  const [depots, setDepots]     = useState([]);
  const [articles, setArticles] = useState([]);

  const [base, setBase]           = useState('');
  const [depot, setDepot]         = useState('');
  const [article, setArticle]     = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin]     = useState('');

  useEffect(() => {
    axios.get(`${API}/bases`).then(r => setBases(r.data));
  }, []);

  useEffect(() => {
    if (!base) return;
    setDepot(''); setArticle('');
    axios.get(`${API}/depots?base=${base}`).then(r => setDepots(r.data));
    axios.get(`${API}/articles?base=${base}`).then(r => setArticles(r.data));
  }, [base]);

  const handleFilter = () => {
    onFilter({ base, depot, article, dateDebut, dateFin });
  };

  return (
    <div className="bg-white border rounded p-3 md:p-4 mb-4">
      {/* Desktop: tous les filtres sur une ligne */}
      <div className="hidden md:flex md:flex-wrap md:gap-3 md:items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500">Base</label>
          <select 
            className="border rounded px-2 py-1.5 text-sm w-full" 
            value={base} 
            onChange={e => setBase(e.target.value)}
          >
            <option value="">-- Toutes --</option>
            {bases.map(b => <option key={b.NomBase} value={b.NomBase}>{b.LibelleBase}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500">Dépôt</label>
          <select 
            className="border rounded px-2 py-1.5 text-sm w-full" 
            value={depot} 
            onChange={e => setDepot(e.target.value)}
          >
            <option value="">-- Tous --</option>
            {depots.map(d => <option key={d.Depot} value={d.Depot}>{d.NomDepot}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500">Article</label>
          <select 
            className="border rounded px-2 py-1.5 text-sm w-full" 
            value={article} 
            onChange={e => setArticle(e.target.value)}
          >
            <option value="">-- Tous --</option>
            {articles.map(a => <option key={a.Article} value={a.Article}>{a.Designation}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
          <label className="text-xs text-gray-500">Date début</label>
          <input 
            type="date" 
            className="border rounded px-2 py-1.5 text-sm w-full" 
            value={dateDebut} 
            onChange={e => setDateDebut(e.target.value)} 
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
          <label className="text-xs text-gray-500">Date fin</label>
          <input 
            type="date" 
            className="border rounded px-2 py-1.5 text-sm w-full" 
            value={dateFin} 
            onChange={e => setDateFin(e.target.value)} 
          />
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleFilter}
            disabled={!dateDebut || !dateFin}
            className={`
              px-4 py-1.5 rounded text-sm text-white font-medium
              transition-colors duration-200 whitespace-nowrap
              ${!dateDebut || !dateFin 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            Filtrer
          </button>
        </div>
      </div>

      {/* Mobile/Tablette: disposition en grille */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Base</label>
            <select 
              className="border rounded px-2 py-1.5 text-sm w-full" 
              value={base} 
              onChange={e => setBase(e.target.value)}
            >
              <option value="">-- Toutes --</option>
              {bases.map(b => <option key={b.NomBase} value={b.NomBase}>{b.LibelleBase}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Dépôt</label>
            <select 
              className="border rounded px-2 py-1.5 text-sm w-full" 
              value={depot} 
              onChange={e => setDepot(e.target.value)}
            >
              <option value="">-- Tous --</option>
              {depots.map(d => <option key={d.Depot} value={d.Depot}>{d.NomDepot}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Article</label>
            <select 
              className="border rounded px-2 py-1.5 text-sm w-full" 
              value={article} 
              onChange={e => setArticle(e.target.value)}
            >
              <option value="">-- Tous --</option>
              {articles.map(a => <option key={a.Article} value={a.Article}>{a.Designation}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Date début</label>
            <input 
              type="date" 
              className="border rounded px-2 py-1.5 text-sm w-full" 
              value={dateDebut} 
              onChange={e => setDateDebut(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Date fin</label>
            <input 
              type="date" 
              className="border rounded px-2 py-1.5 text-sm w-full" 
              value={dateFin} 
              onChange={e => setDateFin(e.target.value)} 
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleFilter}
            disabled={!dateDebut || !dateFin}
            className={`
              w-full sm:w-auto px-4 py-2 rounded text-sm text-white font-medium
              transition-colors duration-200
              ${!dateDebut || !dateFin 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            Filtrer
          </button>
        </div>
      </div>
    </div>
  );
}