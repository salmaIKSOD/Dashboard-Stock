import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3, TrendingUp, PieChart as PieIcon, DollarSign,
  CalendarDays, Database, Layers, Tag, PackageX,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

// ── Palette identique au reste de l'appli ─────────────────────
const C = {
  blue:        '#12a6e0',
  blueLight:   'rgba(18,166,224,0.10)',
  blueMid:     'rgba(18,166,224,0.25)',
  green:       '#01a82e',
  greenLight:  'rgba(1,168,46,0.10)',
  red:         '#e53935',
  redLight:    'rgba(229,57,53,0.10)',
  amber:       '#e08a00',
  amberLight:  'rgba(224,138,0,0.10)',
  purple:      '#7c4dff',
  purpleLight: 'rgba(124,77,255,0.10)',
  teal:        '#00897b',
  tealLight:   'rgba(0,137,123,0.10)',
  gray:        '#888888',
  border:      '#f0f0f0',
  bg:          '#f4f5f7',
  white:       '#ffffff',
  text:        '#0d0c0c',
  textMuted:   '#888888',
};

// Palette pour le donut catalogue
const CAT_COLORS = ['#12a6e0','#01a82e','#7c4dff','#e08a00','#e53935','#00897b','#f06292','#546e7a'];

// ── Helpers ───────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '';
  const s = typeof d === 'string' ? d : new Date(d).toISOString();
  const [y, m, dd] = s.slice(0, 10).split('-');
  return `${dd}/${m}`;
};

const fmtNum = (n) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(n ?? 0);

const fmtValeur = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
  return fmtNum(n);
};

// ── Tooltip personnalisé ──────────────────────────────────────
function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-lg px-4 py-3 text-[12px]">
      {label && <p className="text-[#888888] mb-1.5 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[#555555]">{p.name} :</span>
          <span className="font-semibold text-[#0d0c0c]">{fmtNum(p.value)}{unit}</span>
        </div>
      ))}
    </div>
  );
}

function ValeurTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-lg px-4 py-3 text-[12px]">
      {label && <p className="text-[#888888] mb-1.5 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[#555555]">{p.name} :</span>
          <span className="font-semibold text-[#0d0c0c]">{fmtValeur(p.value)} MAD</span>
        </div>
      ))}
    </div>
  );
}

// ── Card container ────────────────────────────────────────────
function ChartCard({ icon: Icon, iconColor, iconBg, title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.05)] flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f4f4f4]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-[#0d0c0c] text-[13px] font-semibold m-0 leading-tight">{title}</p>
          {subtitle && <p className="text-[#aaaaaa] text-[11px] m-0 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-5">{children}</div>
    </div>
  );
}

// ── État vide ─────────────────────────────────────────────────
function EmptyState({ message = 'Aucune donnée — lancez un filtrage depuis le tableau de bord' }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <PackageX size={32} className="text-[#e0e0e0]" />
      <p className="text-[#c5c5c5] text-[13px] text-center max-w-[240px] leading-relaxed">{message}</p>
    </div>
  );
}

// ── Bandeau contexte (identique à PageMouvements) ─────────────
function ContextBanner({ filters }) {
  const fmtShort = (d) => {
    if (!d) return '';
    const [y, m, dd] = d.split('-');
    return `${dd}/${m}/${y}`;
  };

  return (
    <div className="bg-white border border-[#e4e4e4] rounded-[1.1rem] shadow-[0_2px_12px_rgba(18,166,224,0.07)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#f8fcff] to-[#f0f9ff] border-b border-[#e8f4fb]">
        <div className="w-6 h-6 rounded-[0.45rem] bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] flex items-center justify-center shadow-sm">
          <BarChart3 size={12} className="text-white" />
        </div>
        <span className="text-[#0d0c0c] text-[13px] font-semibold tracking-wide">Graphiques</span>
        <span className="text-[#c5c5c5] text-[11px] ml-1">— Contexte du tableau de bord</span>
      </div>
      <div className="px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {filters?.base && (
            <div className="flex items-center gap-1.5 bg-[rgba(1,214,58,0.07)] border border-[rgba(1,214,58,0.22)] rounded-full px-3 py-1.5">
              <Database size={11} className="text-[#01a82e]" />
              <span className="text-[#01a82e] text-[11px] font-bold uppercase tracking-wide">{filters.base}</span>
            </div>
          )}
          {filters?.dateDebut && filters?.dateFin && (
            <div className="flex items-center gap-1.5 bg-[rgba(18,166,224,0.07)] border border-[rgba(18,166,224,0.22)] rounded-full px-3 py-1.5">
              <CalendarDays size={11} className="text-[#12a6e0]" />
              <span className="text-[#0b7db0] text-[11px] font-semibold">
                {fmtShort(filters.dateDebut)} → {fmtShort(filters.dateFin)}
              </span>
            </div>
          )}
          {filters?.fa_codefamille && (
            <div className="flex items-center gap-1.5 bg-[rgba(124,77,255,0.07)] border border-[rgba(124,77,255,0.22)] rounded-full px-3 py-1.5">
              <Tag size={11} className="text-[#7c4dff]" />
              <span className="text-[#7c4dff] text-[11px] font-semibold">{filters.fa_codefamille}</span>
            </div>
          )}
          {filters?.cl_no1 && (
            <div className="flex items-center gap-1.5 bg-[rgba(224,138,0,0.07)] border border-[rgba(224,138,0,0.22)] rounded-full px-3 py-1.5">
              <Layers size={11} className="text-[#e08a00]" />
              <span className="text-[#e08a00] text-[11px] font-semibold">Cat N1 : {filters.cl_no1}</span>
            </div>
          )}
          {!filters?.base && (
            <span className="text-[#c5c5c5] text-[12px] italic">
              Filtrez depuis le tableau de bord pour afficher les graphiques.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  GRAPHIQUE 1 — Évolution entrées / sorties par jour
// ════════════════════════════════════════════════════════════════
function ChartEvolution({ data }) {
  const chartData = useMemo(() => {
    if (!data || !data.length) return [];

    const keys = Object.keys(data[0]);
    const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;

    const kDate    = find('Date', 'DateJour');
    const kEntrees = find('TotalEntrees', 'Total Entrees', 'TotalEntree');
    const kSorties = find('TotalSorties', 'Total Sorties', 'TotalSortie');

    const byDay = {};
    for (const r of data) {
      const raw = r[kDate];
      if (!raw) continue;
      const d = typeof raw === 'string' ? raw.slice(0, 10) : new Date(raw).toISOString().slice(0, 10);
      if (!byDay[d]) byDay[d] = { date: d, entrées: 0, sorties: 0 };
      byDay[d].entrées += Number(r[kEntrees] ?? 0);
      byDay[d].sorties += Number(r[kSorties] ?? 0);
    }

    return Object.values(byDay)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(r => ({ ...r, label: fmtDate(r.date) }));
  }, [data]);

  if (!chartData.length) return <EmptyState />;

  // Sous-échantillonnage si trop de points
  const step = Math.max(1, Math.floor(chartData.length / 60));
  const display = chartData.filter((_, i) => i % step === 0);

  const totalE = chartData.reduce((s, r) => s + r.entrées, 0);
  const totalS = chartData.reduce((s, r) => s + r.sorties, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Mini KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[rgba(1,168,46,0.05)] border border-[rgba(1,168,46,0.15)] rounded-xl px-4 py-3">
          <p className="text-[#aaaaaa] text-[10px] uppercase tracking-wide m-0 mb-0.5">Total entrées</p>
          <p className="text-[#01a82e] text-[1.2rem] font-bold m-0">{fmtNum(totalE)}</p>
        </div>
        <div className="bg-[rgba(229,57,53,0.05)] border border-[rgba(229,57,53,0.15)] rounded-xl px-4 py-3">
          <p className="text-[#aaaaaa] text-[10px] uppercase tracking-wide m-0 mb-0.5">Total sorties</p>
          <p className="text-[#e53935] text-[1.2rem] font-bold m-0">{fmtNum(totalS)}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={display} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradE" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.green} stopOpacity={0.18} />
              <stop offset="95%" stopColor={C.green} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.red} stopOpacity={0.18} />
              <stop offset="95%" stopColor={C.red} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: C.textMuted }}
            tickLine={false}
            axisLine={{ stroke: C.border }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: C.textMuted }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtValeur}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: C.text }}>{v}</span>}
          />
          <Area
            type="monotone" dataKey="entrées" name="Entrées"
            stroke={C.green} strokeWidth={2}
            fill="url(#gradE)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone" dataKey="sorties" name="Sorties"
            stroke={C.red} strokeWidth={2}
            fill="url(#gradS)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  GRAPHIQUE 2 — Top 10 articles mouvementés
