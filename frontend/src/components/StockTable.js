export default function StockTable({ data, loading }) {
  if (loading) return <p className="text-center text-gray-500 mt-8 text-sm md:text-base">Chargement...</p>;
  if (!data.length) return <p className="text-center text-gray-400 mt-8 text-sm md:text-base">Aucune donnée.</p>;

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow sm:rounded-lg">
          <table className="min-w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left">
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap">Date</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap">Article</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap hidden sm:table-cell">Désignation</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap">Dépôt</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap hidden lg:table-cell">Nom Dépôt</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap">Entrées</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap">Sorties</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap hidden md:table-cell">Solde</th>
                <th className="border px-2 md:px-3 py-2 whitespace-nowrap">Stock Final</th>
               </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border px-2 md:px-3 py-1.5 whitespace-nowrap">{row.Date?.slice(0,10)}</td>
                  <td className="border px-2 md:px-3 py-1.5 whitespace-nowrap">{row.Article}</td>
                  <td className="border px-2 md:px-3 py-1.5 hidden sm:table-cell">{row.Designation}</td>
                  <td className="border px-2 md:px-3 py-1.5 whitespace-nowrap">{row.Depot}</td>
                  <td className="border px-2 md:px-3 py-1.5 hidden lg:table-cell">{row.NomDepot}</td>
                  <td className="border px-2 md:px-3 py-1.5 text-green-700 font-medium whitespace-nowrap">
                    {row.TotalEntrees === 0 ? '-' : row.TotalEntrees}
                  </td>
                  <td className="border px-2 md:px-3 py-1.5 text-red-600 font-medium whitespace-nowrap">
                    {row.TotalSorties === 0 ? '-' : row.TotalSorties}
                  </td>
                  <td className="border px-2 md:px-3 py-1.5 hidden md:table-cell">{row.Solde}</td>
                  <td className="border px-2 md:px-3 py-1.5 font-semibold whitespace-nowrap">{row.StockFinal}</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 px-4 md:px-0">{data.length} lignes</p>
    </div>
  );
}