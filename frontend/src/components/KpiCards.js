// export default function KpiCards({ data }) {
//   if (!data.length) return null;

//   const totalEntrees   = data.reduce((sum, r) => sum + (r.TotalEntrees || 0), 0);
//   const totalSorties   = data.reduce((sum, r) => sum + (r.TotalSorties || 0), 0);

//   // Stock final = dernière valeur par article+depot
//   const dernierStock = {};
//   data.forEach(r => {
//     const key = `${r.Article}-${r.Depot}`;
//     dernierStock[key] = r.StockFinal;
//   });
//   const totalStockFinal = Object.values(dernierStock).reduce((sum, v) => sum + (v || 0), 0);

//   const cards = [
//     {
//       label: 'Total Entrées',
//       value: totalEntrees.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
//       color: 'bg-green-50 border-green-300 text-green-700',
//       icon: '📥'
//     },
//     {
//       label: 'Total Sorties',
//       value: totalSorties.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
//       color: 'bg-red-50 border-red-300 text-red-700',
//       icon: '📤'
//     },
//     {
//       label: 'Stock Final',
//       value: totalStockFinal.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
//       color: 'bg-blue-50 border-blue-300 text-blue-700',
//       icon: '📦'
//     },
//   ];

//   return (
//     <div className="grid grid-cols-3 gap-4 mb-4">
//       {cards.map(card => (
//         <div key={card.label} className={`border rounded p-4 ${card.color}`}>
//           <div className="text-2xl mb-1">{card.icon}</div>
//           <div className="text-xs font-medium uppercase tracking-wide mb-1">{card.label}</div>
//           <div className="text-2xl font-bold">{card.value}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { ArrowDownCircle, ArrowUpCircle, Package } from 'lucide-react';

export default function KpiCards({ data }) {
  if (!data.length) return null;

  const totalEntrees   = data.reduce((sum, r) => sum + (r.TotalEntrees || 0), 0);
  const totalSorties   = data.reduce((sum, r) => sum + (r.TotalSorties || 0), 0);

  // Stock final = dernière valeur par article+depot
  const dernierStock = {};
  data.forEach(r => {
    const key = `${r.Article}-${r.Depot}`;
    dernierStock[key] = r.StockFinal;
  });
  const totalStockFinal = Object.values(dernierStock).reduce((sum, v) => sum + (v || 0), 0);

  const cards = [
    {
      label: 'Total Entrées',
      value: totalEntrees.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
      color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700 shadow-lg shadow-green-200/50',
      icon: ArrowDownCircle,
      bgIcon: 'bg-green-200/50'
    },
    {
      label: 'Total Sorties',
      value: totalSorties.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
      color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700 shadow-lg shadow-red-200/50',
      icon: ArrowUpCircle,
      bgIcon: 'bg-red-200/50'
    },
    {
      label: 'Stock Final',
      value: totalStockFinal.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700 shadow-lg shadow-blue-200/50',
      icon: Package,
      bgIcon: 'bg-blue-200/50'
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div key={card.label} className={`border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${card.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.bgIcon} backdrop-blur-sm`}>
                <IconComponent className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{card.label}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {card.value}
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">vs période précédente</span>
                <span className="text-green-600 font-medium">↑ 12.5%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}