// ════════════════════════════════════════════════════════════════
function ChartTop10({ data }) {
  const [mode, setMode] = useState('entrees'); // 'entrees' | 'sorties' | 'total'

  const chartData = useMemo(() => {
    if (!data || !data.length) return [];

    const keys = Object.keys(data[0]);
    const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;

    const kArticle = find('Article', 'AR_Ref');
    const kDesign  = find('Designation', 'AR_Design', 'Désignation');
    const kEntrees = find('TotalEntrees', 'Total Entrees', 'TotalEntree');
    const kSorties = find('TotalSorties', 'Total Sorties', 'TotalSortie');

    const byArticle = {};
    for (const r of data) {
      const code = r[kArticle] ?? '?';
      if (!byArticle[code]) byArticle[code] = { code, name: r[kDesign] ?? code, entrées: 0, sorties: 0 };
      byArticle[code].entrées += Number(r[kEntrees] ?? 0);
      byArticle[code].sorties += Number(r[kSorties] ?? 0);
    }

    return Object.values(byArticle)
      .map(a => ({ ...a, total: a.entrées + a.sorties }))
      .sort((a, b) => b[mode === 'total' ? 'total' : mode] - a[mode === 'total' ? 'total' : mode])
      .slice(0, 10)
      .reverse(); // recharts BarChart horizontal : reverse pour afficher le plus grand en haut
  }, [data, mode]);

  if (!chartData.length) return <EmptyState />;

  const barColor = mode === 'entrees' ? C.green : mode === 'sorties' ? C.red : C.blue;
  const barBg    = mode === 'entrees' ? C.greenLight : mode === 'sorties' ? C.redLight : C.blueLight;

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setMode(id)}
      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
        mode === id
          ? 'bg-[#12a6e0] text-white shadow-sm'
          : 'text-[#888888] hover:bg-[#f0f0f0] hover:text-[#0d0c0c]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#f8f8f8] border border-[#eeeeee] rounded-xl p-1 w-fit">
        <TabBtn id="entrees" label="Entrées" />
        <TabBtn id="sorties" label="Sorties" />
        <TabBtn id="total"   label="Total" />
      </div>

      <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 34)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 8, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: C.textMuted }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtValeur}
          />
          <YAxis
            type="category"
            dataKey="code"
            width={72}
            tick={{ fontSize: 10, fill: C.blue, fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: barBg }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const row = chartData.find(r => r.code === label);
              return (
                <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-lg px-4 py-3 text-[12px]">
                  <p className="font-semibold text-[#0d0c0c] mb-1">{label}</p>
                  {row?.name && row.name !== label && (
                    <p className="text-[#888888] text-[11px] mb-1.5 truncate max-w-[220px]">{row.name}</p>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span style={{ color: C.green }}>Entrées : <b>{fmtNum(row?.entrées)}</b></span>
                    <span style={{ color: C.red }}>Sorties : <b>{fmtNum(row?.sorties)}</b></span>
                    <span style={{ color: C.blue }}>Total : <b>{fmtNum(row?.total)}</b></span>
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey={mode === 'total' ? 'total' : mode} name={mode} fill={barColor} radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={barColor} fillOpacity={0.85 + (i / chartData.length) * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  GRAPHIQUE 3 — Répartition par catalogue N1 (donut)
// ════════════════════════════════════════════════════════════════
function ChartCatalogueN1({ data }) {
  const [hovered, setHovered] = useState(null);
  const [mode, setMode] = useState('stock'); // 'stock' | 'entrees' | 'sorties'

  const chartData = useMemo(() => {
    if (!data || !data.length) return [];

    const keys = Object.keys(data[0]);
    const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;

    const kCatN1    = find('CatN1', 'Cat N1', 'CL_Intitule1', 'clintitule1');
    const kEntrees  = find('TotalEntrees', 'Total Entrees', 'TotalEntree');
    const kSorties  = find('TotalSorties', 'Total Sorties', 'TotalSortie');
    const kSolde    = find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde');
    const kStock    = find('StockFinal', 'Stock Final');

    const byCat = {};
    for (const r of data) {
      const cat = r[kCatN1] || 'Sans catalogue';
      if (!byCat[cat]) byCat[cat] = { name: cat, entrées: 0, sorties: 0, stock: 0, valeur: 0 };
      byCat[cat].entrées += Number(r[kEntrees] ?? 0);
      byCat[cat].sorties += Number(r[kSorties] ?? 0);
      byCat[cat].stock   += Number(r[kStock]   ?? 0);
      byCat[cat].valeur  += Number(r[kSolde]   ?? 0);
    }

    return Object.values(byCat)
      .sort((a, b) => b[mode] - a[mode])
      .filter(c => c[mode] > 0);
  }, [data, mode]);

  if (!chartData.length) return <EmptyState />;

  const valueKey = mode;
  const total = chartData.reduce((s, r) => s + r[valueKey], 0);
  const hovRow = chartData.find(r => r.name === hovered);

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setMode(id)}
      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
        mode === id ? 'bg-[#12a6e0] text-white shadow-sm' : 'text-[#888888] hover:bg-[#f0f0f0] hover:text-[#0d0c0c]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#f8f8f8] border border-[#eeeeee] rounded-xl p-1 w-fit">
        <TabBtn id="stock"   label="Stock" />
        <TabBtn id="entrées" label="Entrées" />
        <TabBtn id="sorties" label="Sorties" />
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey={valueKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                onMouseEnter={(_, i) => setHovered(chartData[i].name)}
                onMouseLeave={() => setHovered(null)}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={CAT_COLORS[i % CAT_COLORS.length]}
                    opacity={hovered && hovered !== entry.name ? 0.35 : 1}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hovRow ? (
              <>
                <p className="text-[10px] text-[#aaaaaa] text-center leading-tight m-0 max-w-[80px] truncate">{hovRow.name}</p>
                <p className="text-[1rem] font-bold text-[#0d0c0c] m-0">{fmtValeur(hovRow[valueKey])}</p>
                <p className="text-[10px] text-[#aaaaaa] m-0">{((hovRow[valueKey] / total) * 100).toFixed(1)}%</p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-[#aaaaaa] m-0">Total</p>
                <p className="text-[1rem] font-bold text-[#0d0c0c] m-0">{fmtValeur(total)}</p>
                <p className="text-[10px] text-[#aaaaaa] m-0">{chartData.length} cat.</p>
              </>
            )}
          </div>
        </div>

        {/* Légende */}
        <div className="flex flex-col gap-1.5 w-full min-w-0">
          {chartData.slice(0, 8).map((entry, i) => {
            const pct = total > 0 ? (entry[valueKey] / total) * 100 : 0;
            const color = CAT_COLORS[i % CAT_COLORS.length];
            return (
              <div
                key={entry.name}
                className={`flex items-center gap-2 transition-opacity duration-150 ${
                  hovered && hovered !== entry.name ? 'opacity-35' : 'opacity-100'
                }`}
                onMouseEnter={() => setHovered(entry.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
                <span className="text-[11px] text-[#444444] truncate flex-1 min-w-0">{entry.name}</span>
                <span className="text-[11px] font-semibold text-[#0d0c0c] shrink-0">{fmtNum(entry[valueKey])}</span>
                <span className="text-[10px] text-[#aaaaaa] shrink-0 w-10 text-right">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
          {chartData.length > 8 && (
            <p className="text-[10px] text-[#aaaaaa] mt-1 m-0">+{chartData.length - 8} autres catalogues</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  GRAPHIQUE 4 — Valeur permanente du stock (courbe)
// ════════════════════════════════════════════════════════════════
function ChartValeurStock({ data }) {
  const chartData = useMemo(() => {
    if (!data || !data.length) return [];

    const keys = Object.keys(data[0]);
    const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;

    const kDate  = find('Date', 'DateJour');
    const kSolde = find('ValeurFinalePermanente', 'Valeur Finale (Permanente)', 'ValeurFinale', 'valeurfinale', 'Solde');
    const kStock = find('StockFinal', 'Stock Final');

    const byDay = {};
    for (const r of data) {
      const raw = r[kDate];
      if (!raw) continue;
      const d = typeof raw === 'string' ? raw.slice(0, 10) : new Date(raw).toISOString().slice(0, 10);
      if (!byDay[d]) byDay[d] = { date: d, valeur: 0, stock: 0 };
      byDay[d].valeur += Number(r[kSolde] ?? 0);
      byDay[d].stock  += Number(r[kStock] ?? 0);
    }

    return Object.values(byDay)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(r => ({ ...r, label: fmtDate(r.date) }));
  }, [data]);

  if (!chartData.length) return <EmptyState />;

  const step = Math.max(1, Math.floor(chartData.length / 60));
  const display = chartData.filter((_, i) => i % step === 0);

  const dernierJour    = chartData[chartData.length - 1];
  const premierJour    = chartData[0];
  const variation      = dernierJour.valeur - premierJour.valeur;
  const variationPct   = premierJour.valeur > 0 ? (variation / premierJour.valeur) * 100 : 0;
  const isPositive     = variation >= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[rgba(18,166,224,0.05)] border border-[rgba(18,166,224,0.15)] rounded-xl px-3 py-2.5">
          <p className="text-[#aaaaaa] text-[10px] uppercase tracking-wide m-0 mb-0.5">Valeur actuelle</p>
          <p className="text-[#12a6e0] text-[1rem] font-bold m-0">{fmtValeur(dernierJour.valeur)} MAD</p>
        </div>
        <div className={`rounded-xl px-3 py-2.5 border ${isPositive ? 'bg-[rgba(1,168,46,0.05)] border-[rgba(1,168,46,0.15)]' : 'bg-[rgba(229,57,53,0.05)] border-[rgba(229,57,53,0.15)]'}`}>
          <p className="text-[#aaaaaa] text-[10px] uppercase tracking-wide m-0 mb-0.5">Variation</p>
          <p className={`text-[1rem] font-bold m-0 ${isPositive ? 'text-[#01a82e]' : 'text-[#e53935]'}`}>
            {isPositive ? '+' : ''}{fmtValeur(variation)}
          </p>
        </div>
        <div className="bg-[rgba(224,138,0,0.05)] border border-[rgba(224,138,0,0.15)] rounded-xl px-3 py-2.5">
          <p className="text-[#aaaaaa] text-[10px] uppercase tracking-wide m-0 mb-0.5">Évol. %</p>
          <p className={`text-[1rem] font-bold m-0 ${isPositive ? 'text-[#01a82e]' : 'text-[#e53935]'}`}>
            {isPositive ? '+' : ''}{variationPct.toFixed(1)}%
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={display} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradValeur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.blue} stopOpacity={0.12} />
              <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: C.textMuted }}
            tickLine={false}
            axisLine={{ stroke: C.border }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: C.textMuted }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtValeur}
          />
          <Tooltip content={<ValeurTooltip />} />
          <Line
            type="monotone" dataKey="valeur" name="Valeur permanente"
            stroke={C.blue} strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, fill: C.blue, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stock en unités (barre secondaire discrète) */}
      <div className="border-t border-[#f4f4f4] pt-3">
        <p className="text-[#aaaaaa] text-[11px] font-medium mb-2">Stock en unités</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={display} margin={{ top: 0, right: 8, left: -10, bottom: 0 }} barCategoryGap="1%">
            <XAxis dataKey="label" hide />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: C.blueLight }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white border border-[#e0e0e0] rounded-lg shadow px-3 py-2 text-[11px]">
                    <span className="text-[#888888]">{label} : </span>
                    <b style={{ color: C.amber }}>{fmtNum(payload[0]?.value)} unités</b>
                  </div>
                );
              }}
            />
            <Bar dataKey="stock" fill={C.amber} fillOpacity={0.5} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE PRINCIPALE
// ════════════════════════════════════════════════════════════════
export default function PageCharts() {
  const { tableData, currentFilters, hasFiltered } = useDashboard();

  const hasData = hasFiltered && tableData && tableData.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Bandeau contexte */}
      <ContextBanner filters={currentFilters} />

      {/* Message si pas encore de données */}
      {!hasData && (
        <div className="bg-[rgba(18,166,224,0.04)] border border-[rgba(18,166,224,0.15)] rounded-xl px-5 py-4 text-[#0b7db0] text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#12a6e0] shrink-0 animate-pulse" />
          <span>
            Rendez-vous sur le <strong>Tableau de bord</strong> pour sélectionner une base et une
            période, puis cliquez sur <strong>Filtrer</strong> pour afficher les graphiques.
          </span>
        </div>
      )}

      {hasData && (
        <>
          {/* ── Ligne 1 : Évolution (pleine largeur) ─────────── */}
          <ChartCard
            icon={TrendingUp}
            iconColor={C.green}
            iconBg={C.greenLight}
            title="Évolution des entrées et sorties"
            subtitle="Quantités journalières sur la période filtrée"
          >
            <ChartEvolution data={tableData} />
          </ChartCard>

          {/* ── Ligne 2 : Top 10 + Donut côte à côte ─────────── */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ChartCard
              icon={BarChart3}
              iconColor={C.blue}
              iconBg={C.blueLight}
              title="Top 10 articles mouvementés"
              subtitle="Classement par quantité entrée, sortie ou totale"
            >
              <ChartTop10 data={tableData} />
            </ChartCard>

            <ChartCard
              icon={PieIcon}
              iconColor={C.purple}
              iconBg={C.purpleLight}
              title="Répartition par catalogue N1"
              subtitle="Part de chaque catalogue dans le stock / mouvements"
            >
              <ChartCatalogueN1 data={tableData} />
            </ChartCard>
          </div>

          {/* ── Ligne 3 : Valeur permanente (pleine largeur) ──── */}
          <ChartCard
            icon={DollarSign}
            iconColor={C.blue}
            iconBg={C.blueLight}
            title="Valeur permanente du stock"
            subtitle="Évolution jour par jour (MAD) et stock en unités"
          >
            <ChartValeurStock data={tableData} />
          </ChartCard>
        </>
      )}
    </div>
  );
}


// import React, { useMemo, useState } from 'react';
// import {
//   AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
//   LineChart, Line,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import {
//   TrendingUp, PieChart as PieIcon, DollarSign,
//   CalendarDays, Database, Layers, Tag, PackageX, Activity,
//   BarChart2, ArrowUpRight, ArrowDownRight, Minus,
// } from 'lucide-react';
// import { useDashboard } from '../context/DashboardContext';

// // ── Design tokens ─────────────────────────────────────────────
// const T = {
//   // Surface
//   bg:          '#0e0f14',
//   surface:     '#161820',
//   surfaceUp:   '#1c1e28',
//   surfaceHigh: '#232636',
//   border:      'rgba(255,255,255,0.07)',
//   borderMid:   'rgba(255,255,255,0.12)',

//   // Accents
//   blue:        '#4f8ef7',
//   blueDim:     'rgba(79,142,247,0.15)',
//   blueGlow:    'rgba(79,142,247,0.08)',
//   green:       '#2dce89',
//   greenDim:    'rgba(45,206,137,0.15)',
//   red:         '#f5365c',
//   redDim:      'rgba(245,54,92,0.15)',
//   amber:       '#fb8c00',
//   amberDim:    'rgba(251,140,0,0.15)',
//   purple:      '#9c5fff',
//   purpleDim:   'rgba(156,95,255,0.15)',
//   teal:        '#11cdef',
//   tealDim:     'rgba(17,205,239,0.15)',

//   // Text
//   text:        '#e8eaf0',
//   textMid:     '#8a8fa8',
//   textDim:     '#50566a',

//   // Chart palette for donut
//   cats: ['#4f8ef7','#2dce89','#9c5fff','#fb8c00','#f5365c','#11cdef','#f06292','#66bb6a'],
// };

// // ── Formatters ────────────────────────────────────────────────
// const fmtDate = (d) => {
//   if (!d) return '';
//   const s = typeof d === 'string' ? d : new Date(d).toISOString();
//   const [, m, dd] = s.slice(0, 10).split('-');
//   return `${dd}/${m}`;
// };
// const fmtNum = (n) =>
//   new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(n ?? 0);
// const fmtShort = (n) => {
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
//   if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
//   return fmtNum(n);
// };

// // ── Custom Tooltip ────────────────────────────────────────────
// function DarkTooltip({ active, payload, label, valeur = false }) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background: T.surfaceHigh,
//       border: `1px solid ${T.borderMid}`,
//       borderRadius: 10,
//       padding: '10px 14px',
//       fontSize: 12,
//       boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
//     }}>
//       {label && <p style={{ color: T.textMid, margin: '0 0 8px', fontSize: 11 }}>{label}</p>}
//       {payload.map((p, i) => (
//         <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
//           <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
//           <span style={{ color: T.textMid }}>{p.name} :</span>
//           <span style={{ color: T.text, fontWeight: 600 }}>
//             {valeur ? `${fmtShort(p.value)} MAD` : fmtNum(p.value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Stat pill (mini KPI) ──────────────────────────────────────
// function StatPill({ label, value, color, colorDim, trend }) {
//   return (
//     <div style={{
//       background: colorDim,
//       border: `1px solid ${color}30`,
//       borderRadius: 12,
//       padding: '12px 16px',
//       minWidth: 0,
//     }}>
//       <p style={{ color: T.textMid, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{label}</p>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//         <span style={{ color, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</span>
//         {trend === 'up'   && <ArrowUpRight   size={13} style={{ color: T.green }} />}
//         {trend === 'down' && <ArrowDownRight size={13} style={{ color: T.red }} />}
//         {trend === 'flat' && <Minus          size={13} style={{ color: T.textDim }} />}
//       </div>
//     </div>
//   );
// }

// // ── Tab bar ───────────────────────────────────────────────────
// function Tabs({ options, value, onChange }) {
//   return (
//     <div style={{
//       display: 'inline-flex',
//       background: T.bg,
//       borderRadius: 10,
//       padding: 3,
//       gap: 2,
//       border: `1px solid ${T.border}`,
//     }}>
//       {options.map(o => (
//         <button
//           key={o.id}
//           onClick={() => onChange(o.id)}
//           style={{
//             padding: '5px 14px',
//             borderRadius: 8,
//             border: 'none',
//             fontSize: 11,
//             fontWeight: 600,
//             cursor: 'pointer',
//             transition: 'all 0.15s',
//             background: value === o.id ? T.blue : 'transparent',
//             color: value === o.id ? '#fff' : T.textMid,
//           }}
//         >
//           {o.label}
//         </button>
//       ))}
//     </div>
//   );
// }

// // ── Chart Card ────────────────────────────────────────────────
// function ChartCard({ icon: Icon, accentColor, title, subtitle, children, span2 = false }) {
//   return (
//     <div style={{
//       background: T.surface,
//       border: `1px solid ${T.border}`,
//       borderRadius: 18,
//       overflow: 'hidden',
//       display: 'flex',
//       flexDirection: 'column',
//       ...(span2 ? { gridColumn: '1 / -1' } : {}),
//     }}>
//       {/* Top accent line */}
//       <div style={{ height: 2, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
//       {/* Header */}
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: 12,
//         padding: '16px 20px 14px',
//         borderBottom: `1px solid ${T.border}`,
//       }}>
//         <div style={{
//           width: 36, height: 36, borderRadius: 10,
//           background: `${accentColor}20`,
//           border: `1px solid ${accentColor}30`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           color: accentColor, flexShrink: 0,
//         }}>
//           <Icon size={16} />
//         </div>
//         <div>
//           <p style={{ color: T.text, fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{title}</p>
//           {subtitle && <p style={{ color: T.textDim, fontSize: 11, margin: '3px 0 0' }}>{subtitle}</p>}
//         </div>
//       </div>
//       {/* Body */}
//       <div style={{ flex: 1, padding: 20 }}>{children}</div>
//     </div>
//   );
// }

// // ── Empty state ───────────────────────────────────────────────
// function EmptyState() {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', gap: 10 }}>
//       <PackageX size={28} style={{ color: T.textDim }} />
//       <p style={{ color: T.textDim, fontSize: 12, textAlign: 'center', maxWidth: 220, lineHeight: 1.6, margin: 0 }}>
//         Aucune donnée — filtrez depuis le tableau de bord
//       </p>
//     </div>
//   );
// }

// // ── Context Banner ────────────────────────────────────────────
// function ContextBanner({ filters }) {
//   const fmtD = (d) => {
//     if (!d) return '';
//     const [y, m, dd] = d.split('-');
//     return `${dd}/${m}/${y}`;
//   };

//   return (
//     <div style={{
//       background: T.surface,
//       border: `1px solid ${T.border}`,
//       borderRadius: 14,
//       padding: '14px 18px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: 10,
//       flexWrap: 'wrap',
//     }}>
//       <div style={{
//         display: 'flex', alignItems: 'center', gap: 7,
//         padding: '5px 10px', borderRadius: 8,
//         background: T.blueGlow,
//         border: `1px solid ${T.blueDim}`,
//         flexShrink: 0,
//       }}>
//         <Activity size={11} style={{ color: T.blue }} />
//         <span style={{ color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
//           Graphiques
//         </span>
//       </div>

//       <div style={{ width: 1, height: 18, background: T.border, flexShrink: 0 }} />

//       {filters?.base && (
//         <Badge icon={<Database size={10} />} color={T.green} colorDim={T.greenDim} text={filters.base} />
//       )}
//       {filters?.dateDebut && filters?.dateFin && (
//         <Badge
//           icon={<CalendarDays size={10} />}
//           color={T.blue} colorDim={T.blueDim}
//           text={`${fmtD(filters.dateDebut)} → ${fmtD(filters.dateFin)}`}
//         />
//       )}
//       {filters?.fa_codefamille && (
//         <Badge icon={<Tag size={10} />} color={T.purple} colorDim={T.purpleDim} text={filters.fa_codefamille} />
//       )}
//       {filters?.cl_no1 && (
//         <Badge icon={<Layers size={10} />} color={T.amber} colorDim={T.amberDim} text={`Cat N1 : ${filters.cl_no1}`} />
//       )}
//       {!filters?.base && (
//         <span style={{ color: T.textDim, fontSize: 12, fontStyle: 'italic' }}>
//           Filtrez depuis le tableau de bord pour afficher les graphiques.
//         </span>
//       )}
//     </div>
//   );
// }

// function Badge({ icon, color, colorDim, text }) {
//   return (
//     <div style={{
//       display: 'inline-flex', alignItems: 'center', gap: 5,
//       background: colorDim, border: `1px solid ${color}40`,
//       borderRadius: 20, padding: '4px 10px',
//     }}>
//       <span style={{ color, display: 'flex' }}>{icon}</span>
//       <span style={{ color, fontSize: 11, fontWeight: 600 }}>{text}</span>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CHART 1 — Évolution entrées / sorties
// // ═══════════════════════════════════════════════════════════════
// function ChartEvolution({ data }) {
//   const chartData = useMemo(() => {
//     if (!data?.length) return [];
//     const keys = Object.keys(data[0]);
//     const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;
//     const kDate = find('Date', 'DateJour');
//     const kE    = find('TotalEntrees', 'Total Entrees', 'TotalEntree');
//     const kS    = find('TotalSorties', 'Total Sorties', 'TotalSortie');
//     const byDay = {};
//     for (const r of data) {
//       const raw = r[kDate]; if (!raw) continue;
//       const d = typeof raw === 'string' ? raw.slice(0,10) : new Date(raw).toISOString().slice(0,10);
//       if (!byDay[d]) byDay[d] = { date: d, entrées: 0, sorties: 0 };
//       byDay[d].entrées += Number(r[kE] ?? 0);
//       byDay[d].sorties += Number(r[kS] ?? 0);
//     }
//     return Object.values(byDay).sort((a,b) => a.date.localeCompare(b.date)).map(r => ({ ...r, label: fmtDate(r.date) }));
//   }, [data]);

//   if (!chartData.length) return <EmptyState />;
//   const step = Math.max(1, Math.floor(chartData.length / 60));
//   const display = chartData.filter((_, i) => i % step === 0);
//   const totalE = chartData.reduce((s,r) => s + r.entrées, 0);
//   const totalS = chartData.reduce((s,r) => s + r.sorties, 0);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//         <StatPill label="Total entrées" value={fmtShort(totalE)} color={T.green} colorDim={T.greenDim} />
//         <StatPill label="Total sorties" value={fmtShort(totalS)} color={T.red}   colorDim={T.redDim}   />
//       </div>
//       <ResponsiveContainer width="100%" height={240}>
//         <AreaChart data={display} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
//           <defs>
//             <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%"  stopColor={T.green} stopOpacity={0.22} />
//               <stop offset="95%" stopColor={T.green} stopOpacity={0} />
//             </linearGradient>
//             <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%"  stopColor={T.red} stopOpacity={0.22} />
//               <stop offset="95%" stopColor={T.red} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
//           <XAxis dataKey="label" tick={{ fontSize: 10, fill: T.textDim }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
//           <YAxis tick={{ fontSize: 10, fill: T.textDim }} tickLine={false} axisLine={false} tickFormatter={fmtShort} />
//           <Tooltip content={<DarkTooltip />} />
//           <Legend
//             iconType="circle" iconSize={7}
//             formatter={v => <span style={{ fontSize: 11, color: T.textMid }}>{v}</span>}
//           />
//           <Area type="monotone" dataKey="entrées" name="Entrées" stroke={T.green} strokeWidth={2} fill="url(#gE)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
//           <Area type="monotone" dataKey="sorties" name="Sorties" stroke={T.red}   strokeWidth={2} fill="url(#gS)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CHART 2 — Top 10 articles
// // ═══════════════════════════════════════════════════════════════
// function ChartTop10({ data }) {
//   const [mode, setMode] = useState('entrees');

//   const chartData = useMemo(() => {
//     if (!data?.length) return [];
//     const keys = Object.keys(data[0]);
//     const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;
//     const kA = find('Article', 'AR_Ref');
//     const kD = find('Designation', 'AR_Design', 'Désignation');
//     const kE = find('TotalEntrees', 'Total Entrees', 'TotalEntree');
//     const kS = find('TotalSorties', 'Total Sorties', 'TotalSortie');
//     const map = {};
//     for (const r of data) {
//       const c = r[kA] ?? '?';
//       if (!map[c]) map[c] = { code: c, name: r[kD] ?? c, entrées: 0, sorties: 0 };
//       map[c].entrées += Number(r[kE] ?? 0);
//       map[c].sorties += Number(r[kS] ?? 0);
//     }
//     return Object.values(map)
//       .map(a => ({ ...a, total: a.entrées + a.sorties }))
//       .sort((a,b) => b[mode === 'total' ? 'total' : mode] - a[mode === 'total' ? 'total' : mode])
//       .slice(0, 10).reverse();
//   }, [data, mode]);

//   if (!chartData.length) return <EmptyState />;

//   const barColor = mode === 'entrees' ? T.green : mode === 'sorties' ? T.red : T.blue;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//       <Tabs
//         options={[{ id: 'entrees', label: 'Entrées' }, { id: 'sorties', label: 'Sorties' }, { id: 'total', label: 'Total' }]}
//         value={mode}
//         onChange={setMode}
//       />
//       <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 36)}>
//         <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 50, left: 4, bottom: 0 }} barCategoryGap="28%">
//           <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false} />
//           <XAxis type="number" tick={{ fontSize: 10, fill: T.textDim }} tickLine={false} axisLine={false} tickFormatter={fmtShort} />
//           <YAxis type="category" dataKey="code" width={70} tick={{ fontSize: 10, fill: T.blue, fontWeight: 600 }} tickLine={false} axisLine={false} />
//           <Tooltip
//             cursor={{ fill: `${barColor}10` }}
//             content={({ active, payload, label }) => {
//               if (!active || !payload?.length) return null;
//               const row = chartData.find(r => r.code === label);
//               return (
//                 <div style={{ background: T.surfaceHigh, border: `1px solid ${T.borderMid}`, borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
//                   <p style={{ color: T.text, fontWeight: 600, margin: '0 0 6px' }}>{label}</p>
//                   {row?.name !== label && <p style={{ color: T.textMid, fontSize: 11, margin: '0 0 6px' }}>{row?.name}</p>}
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     <span style={{ color: T.green }}>Entrées : <b>{fmtNum(row?.entrées)}</b></span>
//                     <span style={{ color: T.red   }}>Sorties : <b>{fmtNum(row?.sorties)}</b></span>
//                     <span style={{ color: T.blue  }}>Total   : <b>{fmtNum(row?.total)}</b></span>
//                   </div>
//                 </div>
//               );
//             }}
//           />
//           <Bar dataKey={mode === 'total' ? 'total' : mode} fill={barColor} radius={[0, 5, 5, 0]}>
//             {chartData.map((_, i) => (
//               <Cell key={i} fill={barColor} fillOpacity={0.65 + (i / chartData.length) * 0.35} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CHART 3 — Répartition catalogue N1 (donut)
// // ═══════════════════════════════════════════════════════════════
// function ChartCatalogueN1({ data }) {
//   const [hovered, setHovered] = useState(null);
//   const [mode, setMode] = useState('stock');

//   const chartData = useMemo(() => {
//     if (!data?.length) return [];
//     const keys = Object.keys(data[0]);
//     const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;
//     const kCat  = find('CatN1','Cat N1','CL_Intitule1','clintitule1');
//     const kE    = find('TotalEntrees','Total Entrees','TotalEntree');
//     const kS    = find('TotalSorties','Total Sorties','TotalSortie');
//     const kSt   = find('StockFinal','Stock Final');
//     const map = {};
//     for (const r of data) {
//       const cat = r[kCat] || 'Sans catalogue';
//       if (!map[cat]) map[cat] = { name: cat, entrées: 0, sorties: 0, stock: 0 };
//       map[cat].entrées += Number(r[kE] ?? 0);
//       map[cat].sorties += Number(r[kS] ?? 0);
//       map[cat].stock   += Number(r[kSt] ?? 0);
//     }
//     return Object.values(map).sort((a,b) => b[mode] - a[mode]).filter(c => c[mode] > 0);
//   }, [data, mode]);

//   if (!chartData.length) return <EmptyState />;

//   const total = chartData.reduce((s,r) => s + r[mode], 0);
//   const hovRow = chartData.find(r => r.name === hovered);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//       <Tabs
//         options={[{ id: 'stock', label: 'Stock' }, { id: 'entrées', label: 'Entrées' }, { id: 'sorties', label: 'Sorties' }]}
//         value={mode}
//         onChange={setMode}
//       />
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
//         <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={chartData} dataKey={mode} nameKey="name"
//                 cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3}
//                 onMouseEnter={(_, i) => setHovered(chartData[i].name)}
//                 onMouseLeave={() => setHovered(null)}
//               >
//                 {chartData.map((entry, i) => (
//                   <Cell
//                     key={entry.name}
//                     fill={T.cats[i % T.cats.length]}
//                     opacity={hovered && hovered !== entry.name ? 0.2 : 1}
//                     stroke="none"
//                   />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//           <div style={{
//             position: 'absolute', inset: 0,
//             display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//             pointerEvents: 'none',
//           }}>
//             {hovRow ? (
//               <>
//                 <p style={{ color: T.textMid, fontSize: 9, textAlign: 'center', margin: '0 0 2px', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hovRow.name}</p>
//                 <p style={{ color: T.text, fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{fmtShort(hovRow[mode])}</p>
//                 <p style={{ color: T.textDim, fontSize: 10, margin: '2px 0 0' }}>{((hovRow[mode] / total) * 100).toFixed(1)}%</p>
//               </>
//             ) : (
//               <>
//                 <p style={{ color: T.textDim, fontSize: 9, margin: '0 0 2px' }}>Total</p>
//                 <p style={{ color: T.text, fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{fmtShort(total)}</p>
//                 <p style={{ color: T.textDim, fontSize: 10, margin: '2px 0 0' }}>{chartData.length} cat.</p>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Legend */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
//           {chartData.slice(0, 8).map((entry, i) => {
//             const pct = total > 0 ? (entry[mode] / total) * 100 : 0;
//             const color = T.cats[i % T.cats.length];
//             const isHov = hovered === entry.name;
//             return (
//               <div
//                 key={entry.name}
//                 onMouseEnter={() => setHovered(entry.name)}
//                 onMouseLeave={() => setHovered(null)}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 10,
//                   opacity: hovered && !isHov ? 0.25 : 1,
//                   transition: 'opacity 0.15s',
//                   cursor: 'default',
//                 }}
//               >
//                 <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
//                 <span style={{ fontSize: 11, color: T.textMid, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</span>
//                 <span style={{ fontSize: 11, color: T.text, fontWeight: 600, flexShrink: 0 }}>{fmtNum(entry[mode])}</span>
//                 {/* Bar */}
//                 <div style={{ width: 60, height: 4, background: T.surfaceHigh, borderRadius: 2, flexShrink: 0, overflow: 'hidden' }}>
//                   <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
//                 </div>
//                 <span style={{ fontSize: 10, color: T.textDim, width: 36, textAlign: 'right', flexShrink: 0 }}>{pct.toFixed(1)}%</span>
//               </div>
//             );
//           })}
//           {chartData.length > 8 && (
//             <p style={{ color: T.textDim, fontSize: 10, margin: '4px 0 0' }}>+{chartData.length - 8} autres</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  CHART 4 — Valeur permanente du stock
// // ═══════════════════════════════════════════════════════════════
// function ChartValeurStock({ data }) {
//   const chartData = useMemo(() => {
//     if (!data?.length) return [];
//     const keys = Object.keys(data[0]);
//     const find = (...v) => keys.find(k => v.some(x => k.toLowerCase().replace(/[\s_()]/g, '') === x.toLowerCase().replace(/[\s_()]/g, ''))) || null;
//     const kDate  = find('Date','DateJour');
//     const kSolde = find('ValeurFinalePermanente','Valeur Finale (Permanente)','ValeurFinale','valeurfinale','Solde');
//     const kStock = find('StockFinal','Stock Final');
//     const byDay = {};
//     for (const r of data) {
//       const raw = r[kDate]; if (!raw) continue;
//       const d = typeof raw === 'string' ? raw.slice(0,10) : new Date(raw).toISOString().slice(0,10);
//       if (!byDay[d]) byDay[d] = { date: d, valeur: 0, stock: 0 };
//       byDay[d].valeur += Number(r[kSolde] ?? 0);
//       byDay[d].stock  += Number(r[kStock] ?? 0);
//     }
//     return Object.values(byDay).sort((a,b) => a.date.localeCompare(b.date)).map(r => ({ ...r, label: fmtDate(r.date) }));
//   }, [data]);

//   if (!chartData.length) return <EmptyState />;

//   const step = Math.max(1, Math.floor(chartData.length / 60));
//   const display = chartData.filter((_, i) => i % step === 0);
//   const last     = chartData[chartData.length - 1];
//   const first    = chartData[0];
//   const variation = last.valeur - first.valeur;
//   const variationPct = first.valeur > 0 ? (variation / first.valeur) * 100 : 0;
//   const isPos = variation >= 0;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
//         <StatPill label="Valeur actuelle" value={`${fmtShort(last.valeur)} MAD`} color={T.blue} colorDim={T.blueDim} />
//         <StatPill label="Variation" value={`${isPos ? '+' : ''}${fmtShort(variation)}`} color={isPos ? T.green : T.red} colorDim={isPos ? T.greenDim : T.redDim} trend={isPos ? 'up' : 'down'} />
//         <StatPill label="Évol. %" value={`${isPos ? '+' : ''}${variationPct.toFixed(1)}%`} color={isPos ? T.green : T.red} colorDim={isPos ? T.greenDim : T.redDim} />
//       </div>

//       <ResponsiveContainer width="100%" height={220}>
//         <LineChart data={display} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
//           <defs>
//             <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%"  stopColor={T.blue} stopOpacity={0.15} />
//               <stop offset="95%" stopColor={T.blue} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
//           <XAxis dataKey="label" tick={{ fontSize: 10, fill: T.textDim }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
//           <YAxis tick={{ fontSize: 10, fill: T.textDim }} tickLine={false} axisLine={false} tickFormatter={fmtShort} />
//           <Tooltip content={<DarkTooltip valeur />} />
//           <Line type="monotone" dataKey="valeur" name="Valeur permanente" stroke={T.blue} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: T.blue, strokeWidth: 0 }} />
//         </LineChart>
//       </ResponsiveContainer>

//       {/* Stock unités */}
//       <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
//         <p style={{ color: T.textDim, fontSize: 11, fontWeight: 500, margin: '0 0 8px' }}>Stock en unités</p>
//         <ResponsiveContainer width="100%" height={60}>
//           <BarChart data={display} margin={{ top: 0, right: 4, left: -18, bottom: 0 }} barCategoryGap="1%">
//             <XAxis dataKey="label" hide />
//             <YAxis hide />
//             <Tooltip
//               cursor={{ fill: T.amberDim }}
//               content={({ active, payload, label }) => {
//                 if (!active || !payload?.length) return null;
//                 return (
//                   <div style={{ background: T.surfaceHigh, border: `1px solid ${T.borderMid}`, borderRadius: 8, padding: '6px 10px', fontSize: 11 }}>
//                     <span style={{ color: T.textMid }}>{label} : </span>
//                     <b style={{ color: T.amber }}>{fmtNum(payload[0]?.value)} unités</b>
//                   </div>
//                 );
//               }}
//             />
//             <Bar dataKey="stock" fill={T.amber} fillOpacity={0.45} radius={[2, 2, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// //  PAGE PRINCIPALE
// // ═══════════════════════════════════════════════════════════════
// export default function PageCharts() {
//   const { tableData, currentFilters, hasFiltered } = useDashboard();
//   const hasData = hasFiltered && tableData?.length > 0;

//   return (
//     <div style={{
//       display: 'flex', flexDirection: 'column', gap: 18,
//       padding: '4px 0',
//       fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
//     }}>
//       <ContextBanner filters={currentFilters} />

//       {!hasData && (
//         <div style={{
//           background: T.surface,
//           border: `1px solid ${T.blueDim}`,
//           borderLeft: `3px solid ${T.blue}`,
//           borderRadius: 12,
//           padding: '14px 18px',
//           display: 'flex', alignItems: 'center', gap: 12,
//         }}>
//           <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.blue, flexShrink: 0, animation: 'pulse 2s infinite' }} />
//           <span style={{ color: T.textMid, fontSize: 13 }}>
//             Rendez-vous sur le <strong style={{ color: T.text }}>Tableau de bord</strong> pour sélectionner une base et une période, puis cliquez sur <strong style={{ color: T.text }}>Filtrer</strong>.
//           </span>
//         </div>
//       )}

//       {hasData && (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18 }}>
//           {/* Évolution pleine largeur */}
//           <ChartCard
//             icon={TrendingUp}
//             accentColor={T.green}
//             title="Évolution entrées / sorties"
//             subtitle="Quantités journalières sur la période filtrée"
//             span2
//           >
//             <ChartEvolution data={tableData} />
//           </ChartCard>

//           {/* Top 10 */}
//           <ChartCard
//             icon={BarChart2}
//             accentColor={T.blue}
//             title="Top 10 articles mouvementés"
//             subtitle="Classement par quantité"
//           >
//             <ChartTop10 data={tableData} />
//           </ChartCard>

//           {/* Donut catalogue */}
//           <ChartCard
//             icon={PieIcon}
//             accentColor={T.purple}
//             title="Répartition catalogue N1"
//             subtitle="Part de chaque catalogue"
//           >
//             <ChartCatalogueN1 data={tableData} />
//           </ChartCard>

//           {/* Valeur permanente pleine largeur */}
//           <ChartCard
//             icon={DollarSign}
//             accentColor={T.teal}
//             title="Valeur permanente du stock"
//             subtitle="Évolution jour par jour (MAD) + stock en unités"
//             span2
//           >
//             <ChartValeurStock data={tableData} />
//           </ChartCard>
//         </div>
//       )}

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.35; }
//         }
//       `}</style>
//     </div>
//   );
// }