// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Database,
//   Layers,
//   Package,
//   Warehouse,
//   CalendarDays,
//   Search,
//   RefreshCw,
//   ChevronDown,
//   Loader2,
// } from 'lucide-react';
// import { fetchBases, fetchFiltres } from '../api/stockApi';

// // ── Composant Select réutilisable ────────────────────────────
// function Select({ label, icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
//         {Icon && <Icon size={11} />}
//         {label}
//       </label>
//       <div className="relative">
//         <select
//           value={value}
//           onChange={e => onChange(e.target.value)}
//           disabled={disabled || loading}
//           className={`
//             w-full appearance-none bg-[#1a2235] border rounded-lg px-3 py-2.5
//             text-sm pr-8 outline-none transition-all cursor-pointer
//             ${disabled || loading
//               ? 'border-white/5 text-white/20 cursor-not-allowed'
//               : 'border-white/10 text-white/70 hover:border-sky-500/40 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20'
//             }
//           `}
//         >
//           <option value="">{placeholder}</option>
//           {options.map(o => (
//             <option key={o.value} value={o.value}>
//               {o.label}
//             </option>
//           ))}
//         </select>
//         <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
//           {loading
//             ? <Loader2 size={13} className="text-sky-400 animate-spin" />
//             : <ChevronDown size={13} className="text-white/25" />
//           }
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Composant Input date ─────────────────────────────────────
// function DateInput({ label, value, onChange, min, max }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
//         <CalendarDays size={11} />
//         {label}
//       </label>
//       <input
//         type="date"
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         min={min}
//         max={max}
//         className="
//           w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5
//           text-sm text-white/70 outline-none transition-all
//           hover:border-sky-500/40 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
//           [color-scheme:dark]
//         "
//       />
//     </div>
//   );
// }

// // ── Composant principal Filters ──────────────────────────────
// export default function Filters({ onFilter }) {
//   // --- États des listes ---
//   const [bases,    setBases]    = useState([]);
//   const [articles, setArticles] = useState([]);
//   const [depots,   setDepots]   = useState([]);
//   const [cat1List, setCat1List] = useState([]);
//   const [cat2List, setCat2List] = useState([]);
//   const [cat3List, setCat3List] = useState([]);
//   const [cat4List, setCat4List] = useState([]);

//   // --- États des valeurs sélectionnées ---
//   const [base,      setBase]      = useState('');
//   const [article,   setArticle]   = useState('');
//   const [depot,     setDepot]     = useState('');
//   const [cat1,      setCat1]      = useState('');
//   const [cat2,      setCat2]      = useState('');
//   const [cat3,      setCat3]      = useState('');
//   const [cat4,      setCat4]      = useState('');
//   const [dateDebut, setDateDebut] = useState('');
//   const [dateFin,   setDateFin]   = useState('');

//   // --- Loading ---
//   const [loadingBases,   setLoadingBases]   = useState(true);
//   const [loadingFiltres, setLoadingFiltres] = useState(false);
//   const [isFiltering,    setIsFiltering]    = useState(false);

//   // ── Chargement des bases au montage ─────────────────────────
//   useEffect(() => {
//     fetchBases()
//       .then(data => {
//         setBases(data.map(b => ({ value: b.BaseName, label: b.BaseLabel })));
//       })
//       .catch(console.error)
//       .finally(() => setLoadingBases(false));
//   }, []);

//   // ── Chargement des filtres quand la base ou cat1 change ─────
//   const loadFiltres = useCallback(async (selectedBase, selectedCat1 = null) => {
//     if (!selectedBase) return;
//     setLoadingFiltres(true);
//     try {
//       const data = await fetchFiltres(selectedBase, selectedCat1 || null);
//       setArticles((data.articles || []).map(a => ({ value: a.Code, label: `${a.Code} — ${a.Libelle}` })));
//       setDepots  ((data.depots   || []).map(d => ({ value: d.Code, label: d.Libelle })));
//       setCat1List((data.cat1     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//       setCat2List((data.cat2     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//       setCat3List((data.cat3     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//       setCat4List((data.cat4     || []).map(c => ({ value: c.Code, label: c.Libelle })));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingFiltres(false);
//     }
//   }, []);

