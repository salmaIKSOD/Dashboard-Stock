import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import { fetchBases, fetchFiltres } from '../api/stockApi';

// ── Hook responsive ──────────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}

// ── Select avec portal (design code 2) + logique code 1 ──────────
function Select({ label, icon: Icon, value, onChange, options, placeholder, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const updatePos = () => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: r.bottom + window.scrollY + 4,
        left: r.left + window.scrollX,
        width: Math.max(r.width, 280),
      });
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (buttonRef.current && buttonRef.current.contains(e.target)) {
        return;
      }
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        return;
      }
      setOpen(false);
    };
    
    if (open) {
      updatePos();
      document.addEventListener('mousedown', handler);
      window.addEventListener('scroll', updatePos);
      window.addEventListener('resize', updatePos);
    }
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', updatePos);
      window.removeEventListener('resize', updatePos);
    };
  }, [open]);

  const selected = options.find(o => o.value === value);
  const isDisabled = disabled || loading;

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
        {Icon && <Icon size={11} />}
        {label}
      </label>

      <div className="relative w-full">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            if (!isDisabled) {
              updatePos();
              setOpen(prev => !prev);
            }
          }}
          className={`
            w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg
            text-left text-sm transition-[border-color,box-shadow] duration-150 outline-none
            ${open 
              ? 'border-[#12a6e0] shadow-[0_0_0_3px_rgba(18,166,224,0.12)]' 
              : isDisabled 
                ? 'border-[#e0e0e0] bg-[#f5f5f5]' 
                : 'border-[#c5c5c5] bg-white hover:border-[#12a6e0]'
            }
            ${isDisabled ? 'cursor-not-allowed text-[#aaaaaa]' : 'cursor-pointer'}
            ${selected ? 'text-[#0d0c0c]' : 'text-[#aaaaaa]'}
            border
          `}
        >
          <span className="flex-1 truncate">
            {selected ? selected.label : placeholder}
          </span>
          {loading
            ? <Loader2 size={13} className="text-[#12a6e0] flex-shrink-0 animate-spin" />
            : <ChevronDown size={13} className={`
                text-[#c5c5c5] flex-shrink-0 transition-transform duration-200
                ${open ? 'rotate-180' : 'rotate-0'}
              `} />
          }
        </button>

        {open && !isDisabled && createPortal(
          <div 
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: dropdownStyle.top, 
              left: dropdownStyle.left, 
              width: dropdownStyle.width,
              maxWidth: '500px',
            }}
            className="bg-white border border-[#cce8f6] rounded-[0.65rem] shadow-[0_8px_28px_rgba(18,166,224,0.2),0_4px_12px_rgba(0,0,0,0.15)] z-[99999] max-h-[260px] overflow-y-auto"
          >
            <div
              onClick={() => handleSelect('')}
              className={`
                px-4 py-2 text-[13px] cursor-pointer flex items-center justify-between gap-4
                border-b border-[#eef6fb]
                ${!value ? 'bg-[rgba(18,166,224,0.05)]' : 'hover:bg-[#f2faff]'}
              `}
            >
              <span className="italic text-[#999999]">{placeholder}</span>
              {!value && <Check size={13} className="text-[#12a6e0] flex-shrink-0" />}
            </div>

            {options.map(o => (
              <div
                key={o.value}
                onClick={() => handleSelect(o.value)}
                className={`
                  px-4 py-2 text-[13px] cursor-pointer flex items-center justify-between gap-4
                  border-b border-[#f5f9fc] transition-colors
                  ${value === o.value 
                    ? 'bg-[rgba(18,166,224,0.07)] text-[#0d8fc4] font-semibold' 
                    : 'text-[#1a1a1a] hover:bg-[#f2faff]'
                  }
                `}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {value === o.value && <Check size={13} className="text-[#12a6e0] flex-shrink-0" />}
              </div>
            ))}

            {options.length === 0 && (
              <div className="py-4 text-[13px] text-[#c5c5c5] text-center">
                Aucune option disponible
              </div>
            )}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

// ── DateInput inline (design code 2) ─────────────────────────
function DateInputInline({ label, value, onChange, min, max }) {
  const inputRef = useRef(null);
  return (
    <div className="flex items-center gap-[6px] flex-shrink-0">
      <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#12a6e0] whitespace-nowrap">
        <CalendarDays size={11} />
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.showPicker?.()}
        className="flex items-center gap-[6px] py-[0.35rem] px-[0.65rem] rounded-[0.45rem] border border-[#d8d8d8] bg-[#fafafa] cursor-pointer transition-all duration-150 hover:border-[#12a6e0] hover:bg-white hover:shadow-[0_0_0_3px_rgba(18,166,224,0.10)]"
      >
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          max={max}
          className="border-none bg-transparent text-[13px] outline-none cursor-pointer min-w-[130px] w-auto [color-scheme:light]"
          style={{ color: value ? '#0d0c0c' : '#aaaaaa' }}
        />
      </div>
    </div>
  );
}

