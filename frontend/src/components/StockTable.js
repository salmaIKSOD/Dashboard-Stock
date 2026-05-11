export default function StockTable({ data, loading }) {
  if (loading) return <p className="text-center text-gray-500 mt-8">Chargement...</p>;
  if (!data.length) return <p className="text-center text-gray-400 mt-8">Aucune donnée.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-left">
            {['Date','Article','Désignation','Dépôt','Nom Dépôt','Entrées','Sorties','Solde','Stock Final'].map(h => (
              <th key={h} className="border px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border px-3 py-1">{row.Date?.slice(0,10)}</td>
              <td className="border px-3 py-1">{row.Article}</td>
              <td className="border px-3 py-1">{row.Designation}</td>
              <td className="border px-3 py-1">{row.Depot}</td>
              <td className="border px-3 py-1">{row.NomDepot}</td>
              <td className="border px-3 py-1 text-green-700 font-medium">{row.TotalEntrees}</td>
              <td className="border px-3 py-1 text-red-600 font-medium">{row.TotalSorties}</td>
              <td className="border px-3 py-1">{row.Solde}</td>
              <td className="border px-3 py-1 font-semibold">{row.StockFinal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">{data.length} lignes</p>
    </div>
  );
}