//   // Quand la base change
//   const handleBaseChange = (val) => {
//     setBase(val);
//     setArticle(''); setDepot('');
//     setCat1(''); setCat2(''); setCat3(''); setCat4('');
//     setArticles([]); setDepots([]);
//     setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
//     if (val) loadFiltres(val);
//   };

//   // Quand Cat1 change → re-filtrer Cat2, Cat3, Cat4, Articles
//   const handleCat1Change = (val) => {
//     setCat1(val);
//     setCat2(''); setCat3(''); setCat4('');
//     setArticle('');
//     if (base) loadFiltres(base, val || null);
//   };

//   // ── Bouton Filtrer ───────────────────────────────────────────
//   const handleFilter = async () => {
//     if (!base) return;
//     setIsFiltering(true);
//     try {
//       await onFilter({
//         base,
//         dateDebut: dateDebut || null,
//         dateFin:   dateFin   || null,
//         depot:     depot     || null,
//         article:   article   || null,
//         cl_no1:    cat1      || null,
//         cl_no2:    cat2      || null,
//         cl_no3:    cat3      || null,
//         cl_no4:    cat4      || null,
//       });
//     } finally {
//       setIsFiltering(false);
//     }
//   };

//   // ── Bouton Actualiser (réinitialiser) ────────────────────────
//   const handleReset = () => {
//     setBase(''); setArticle(''); setDepot('');
//     setCat1(''); setCat2(''); setCat3(''); setCat4('');
//     setDateDebut(''); setDateFin('');
//     setArticles([]); setDepots([]);
//     setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
//     onFilter(null);
//   };

//   return (
//     <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-5 shadow-xl shadow-black/20">

//       {/* Titre section */}
//       <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
//         <Search size={14} className="text-sky-400" />
//         <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
//           Filtres de recherche
//         </span>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

//         {/* ── Base ── */}
//         <Select
//           label="Base SAGE"
//           icon={Database}
//           value={base}
//           onChange={handleBaseChange}
//           options={bases}
//           placeholder="Sélectionner une base"
//           loading={loadingBases}
//         />

//         {/* ── Catalogue N1 ── */}
//         <Select
//           label="Catalogue Niveau 1"
//           icon={Layers}
//           value={cat1}
//           onChange={handleCat1Change}
//           options={cat1List}
//           placeholder="Tous les catalogues N1"
//           disabled={!base}
//           loading={loadingFiltres && !cat1List.length}
//         />

//         {/* ── Catalogue N2 ── */}
//         <Select
//           label="Catalogue Niveau 2"
//           icon={Layers}
//           value={cat2}
//           onChange={setCat2}
//           options={cat2List}
//           placeholder="Tous les catalogues N2"
//           disabled={!base}
//           loading={loadingFiltres && !cat2List.length}
//         />

//         {/* ── Catalogue N3 ── */}
//         <Select
//           label="Catalogue Niveau 3"
//           icon={Layers}
//           value={cat3}
//           onChange={setCat3}
//           options={cat3List}
//           placeholder="Tous les catalogues N3"
//           disabled={!base}
//           loading={loadingFiltres && !cat3List.length}
//         />

//         {/* ── Catalogue N4 ── */}
//         <Select
//           label="Catalogue Niveau 4"
//           icon={Layers}
//           value={cat4}
//           onChange={setCat4}
//           options={cat4List}
//           placeholder="Tous les catalogues N4"
//           disabled={!base}
//           loading={loadingFiltres && !cat4List.length}
//         />

//         {/* ── Article ── */}
//         <Select
//           label="Article"
//           icon={Package}
//           value={article}
//           onChange={setArticle}
//           options={articles}
//           placeholder="Tous les articles"
//           disabled={!base}
//           loading={loadingFiltres && !articles.length}
//         />

