// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Database,
//   Plus,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   ServerCrash,
//   Server,
//   RefreshCw,
// } from 'lucide-react';

// export default function GestionBases() {
//   const [bases, setBases]       = useState([]);
//   const [baseName, setBaseName] = useState('');
//   const [loading, setLoading]   = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [message, setMessage]   = useState(null);

//   const fetchBases = async () => {
//     setFetching(true);
//     try {
//       // const res = await axios.get('/api/bases');
//       const res = await axios.get('http://localhost:5000/api/bases');
//       setBases(res.data);
//     } catch {
//       /* silently ignore */
//     } finally {
//       setFetching(false);
//     }
//   };
  

//   useEffect(() => { fetchBases(); }, []);


//   const handleAdd = async () => {
//     if (!baseName) {
//       return setMessage({ type: 'error', text: 'Veuillez entrer le nom de la base.' });
//     }
//     setLoading(true);
//     setMessage(null);
//     try {
//       // const res = await axios.post('/api/bases', 
//         const res = await axios.post('http://localhost:5000/api/bases',{
//         baseName,
//         baseLabel: baseName,
//       });
//       console.log('réponse serveur:', res.data); // ← ici
//       setMessage({ type: 'success', text: res.data.Message });
//       setBaseName('');
//       fetchBases();
//     } catch (err) {
//       console.log('erreur complète:', err.response); // ← et ici
//       setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur serveur.' });
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleRemove = async (name) => {
//     if (!window.confirm(`Désactiver la base ${name} ?`)) return;
//     setLoading(true);
//     try {
//       // const res = await axios.delete(`/api/bases/${name}`);
//       const res = await axios.delete(`http://localhost:5000/api/bases/${name}`);
//       setMessage({ type: 'success', text: res.data.Message });
//       fetchBases();
//     } catch (err) {
//       setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur serveur.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes fadeSlideIn {
//           from { opacity: 0; transform: translateY(-6px); }
//           to   { opacity: 1; transform: translateY(0);    }
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to   { transform: rotate(360deg); }
//         }
//         .animate-spin { animation: spin 1s linear infinite; }
//         .fade-in      { animation: fadeSlideIn 0.3s ease both; }
//       `}</style>

//       <div className="flex flex-col gap-5 fade-in">

//         {/* ── FORMULAIRE AJOUT ── */}
//         <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07),0_1px_3px_rgba(0,0,0,0.05)] overflow-visible">

//           {/* Header */}
//           <div className="flex items-center gap-[0.55rem] px-5 py-4 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb] rounded-[1.1rem] rounded-b-none">
//             <div className="w-7 h-7 rounded-[0.55rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-md shadow-[rgba(18,166,224,0.30)]">
//               <Database size={13} className="text-white" />
//             </div>
//             <span className="text-[#0d0c0c] text-[13px] font-semibold tracking-wide">
//               Ajouter une base SAGE
//             </span>
//           </div>

//           {/* Body */}
//           <div className="p-5">
//             {/* ← grid simplifié : un seul champ + bouton */}
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">

//               {/* Nom SQL */}
//               <div className="flex flex-col gap-[6px]">
//                 <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
//                   <Server size={11} />
//                   Nom de la base SQL
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="ex : PHARMA"
//                   value={baseName}
//                   onChange={e => setBaseName(e.target.value.toUpperCase())}
//                   className="px-3 py-2.5 rounded-lg border border-[#c5c5c5] bg-white text-sm text-[#0d0c0c] placeholder-[#aaaaaa] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] hover:border-[#12a6e0] font-mono"
//                 />
//               </div>

//               {/* Bouton */}
//               <div className="flex flex-col gap-[6px]">
//                 <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-transparent select-none">
//                   &nbsp;
//                 </label>
//                 <button
//                   onClick={handleAdd}
//                   disabled={loading}
//                   className={`
//                     flex items-center justify-center gap-[0.45rem] px-[1.35rem] py-[0.6rem] rounded-lg text-sm font-semibold
//                     transition-all duration-200 whitespace-nowrap
//                     ${loading
//                       ? 'bg-[#e8f6fd] text-[#92cfe8] cursor-not-allowed'
//                       : 'bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white shadow-md shadow-[rgba(18,166,224,0.35)] hover:shadow-lg cursor-pointer active:scale-[0.97]'
//                     }
//                   `}
//                 >
//                   {loading
//                     ? <Loader2 size={14} className="animate-spin" />
//                     : <Plus size={14} />
//                   }
//                   {loading ? 'En cours…' : 'Ajouter'}
//                 </button>
//               </div>
//             </div>

//             {/* Message retour */}
//             {message && (
//               <div className={`
//                 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium border
//                 ${message.type === 'success'
//                   ? 'bg-[rgba(1,214,58,0.05)] border-[rgba(1,168,46,0.20)] text-[#01773d]'
//                   : 'bg-[rgba(229,57,53,0.05)] border-[rgba(229,57,53,0.20)] text-[#c62828]'
//                 }
//               `}>
//                 {message.type === 'success'
//                   ? <CheckCircle2 size={15} className="shrink-0 text-[#01a82e]" />
//                   : <AlertCircle  size={15} className="shrink-0 text-[#e53935]" />
//                 }
//                 {message.text}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── TABLEAU DES BASES ── */}
//         <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

//           {/* Header tableau */}
//           <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
//               <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
//                 Bases enregistrées
//               </span>
//               {!fetching && (
//                 <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
//                   {bases.length} base{bases.length !== 1 ? 's' : ''}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={fetchBases}
//               disabled={fetching}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all hover:bg-[#ebebeb] hover:text-[#0d0c0c] disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <RefreshCw size={12} className={fetching ? 'animate-spin' : ''} />
//               Actualiser
//             </button>
//           </div>

//           {/* Skeleton loading */}
//           {fetching && (
//             <div className="p-5 flex flex-col gap-2">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="h-12 bg-[#f8f8f8] rounded-lg animate-pulse"
//                   style={{ animationDelay: `${i * 60}ms` }} />
//               ))}
//             </div>
//           )}

//           {/* Vide */}
//           {!fetching && bases.length === 0 && (
//             <div className="p-16 text-center">
//               <ServerCrash size={36} className="text-[#e0e0e0] mx-auto mb-3" />
//               <p className="text-[#c5c5c5] text-sm">Aucune base enregistrée.</p>
//             </div>
//           )}

//           {/* Tableau */}
//           {!fetching && bases.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="border-b border-[#f0f0f0]">
//                     {/* ← colonne Libellé supprimée */}
//                     {['Nom SQL', 'Statut', 'Action'].map((h, i) => (
//                       <th
//                         key={h}
//                         className={`px-4 py-3 bg-[#f8f8f8] text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[#888888] ${i === 2 ? 'text-center' : 'text-left'}`}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bases.map((b) => (
//                     <tr
//                       key={b.BaseName}
//                       className="border-b border-[#f8f8f8] transition-colors duration-100 hover:bg-[rgba(18,166,224,0.03)]"
//                     >
//                       {/* Nom SQL */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className="inline-block font-mono text-[0.72rem] text-[#0b7db0] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.15)] rounded-md px-2 py-0.5">
//                           {b.BaseName}
//                         </span>
//                       </td>

//                       {/* Statut */}
//                       <td className="px-4 py-3">
//                         {b.IsActive ? (
//                           <span className="inline-flex items-center gap-1.5 text-[#01773d] text-[0.7rem] font-semibold bg-[rgba(1,168,46,0.07)] border border-[rgba(1,168,46,0.18)] rounded-full px-2.5 py-1">
//                             <CheckCircle2 size={11} />
//                             Active
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1.5 text-[#b71c1c] text-[0.7rem] font-semibold bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-full px-2.5 py-1">
//                             <XCircle size={11} />
//                             Inactive
//                           </span>
//                         )}
//                       </td>

//                       {/* Action */}
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           onClick={() => handleRemove(b.BaseName)}
//                           disabled={loading || !b.IsActive}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] font-semibold
//                             bg-[rgba(229,57,53,0.06)] text-[#c62828] border border-[rgba(229,57,53,0.18)]
//                             cursor-pointer transition-all duration-150
//                             hover:bg-[rgba(229,57,53,0.12)] hover:shadow-[0_1px_6px_rgba(229,57,53,0.18)] active:scale-[0.97]
//                             disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[rgba(229,57,53,0.06)] disabled:hover:shadow-none"
//                         >
//                           <Trash2 size={11} />
//                           Désactiver
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ServerCrash,
  Server,
  RefreshCw,
} from 'lucide-react';

const API = 'http://localhost:5000';

export default function GestionBases() {
  const [bases, setBases]       = useState([]);
  const [baseName, setBaseName] = useState('');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage]   = useState(null);

  // Toujours forcer le rechargement depuis SQL (pas le cache)
  const fetchBases = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API}/api/bases?force=1`);
      setBases(res.data);
    } catch {
      /* silently ignore */
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchBases(); }, []);

  // const handleAdd = async () => {
  //   if (!baseName) {
  //     return setMessage({ type: 'error', text: 'Veuillez entrer le nom de la base.' });
  //   }
  //   setLoading(true);
  //   setMessage(null);
  //   try {
  //     const res = await axios.post(`${API}/api/bases`, {
  //       baseName,
  //       baseLabel: baseName,
  //     });
  //     // Vider le cache Node + SQL
  //     await axios.delete(`${API}/api/cache`);
  //     setMessage({ type: 'success', text: res.data.Message });
  //     setBaseName('');
  //     // Attendre que le warmup finisse puis recharger
  //     setTimeout(() => fetchBases(), 2000);
  //   } catch (err) {
  //     setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur serveur.' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAdd = async () => {
    if (!baseName) {
      return setMessage({ type: 'error', text: 'Veuillez entrer le nom de la base.' });
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(`${API}/api/bases`, {
        baseName,
        baseLabel: baseName,
      });
      setMessage({ type: 'success', text: res.data?.Message || 'Base ajoutée avec succès.' });
      setBaseName('');
      // ✅ Attendre 4s que SP_AddBase + warmup terminent
      setTimeout(() => fetchBases(), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur serveur.' });
    } finally {
      setLoading(false);
    }
  };
  // const handleRemove = async (name) => {
  //   if (!window.confirm(`Désactiver la base ${name} ?`)) return;
  //   setLoading(true);
  //   try {
  //     const res = await axios.delete(`${API}/api/bases/${name}`);
  //     // Vider le cache Node + SQL
  //     await axios.delete(`${API}/api/cache`);
  //     setMessage({ type: 'success', text: res.data.Message });
  //     // Attendre que le warmup finisse puis recharger
  //     setTimeout(() => fetchBases(), 2000);
  //   } catch (err) {
  //     setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur serveur.' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRemove = async (name) => {
    if (!window.confirm(`Désactiver la base ${name} ?`)) return;
    setLoading(true);
    try {
      const res = await axios.delete(`${API}/api/bases/${name}`);
      setMessage({ type: 'success', text: res.data?.Message || 'Base désactivée.' });
      setTimeout(() => fetchBases(), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur serveur.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        .fade-in      { animation: fadeSlideIn 0.3s ease both; }
      `}</style>

      <div className="flex flex-col gap-5 fade-in">

        {/* ── FORMULAIRE AJOUT ── */}
        <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07),0_1px_3px_rgba(0,0,0,0.05)] overflow-visible">

          {/* Header */}
          <div className="flex items-center gap-[0.55rem] px-5 py-4 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb] rounded-[1.1rem] rounded-b-none">
            <div className="w-7 h-7 rounded-[0.55rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-md shadow-[rgba(18,166,224,0.30)]">
              <Database size={13} className="text-white" />
            </div>
            <span className="text-[#0d0c0c] text-[13px] font-semibold tracking-wide">
              Ajouter une base SAGE
            </span>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">

              {/* Nom SQL */}
              <div className="flex flex-col gap-[6px]">
                <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                  <Server size={11} />
                  Nom de la base SQL
                </label>
                <input
                  type="text"
                  placeholder="ex : PHARMA"
                  value={baseName}
                  onChange={e => setBaseName(e.target.value.toUpperCase())}
                  className="px-3 py-2.5 rounded-lg border border-[#c5c5c5] bg-white text-sm text-[#0d0c0c] placeholder-[#aaaaaa] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] hover:border-[#12a6e0] font-mono"
                />
              </div>

              {/* Bouton */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-transparent select-none">
                  &nbsp;
                </label>
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className={`
                    flex items-center justify-center gap-[0.45rem] px-[1.35rem] py-[0.6rem] rounded-lg text-sm font-semibold
                    transition-all duration-200 whitespace-nowrap
                    ${loading
                      ? 'bg-[#e8f6fd] text-[#92cfe8] cursor-not-allowed'
                      : 'bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white shadow-md shadow-[rgba(18,166,224,0.35)] hover:shadow-lg cursor-pointer active:scale-[0.97]'
                    }
                  `}
                >
                  {loading
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Plus size={14} />
                  }
                  {loading ? 'En cours…' : 'Ajouter'}
                </button>
              </div>
            </div>

            {/* Message retour */}
            {message && (
              <div className={`
                mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium border
                ${message.type === 'success'
                  ? 'bg-[rgba(1,214,58,0.05)] border-[rgba(1,168,46,0.20)] text-[#01773d]'
                  : 'bg-[rgba(229,57,53,0.05)] border-[rgba(229,57,53,0.20)] text-[#c62828]'
                }
              `}>
                {message.type === 'success'
                  ? <CheckCircle2 size={15} className="shrink-0 text-[#01a82e]" />
                  : <AlertCircle  size={15} className="shrink-0 text-[#e53935]" />
                }
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* ── TABLEAU DES BASES ── */}
        <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)]">

          {/* Header tableau */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#01d63a]" />
              <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
                Bases enregistrées
              </span>
              {!fetching && (
                <span className="bg-[#f0f0f0] text-[#666666] text-[0.6875rem] font-mono px-2 py-0.5 rounded">
                  {bases.length} base{bases.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={fetchBases}
              disabled={fetching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all hover:bg-[#ebebeb] hover:text-[#0d0c0c] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw size={12} className={fetching ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>

          {/* Skeleton loading */}
          {fetching && (
            <div className="p-5 flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-[#f8f8f8] rounded-lg animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          )}

          {/* Vide */}
          {!fetching && bases.length === 0 && (
            <div className="p-16 text-center">
              <ServerCrash size={36} className="text-[#e0e0e0] mx-auto mb-3" />
              <p className="text-[#c5c5c5] text-sm">Aucune base enregistrée.</p>
            </div>
          )}

          {/* Tableau */}
          {!fetching && bases.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#f0f0f0]">
                    {['Nom SQL', 'Statut', 'Action'].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 bg-[#f8f8f8] text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[#888888] ${i === 2 ? 'text-center' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bases.map((b) => (
                    <tr
                      key={b.BaseName}
                      className="border-b border-[#f8f8f8] transition-colors duration-100 hover:bg-[rgba(18,166,224,0.03)]"
                    >
                      {/* Nom SQL */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-block font-mono text-[0.72rem] text-[#0b7db0] bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.15)] rounded-md px-2 py-0.5">
                          {b.BaseName}
                        </span>
                      </td>

                      {/* Statut */}
                      <td className="px-4 py-3">
                        {b.IsActive ? (
                          <span className="inline-flex items-center gap-1.5 text-[#01773d] text-[0.7rem] font-semibold bg-[rgba(1,168,46,0.07)] border border-[rgba(1,168,46,0.18)] rounded-full px-2.5 py-1">
                            <CheckCircle2 size={11} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#b71c1c] text-[0.7rem] font-semibold bg-[rgba(229,57,53,0.07)] border border-[rgba(229,57,53,0.18)] rounded-full px-2.5 py-1">
                            <XCircle size={11} />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemove(b.BaseName)}
                          disabled={loading || !b.IsActive}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] font-semibold
                            bg-[rgba(229,57,53,0.06)] text-[#c62828] border border-[rgba(229,57,53,0.18)]
                            cursor-pointer transition-all duration-150
                            hover:bg-[rgba(229,57,53,0.12)] hover:shadow-[0_1px_6px_rgba(229,57,53,0.18)] active:scale-[0.97]
                            disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[rgba(229,57,53,0.06)] disabled:hover:shadow-none"
                        >
                          <Trash2 size={11} />
                          Désactiver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}