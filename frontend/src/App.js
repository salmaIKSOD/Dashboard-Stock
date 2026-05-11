import { useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Filters from './components/Filters';
import StockTable from './components/StockTable';

const API = 'http://localhost:5000/api';

export default function App() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await axios.get(`${API}/stock?${params}`);
      setData(res.data);
    } catch (err) {
      alert('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tableau de bord de Stock</h2>
        <Filters onFilter={handleFilter} />
        <StockTable data={data} loading={loading} />
      </div>
    </div>
  );
}