//         {/* ── Dépôt ── */}
//         <Select
//           label="Dépôt"
//           icon={Warehouse}
//           value={depot}
//           onChange={setDepot}
//           options={depots}
//           placeholder="Tous les dépôts"
//           disabled={!base}
//           loading={loadingFiltres && !depots.length}
//         />

//         {/* ── Date début ── */}
//         <DateInput
//           label="Date début"
//           value={dateDebut}
//           onChange={setDateDebut}
//           max={dateFin || undefined}
//         />

//         {/* ── Date fin ── */}
//         <DateInput
//           label="Date fin"
//           value={dateFin}
//           onChange={setDateFin}
//           min={dateDebut || undefined}
//         />
//       </div>

//       {/* ── Boutons ── */}
//       <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
//         <button
//           onClick={handleFilter}
//           disabled={!base || isFiltering}
//           className={`
//             flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
//             transition-all duration-200
//             ${!base || isFiltering
//               ? 'bg-sky-500/10 text-sky-400/30 cursor-not-allowed'
//               : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30'
//             }
//           `}
//         >
//           {isFiltering
//             ? <Loader2 size={15} className="animate-spin" />
//             : <Search size={15} />
//           }
//           {isFiltering ? 'Chargement…' : 'Filtrer'}
//         </button>

//         <button
//           onClick={handleReset}
//           className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
//             bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80
//             border border-white/8 hover:border-white/15 transition-all duration-200"
//         >
//           <RefreshCw size={15} />
//           Actualiser
//         </button>

//         {/* Indicateur base sélectionnée */}
//         {base && (
//           <div className="ml-auto flex items-center gap-2 bg-sky-500/8 border border-sky-500/15 rounded-lg px-3 py-1.5">
//             <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
//             <span className="text-sky-400 text-xs font-medium">{base}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Database,
  Layers,
  Package,
  Warehouse,
  CalendarDays,
  Search,
  RefreshCw,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react';
import { fetchBases, fetchFiltres } from '../api/stockApi';

