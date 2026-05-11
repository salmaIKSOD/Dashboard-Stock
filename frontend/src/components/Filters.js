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
    <div className="bg-white border rounded p-4 flex flex-wrap gap-3 items-end mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Base</label>
        <select className="border rounded px-2 py-1 text-sm" value={base} onChange={e => setBase(e.target.value)}>
          <option value="">-- Toutes --</option>
          {bases.map(b => <option key={b.NomBase} value={b.NomBase}>{b.LibelleBase}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Dépôt</label>
        <select className="border rounded px-2 py-1 text-sm" value={depot} onChange={e => setDepot(e.target.value)}>
          <option value="">-- Tous --</option>
          {depots.map(d => <option key={d.Depot} value={d.Depot}>{d.NomDepot}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Article</label>
        <select className="border rounded px-2 py-1 text-sm" value={article} onChange={e => setArticle(e.target.value)}>
          <option value="">-- Tous --</option>
          {articles.map(a => <option key={a.Article} value={a.Article}>{a.Designation}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Date début</label>
        <input type="date" className="border rounded px-2 py-1 text-sm" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Date fin</label>
        <input type="date" className="border rounded px-2 py-1 text-sm" value={dateFin} onChange={e => setDateFin(e.target.value)} />
      </div>

      {/* <button
        onClick={handleFilter}
        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
      >
         Filtrer
      </button> */}
      <button
        onClick={handleFilter}
        disabled={!dateDebut || !dateFin}
        className={`px-4 py-1.5 rounded text-sm text-white ${
            !dateDebut || !dateFin 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        >
        Filtrer
      </button>
    </div>
  );
}