// ── Composant principal Filters ───────────────────────────────
export default function Filters({ onFilter, initialBase = '', initialDateDebut = '', initialDateFin = '' }) {
  const { isMobile, isTablet } = useBreakpoint();

  const [bases, setBases] = useState([]);
  const [articles, setArticles] = useState([]);
  const [depots, setDepots] = useState([]);
  const [familles, setFamilles] = useState([]);
  const [cat1List, setCat1List] = useState([]);
  const [cat2List, setCat2List] = useState([]);
  const [cat3List, setCat3List] = useState([]);
  const [cat4List, setCat4List] = useState([]);

  const [base, setBase] = useState(initialBase);
  const [article, setArticle] = useState('');
  const [depot, setDepot] = useState('');
  const [famille, setFamille] = useState('');
  const [cat1, setCat1] = useState('');
  const [cat2, setCat2] = useState('');
  const [cat3, setCat3] = useState('');
  const [cat4, setCat4] = useState('');
  const [dateDebut, setDateDebut] = useState(initialDateDebut);
  const [dateFin, setDateFin] = useState(initialDateFin);

  const [loadingBases, setLoadingBases] = useState(true);
  const [loadingFiltres, setLoadingFiltres] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const loadFiltres = useCallback(async (selectedBase, selectedCat1 = null, selectedFamille = null) => {
    if (!selectedBase) return;
    setLoadingFiltres(true);
    try {
      const data = await fetchFiltres(selectedBase, selectedCat1, selectedFamille);
      setArticles((data.articles || []).map(a => ({ value: a.Code, label: `${a.Code} — ${a.Libelle}` })));
      setDepots((data.depots || []).map(d => ({ value: d.Code, label: d.Libelle })));
      setFamilles((data.familles || []).map(f => ({ value: f.Code, label: `${f.Code} — ${f.Libelle}` })));
      setCat1List((data.cat1 || []).map(c => ({ value: c.Code, label: c.Libelle })));
      setCat2List((data.cat2 || []).map(c => ({ value: c.Code, label: c.Libelle })));
      setCat3List((data.cat3 || []).map(c => ({ value: c.Code, label: c.Libelle })));
      setCat4List((data.cat4 || []).map(c => ({ value: c.Code, label: c.Libelle })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFiltres(false);
    }
  }, []);

  useEffect(() => {
    fetchBases()
      .then(data => setBases(data.map(b => ({ value: b.BaseName, label: b.BaseLabel }))))
      .catch(console.error)
      .finally(() => setLoadingBases(false));
  }, []);

  useEffect(() => {
    if (initialBase) loadFiltres(initialBase);
  }, [initialBase, loadFiltres]);

  const handleBaseChange = (val) => {
    setBase(val);
    setArticle(''); 
    setDepot(''); 
    setFamille('');
    setCat1(''); 
    setCat2(''); 
    setCat3(''); 
    setCat4('');
    setArticles([]); 
    setDepots([]); 
    setFamilles([]);
    setCat1List([]); 
    setCat2List([]); 
    setCat3List([]); 
    setCat4List([]);
    if (val) loadFiltres(val);
  };

  const handleFamilleChange = (val) => {
    setFamille(val);
    setArticle('');
    if (base) loadFiltres(base, cat1 || null, val || null);
  };

  const handleCat1Change = (val) => {
    setCat1(val);
    setCat2(''); 
    setCat3(''); 
    setCat4('');
    setArticle('');
    if (base) loadFiltres(base, val || null, famille || null);
  };

  const handleFilter = async () => {
    if (!base) return;
    setIsFiltering(true);
    try {
      await onFilter({
        base,
        dateDebut: dateDebut || null,
        dateFin: dateFin || null,
        depot: depot || null,
        article: article || null,
        fa_codefamille: famille || null,
        cl_no1: cat1 || null,
        cl_no2: cat2 || null,
        cl_no3: cat3 || null,
        cl_no4: cat4 || null,
      });
    } finally {
      setIsFiltering(false);
    }
  };

  const handleReset = () => {
    setBase(initialBase);
    setArticle(''); 
    setDepot(''); 
    setFamille('');
    setCat1(''); 
    setCat2(''); 
    setCat3(''); 
    setCat4('');
    setDateDebut(initialDateDebut);
    setDateFin(initialDateFin);
    setArticles([]); 
    setDepots([]); 
    setFamilles([]);
    setCat1List([]); 
    setCat2List([]); 
    setCat3List([]); 
    setCat4List([]);
    if (initialBase) loadFiltres(initialBase);
    onFilter(null);
  };

  const gridCols = isMobile
    ? 'grid-cols-1'
    : isTablet
    ? 'grid-cols-2'
    : 'grid-cols-[repeat(auto-fill,minmax(240px,1fr))]';

  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.35); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07),0_1px_3px_rgba(0,0,0,0.05)] overflow-visible animate-[fadeSlideIn_0.3s_ease_both]">
        {/* HEADER */}
        <div className="flex items-center flex-wrap gap-3 px-5 py-4 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb] rounded-[1.1rem] rounded-b-none">
          <div className="flex items-center gap-[0.55rem] flex-shrink-0">
            <div className="w-7 h-7 rounded-[0.55rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-md shadow-[rgba(18,166,224,0.30)]">
              <SlidersHorizontal size={13} className="text-white" />
            </div>
            <span className="text-[#0d0c0c] text-[13px] font-bold uppercase tracking-[0.07em]">
              Filtres de recherche
            </span>
          </div>

          {!isMobile && (
            <div className="w-px h-[22px] flex-shrink-0 bg-gradient-to-b from-transparent via-[#c8e8f8] to-transparent" />
          )}

          <div className="flex flex-wrap items-center gap-[0.6rem] flex-1">
            <DateInputInline 
              label="Début" 
              value={dateDebut} 
              onChange={setDateDebut} 
              max={dateFin || undefined} 
            />
            <div className="text-[#c5c5c5] text-xs">→</div>
            <DateInputInline 
              label="Fin" 
              value={dateFin} 
              onChange={setDateFin} 
              min={dateDebut || undefined} 
            />
          </div>

          <div className="flex items-center gap-[0.45rem] flex-wrap ml-auto">
            {famille && (
              <div className="flex items-center gap-[0.4rem] bg-[rgba(124,77,255,0.07)] border border-[rgba(124,77,255,0.20)] rounded-full py-[0.28rem] px-[0.7rem]">
                <Tag size={10} className="text-[#7c4dff]" />
                <span className="text-[#7c4dff] text-[11px] font-semibold">
                  {familles.find(f => f.value === famille)?.label?.split(' — ')[1] || famille}
                </span>
              </div>
            )}
            {base && (
              <div className="flex items-center gap-[0.4rem] bg-[rgba(1,214,58,0.08)] border border-[rgba(1,214,58,0.25)] rounded-full py-[0.28rem] px-[0.7rem]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#01d63a] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                <span className="text-[#01a82e] text-[11px] font-semibold">{base}</span>
              </div>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="p-5">
          <div className={`grid ${gridCols} gap-4`}>
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
              label="Famille"            
              icon={Tag}       
              value={famille} 
              onChange={handleFamilleChange} 
              options={familles} 
              placeholder="Toutes les familles"       
              disabled={!base} 
              loading={loadingFiltres && !familles.length} 
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
          </div>

          {/* FOOTER */}
          <div className={`
            flex gap-[0.65rem] mt-[1.1rem] pt-4 border-t border-[#f0f0f0]
            ${isMobile ? 'flex-col' : 'flex-row items-center'}
          `}>
            <button
              onClick={handleFilter}
              disabled={!base || isFiltering}
              className={`
                flex items-center justify-center gap-[0.45rem] px-[1.35rem] py-[0.58rem] rounded-[0.55rem] text-sm font-semibold
                transition-all duration-200
                ${!base || isFiltering 
                  ? 'bg-[#e8f6fd] text-[#92cfe8] cursor-not-allowed' 
                  : 'bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white shadow-md shadow-[rgba(18,166,224,0.35)] hover:shadow-lg'
                }
              `}
            >
              {isFiltering ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {isFiltering ? 'Chargement…' : 'Filtrer'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-[0.45rem] px-[1.1rem] py-[0.58rem] rounded-[0.55rem] text-sm font-medium bg-[#f5f5f5] text-[#666666] border border-[#e0e0e0] cursor-pointer transition-all duration-200 hover:bg-[#ebebeb] hover:text-[#0d0c0c]"
            >
              <RefreshCw size={14} />
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </>
  );
}