// ── Composant Select custom (dropdown 100% clair) ────────────
function Select({ label, icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fermer si clic dehors
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);
  const isDisabled = disabled || loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} ref={ref}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#12a6e0',
      }}>
        {Icon && <Icon size={11} />}
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => !isDisabled && setOpen(o => !o)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.5rem',
            border: `1px solid ${open ? '#12a6e0' : isDisabled ? '#e0e0e0' : '#c5c5c5'}`,
            background: isDisabled ? '#f5f5f5' : '#ffffff',
            color: isDisabled ? '#aaaaaa' : selected ? '#0d0c0c' : '#aaaaaa',
            fontSize: '0.875rem',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            outline: 'none',
            boxShadow: open ? '0 0 0 3px rgba(18,166,224,0.12)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        >
          <span style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {selected ? selected.label : placeholder}
          </span>
          {loading
            ? <Loader2 size={13} style={{ color: '#12a6e0', flexShrink: 0 }} className="animate-spin" />
            : <ChevronDown size={13} style={{
                color: '#c5c5c5',
                flexShrink: 0,
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }} />
          }
        </button>

        {/* Dropdown list */}
        {open && !isDisabled && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            zIndex: 1000,
            maxHeight: '220px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#e0e0e0 transparent',
          }}>
            {/* Option "vide" */}
            <div
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: '#aaaaaa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f5f5f5',
                background: !value ? 'rgba(18,166,224,0.05)' : 'transparent',
              }}
              onMouseEnter={e => { if (value) e.currentTarget.style.background = '#f8f8f8'; }}
              onMouseLeave={e => { if (value) e.currentTarget.style.background = 'transparent'; }}
            >
              {placeholder}
              {!value && <Check size={13} style={{ color: '#12a6e0' }} />}
            </div>

            {/* Options */}
            {options.map(o => (
              <div
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  color: value === o.value ? '#12a6e0' : '#0d0c0c',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: value === o.value ? 'rgba(18,166,224,0.06)' : 'transparent',
                  fontWeight: value === o.value ? 500 : 400,
                }}
                onMouseEnter={e => { if (value !== o.value) e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={e => { if (value !== o.value) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {o.label}
                </span>
                {value === o.value && <Check size={13} style={{ color: '#12a6e0', flexShrink: 0, marginLeft: '8px' }} />}
              </div>
            ))}

            {options.length === 0 && (
              <div style={{ padding: '0.75rem', fontSize: '0.8125rem', color: '#c5c5c5', textAlign: 'center' }}>
                Aucune option
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Composant Input date ─────────────────────────────────────
function DateInput({ label, value, onChange, min, max }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#12a6e0',
      }}>
        <CalendarDays size={11} />
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
        style={{
          width: '100%',
          background: '#ffffff',
          border: '1px solid #c5c5c5',
          borderRadius: '0.5rem',
          padding: '0.625rem 0.75rem',
          fontSize: '0.875rem',
          color: '#0d0c0c',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          colorScheme: 'light',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#12a6e0';
          e.target.style.boxShadow = '0 0 0 3px rgba(18,166,224,0.12)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#c5c5c5';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

// ── Composant principal Filters ──────────────────────────────
export default function Filters({ onFilter }) {
  const [bases,    setBases]    = useState([]);
  const [articles, setArticles] = useState([]);
  const [depots,   setDepots]   = useState([]);
  const [cat1List, setCat1List] = useState([]);
  const [cat2List, setCat2List] = useState([]);
  const [cat3List, setCat3List] = useState([]);
  const [cat4List, setCat4List] = useState([]);

  const [base,      setBase]      = useState('');
  const [article,   setArticle]   = useState('');
  const [depot,     setDepot]     = useState('');
  const [cat1,      setCat1]      = useState('');
  const [cat2,      setCat2]      = useState('');
  const [cat3,      setCat3]      = useState('');
  const [cat4,      setCat4]      = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin,   setDateFin]   = useState('');

  const [loadingBases,   setLoadingBases]   = useState(true);
  const [loadingFiltres, setLoadingFiltres] = useState(false);
  const [isFiltering,    setIsFiltering]    = useState(false);

  useEffect(() => {
    fetchBases()
      .then(data => {
        setBases(data.map(b => ({ value: b.BaseName, label: b.BaseLabel })));
      })
      .catch(console.error)
      .finally(() => setLoadingBases(false));
  }, []);

  const loadFiltres = useCallback(async (selectedBase, selectedCat1 = null) => {
    if (!selectedBase) return;
    setLoadingFiltres(true);
    try {
      const data = await fetchFiltres(selectedBase, selectedCat1 || null);
      setArticles((data.articles || []).map(a => ({ value: a.Code, label: `${a.Code} — ${a.Libelle}` })));
      setDepots  ((data.depots   || []).map(d => ({ value: d.Code, label: d.Libelle })));
      setCat1List((data.cat1     || []).map(c => ({ value: c.Code, label: c.Libelle })));
      setCat2List((data.cat2     || []).map(c => ({ value: c.Code, label: c.Libelle })));
      setCat3List((data.cat3     || []).map(c => ({ value: c.Code, label: c.Libelle })));
      setCat4List((data.cat4     || []).map(c => ({ value: c.Code, label: c.Libelle })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFiltres(false);
    }
  }, []);

  const handleBaseChange = (val) => {
    setBase(val);
    setArticle(''); setDepot('');
    setCat1(''); setCat2(''); setCat3(''); setCat4('');
    setArticles([]); setDepots([]);
    setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
    if (val) loadFiltres(val);
  };

  const handleCat1Change = (val) => {
    setCat1(val);
    setCat2(''); setCat3(''); setCat4('');
    setArticle('');
    if (base) loadFiltres(base, val || null);
  };

  const handleFilter = async () => {
    if (!base) return;
    setIsFiltering(true);
    try {
      await onFilter({
        base,
        dateDebut: dateDebut || null,
        dateFin:   dateFin   || null,
        depot:     depot     || null,
        article:   article   || null,
        cl_no1:    cat1      || null,
        cl_no2:    cat2      || null,
        cl_no3:    cat3      || null,
        cl_no4:    cat4      || null,
      });
    } finally {
      setIsFiltering(false);
    }
  };

  const handleReset = () => {
    setBase(''); setArticle(''); setDepot('');
    setCat1(''); setCat2(''); setCat3(''); setCat4('');
    setDateDebut(''); setDateFin('');
    setArticles([]); setDepots([]);
    setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
    onFilter(null);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8e8e8',
      borderRadius: '1rem',
      padding: '1.25rem',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    }}>

      {/* Titre section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <Search size={14} style={{ color: '#12a6e0' }} />
        <span style={{
          color: '#0d0c0c',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Filtres de recherche
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>

        <Select
          label="Base SAGE"
          icon={Database}
          value={base}
          onChange={handleBaseChange}
          options={bases}
          placeholder="Sélectionner une base"
          loading={loadingBases}
        />

        <Select
          label="Catalogue Niveau 1"
          icon={Layers}
          value={cat1}
          onChange={handleCat1Change}
          options={cat1List}
          placeholder="Tous les catalogues N1"
          disabled={!base}
          loading={loadingFiltres && !cat1List.length}
        />

        <Select
          label="Catalogue Niveau 2"
          icon={Layers}
          value={cat2}
          onChange={setCat2}
          options={cat2List}
          placeholder="Tous les catalogues N2"
          disabled={!base}
          loading={loadingFiltres && !cat2List.length}
        />

        <Select
          label="Catalogue Niveau 3"
          icon={Layers}
          value={cat3}
          onChange={setCat3}
          options={cat3List}
          placeholder="Tous les catalogues N3"
          disabled={!base}
          loading={loadingFiltres && !cat3List.length}
        />

        <Select
          label="Catalogue Niveau 4"
          icon={Layers}
          value={cat4}
          onChange={setCat4}
          options={cat4List}
          placeholder="Tous les catalogues N4"
          disabled={!base}
          loading={loadingFiltres && !cat4List.length}
        />

        <Select
          label="Article"
          icon={Package}
          value={article}
          onChange={setArticle}
          options={articles}
          placeholder="Tous les articles"
          disabled={!base}
          loading={loadingFiltres && !articles.length}
        />

        <Select
          label="Dépôt"
          icon={Warehouse}
          value={depot}
          onChange={setDepot}
          options={depots}
          placeholder="Tous les dépôts"
          disabled={!base}
          loading={loadingFiltres && !depots.length}
        />

        <DateInput
          label="Date début"
          value={dateDebut}
          onChange={setDateDebut}
          max={dateFin || undefined}
        />

        <DateInput
          label="Date fin"
          value={dateFin}
          onChange={setDateFin}
          min={dateDebut || undefined}
        />
      </div>

      {/* Boutons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid #f0f0f0',
      }}>
        <button
          onClick={handleFilter}
          disabled={!base || isFiltering}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: 'none',
            cursor: !base || isFiltering ? 'not-allowed' : 'pointer',
            background: !base || isFiltering ? '#e8f6fd' : '#12a6e0',
            color: !base || isFiltering ? '#92cfe8' : '#ffffff',
            boxShadow: !base || isFiltering ? 'none' : '0 2px 8px rgba(18,166,224,0.30)',
            transition: 'all 0.2s',
          }}
        >
          {isFiltering
            ? <Loader2 size={15} className="animate-spin" />
            : <Search size={15} />
          }
          {isFiltering ? 'Chargement…' : 'Filtrer'}
        </button>

        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: '#f5f5f5',
            color: '#666666',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ebebeb'; e.currentTarget.style.color = '#0d0c0c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#666666'; }}
        >
          <RefreshCw size={15} />
          Actualiser
        </button>

        {/* Indicateur base sélectionnée */}
        {base && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(1,214,58,0.08)',
            border: '1px solid rgba(1,214,58,0.25)',
            borderRadius: '0.5rem',
            padding: '0.375rem 0.75rem',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#01d63a',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ color: '#01a82e', fontSize: '0.75rem', fontWeight: 500 }}>{base}</span>
          </div>
        )}
      </div>
    </div>
  );
}