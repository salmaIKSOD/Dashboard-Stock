import React, { useEffect, useState, useCallback } from 'react';
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
} from 'lucide-react';
import { fetchBases, fetchFiltres } from '../api/stockApi';

// ── Composant Select réutilisable ────────────────────────────
function Select({ label, icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
        {Icon && <Icon size={11} />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled || loading}
          className={`
            w-full appearance-none bg-[#1a2235] border rounded-lg px-3 py-2.5
            text-sm pr-8 outline-none transition-all cursor-pointer
            ${disabled || loading
              ? 'border-white/5 text-white/20 cursor-not-allowed'
              : 'border-white/10 text-white/70 hover:border-sky-500/40 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20'
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          {loading
            ? <Loader2 size={13} className="text-sky-400 animate-spin" />
            : <ChevronDown size={13} className="text-white/25" />
          }
        </div>
      </div>
    </div>
  );
}

// ── Composant Input date ─────────────────────────────────────
function DateInput({ label, value, onChange, min, max }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
        <CalendarDays size={11} />
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
        className="
          w-full bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5
          text-sm text-white/70 outline-none transition-all
          hover:border-sky-500/40 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
          [color-scheme:dark]
        "
      />
    </div>
  );
}

// ── Composant principal Filters ──────────────────────────────
export default function Filters({ onFilter }) {
  // --- États des listes ---
  const [bases,    setBases]    = useState([]);
  const [articles, setArticles] = useState([]);
  const [depots,   setDepots]   = useState([]);
  const [cat1List, setCat1List] = useState([]);
  const [cat2List, setCat2List] = useState([]);
  const [cat3List, setCat3List] = useState([]);
  const [cat4List, setCat4List] = useState([]);

  // --- États des valeurs sélectionnées ---
  const [base,      setBase]      = useState('');
  const [article,   setArticle]   = useState('');
  const [depot,     setDepot]     = useState('');
  const [cat1,      setCat1]      = useState('');
  const [cat2,      setCat2]      = useState('');
  const [cat3,      setCat3]      = useState('');
  const [cat4,      setCat4]      = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin,   setDateFin]   = useState('');

  // --- Loading ---
  const [loadingBases,   setLoadingBases]   = useState(true);
  const [loadingFiltres, setLoadingFiltres] = useState(false);
  const [isFiltering,    setIsFiltering]    = useState(false);

  // ── Chargement des bases au montage ─────────────────────────
  useEffect(() => {
    fetchBases()
      .then(data => {
        setBases(data.map(b => ({ value: b.BaseName, label: b.BaseLabel })));
      })
      .catch(console.error)
      .finally(() => setLoadingBases(false));
  }, []);

  // ── Chargement des filtres quand la base ou cat1 change ─────
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

  // Quand la base change
  const handleBaseChange = (val) => {
    setBase(val);
    setArticle(''); setDepot('');
    setCat1(''); setCat2(''); setCat3(''); setCat4('');
    setArticles([]); setDepots([]);
    setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
    if (val) loadFiltres(val);
  };

  // Quand Cat1 change → re-filtrer Cat2, Cat3, Cat4, Articles
  const handleCat1Change = (val) => {
    setCat1(val);
    setCat2(''); setCat3(''); setCat4('');
    setArticle('');
    if (base) loadFiltres(base, val || null);
  };

  // ── Bouton Filtrer ───────────────────────────────────────────
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

  // ── Bouton Actualiser (réinitialiser) ────────────────────────
  const handleReset = () => {
    setBase(''); setArticle(''); setDepot('');
    setCat1(''); setCat2(''); setCat3(''); setCat4('');
    setDateDebut(''); setDateFin('');
    setArticles([]); setDepots([]);
    setCat1List([]); setCat2List([]); setCat3List([]); setCat4List([]);
    onFilter(null);
  };

  return (
    <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-5 shadow-xl shadow-black/20">

      {/* Titre section */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
        <Search size={14} className="text-sky-400" />
        <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
          Filtres de recherche
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {/* ── Base ── */}
        <Select
          label="Base SAGE"
          icon={Database}
          value={base}
          onChange={handleBaseChange}
          options={bases}
          placeholder="Sélectionner une base"
          loading={loadingBases}
        />

        {/* ── Catalogue N1 ── */}
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

        {/* ── Catalogue N2 ── */}
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

        {/* ── Catalogue N3 ── */}
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

        {/* ── Catalogue N4 ── */}
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

        {/* ── Article ── */}
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

        {/* ── Dépôt ── */}
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

        {/* ── Date début ── */}
        <DateInput
          label="Date début"
          value={dateDebut}
          onChange={setDateDebut}
          max={dateFin || undefined}
        />

        {/* ── Date fin ── */}
        <DateInput
          label="Date fin"
          value={dateFin}
          onChange={setDateFin}
          min={dateDebut || undefined}
        />
      </div>

      {/* ── Boutons ── */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
        <button
          onClick={handleFilter}
          disabled={!base || isFiltering}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-200
            ${!base || isFiltering
              ? 'bg-sky-500/10 text-sky-400/30 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30'
            }
          `}
        >
          {isFiltering
            ? <Loader2 size={15} className="animate-spin" />
            : <Search size={15} />
          }
          {isFiltering ? 'Chargement…' : 'Filtrer'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
            bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80
            border border-white/8 hover:border-white/15 transition-all duration-200"
        >
          <RefreshCw size={15} />
          Actualiser
        </button>

        {/* Indicateur base sélectionnée */}
        {base && (
          <div className="ml-auto flex items-center gap-2 bg-sky-500/8 border border-sky-500/15 rounded-lg px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-400 text-xs font-medium">{base}</span>
          </div>
        )}
      </div>
    </div>
  );
}