import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  BarChart3, TrendingUp, PieChart as PieIcon, DollarSign,
  CalendarDays, Database, Layers, Tag, PackageX,
  ArrowUpRight, ArrowDownRight,
  Activity, Wallet,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

// ─────────────────────────────────────────────────────────────
const C = {
  blue:        '#12a6e0',
  blueA:       'rgba(18,166,224,0.08)',
  blueB:       'rgba(18,166,224,0.20)',
  green:       '#01a82e',
  greenA:      'rgba(1,168,46,0.08)',
  greenB:      'rgba(1,168,46,0.20)',
  red:         '#e53935',
  redA:        'rgba(229,57,53,0.08)',
  redB:        'rgba(229,57,53,0.20)',
  amber:       '#e08a00',
  amberA:      'rgba(224,138,0,0.08)',
  amberB:      'rgba(224,138,0,0.20)',
  purple:      '#7c4dff',
  purpleA:     'rgba(124,77,255,0.08)',
  purpleB:     'rgba(124,77,255,0.20)',
  border:      '#e8eaed',
  borderLight: '#f3f4f6',
  bg:          '#f7f8fa',
  white:       '#ffffff',
  text:        '#111827',
  textMuted:   '#6b7280',
  textLight:   '#9ca3af',
};

const CAT_COLORS = [
  '#12a6e0','#01a82e','#7c4dff','#e08a00',
  '#e53935','#00897b','#d4537e','#546e7a',
];

// ─────────────────────────────────────────────────────────────
const toNum = (v) => { const n = Number(v); return isNaN(n) ? 0 : n; };

const fmtDate = (d) => {
  if (!d) return '';
  const s = typeof d === 'string' ? d : new Date(d).toISOString();
  const [, m, dd] = s.slice(0, 10).split('-');
  return `${dd}/${m}`;
};

const fmtNum = (n) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0, maximumFractionDigits: 1,
  }).format(toNum(n));

const fmtVal = (n) => {
  const v = toNum(n);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}k`;
  return fmtNum(v);
};

const mkFind = (keys) => (...variants) =>
  keys.find(k =>
    variants.some(v =>
      k.toLowerCase().replace(/[\s_()]/g, '') ===
      v.toLowerCase().replace(/[\s_()]/g, '')
    )
  ) || null;

// ─────────────────────────────────────────────────────────────
// Tooltip générique
// ─────────────────────────────────────────────────────────────
function Tip({ active, payload, label, isValeur = false }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.10)', fontSize: 12,
    }}>
      {label && <p style={{ color: C.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, flexShrink:0 }} />
          <span style={{ color:C.textMuted }}>{p.name} :</span>
          <span style={{ fontWeight:600, color:C.text }}>
            {isValeur ? `${fmtVal(toNum(p.value))} MAD` : fmtNum(toNum(p.value))}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chip / Pill
// ─────────────────────────────────────────────────────────────
function Chip({ color, bg, border, children }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      background:bg, border:`1px solid ${border}`,
      borderRadius:20, padding:'4px 10px',
      fontSize:11, fontWeight:600, color,
    }}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Onglets
// ─────────────────────────────────────────────────────────────
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{
      display:'inline-flex', background:C.borderLight,
      border:`1px solid ${C.border}`, borderRadius:10, padding:3,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding:'5px 13px', borderRadius:8, fontSize:11, fontWeight:600,
          cursor:'pointer', transition:'all .15s', border:'none',
          background: value === t.id ? C.blue : 'transparent',
          color: value === t.id ? '#fff' : C.textMuted,
          boxShadow: value === t.id ? '0 1px 4px rgba(18,166,224,0.30)' : 'none',
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section card — flex column pour que l'inner puisse grandir
// ─────────────────────────────────────────────────────────────
function Section({ color, icon: Icon, title, subtitle, children, stretch = false }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      // Quand stretch=true la card prend toute la hauteur du grid row
      display: stretch ? 'flex' : 'block',
      flexDirection: stretch ? 'column' : undefined,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 20px',
        borderBottom: `1px solid ${C.borderLight}`,
        background: C.white,
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `${color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={color} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{title}</p>
          {subtitle && (
            <p style={{ fontSize: 11, color: C.textLight, margin: '2px 0 0' }}>{subtitle}</p>
          )}
        </div>
      </div>
      <div style={{
        padding: '18px 20px',
        flex: stretch ? 1 : undefined,
        display: stretch ? 'flex' : 'block',
        flexDirection: stretch ? 'column' : undefined,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// StatRow
// ─────────────────────────────────────────────────────────────
function StatRow({ items }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns:`repeat(${items.length},1fr)`,
      gap:10, marginBottom:18,
    }}>
      {items.map((item, i) => {
        const numVal = toNum(item.value);
        const display = item.isShort ? fmtVal(numVal) : fmtNum(numVal);
        return (
          <div key={i} style={{
            background:`${item.color}08`, border:`1px solid ${item.color}20`,
            borderRadius:10, padding:'10px 14px',
          }}>
            <p style={{
              fontSize:10, color:C.textMuted, margin:'0 0 4px',
              textTransform:'uppercase', letterSpacing:'.06em',
            }}>
              {item.label}
            </p>
            <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
              {item.up !== undefined && numVal !== 0 && (
                item.up
                  ? <ArrowUpRight size={14} color={C.green} style={{ flexShrink:0 }} />
                  : <ArrowDownRight size={14} color={C.red} style={{ flexShrink:0 }} />
              )}
              <span style={{ fontSize:18, fontWeight:700, color:item.color, lineHeight:1 }}>
                {display}
              </span>
              {item.unit && (
                <span style={{ fontSize:11, color:C.textMuted }}>{item.unit}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty
// ─────────────────────────────────────────────────────────────
function Empty() {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'48px 0', gap:10,
    }}>
      <PackageX size={30} color={C.border} />
      <p style={{ fontSize:13, color:C.textLight, margin:0, textAlign:'center' }}>
        Aucune donnée — lancez un filtrage depuis le tableau de bord
      </p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  BANDEAU CONTEXTE
// ═════════════════════════════════════════════════════════════
function Banner({ filters }) {
  const anneeDebut = filters?.dateDebut ? filters.dateDebut.split('-')[0] : null;
  const anneeFin   = filters?.dateFin   ? filters.dateFin.split('-')[0]   : null;

  const short = (d) => {
    if (!d) return '';
    const [, m, dd] = d.split('-');
    return `${dd}/${m}`;
  };

 
  const periodeLabel = () => {
  if (!filters?.dateDebut || !filters?.dateFin) return null;
  const fullShort = (d) => {
    if (!d) return '';
    const [y, m, dd] = d.split('-');
    return `${dd}/${m}/${y}`;
  };
  return `${fullShort(filters.dateDebut)} → ${fullShort(filters.dateFin)}`;
};

  return (
    <div style={{
      background:C.white, border:`1px solid ${C.border}`,
      borderRadius:14, overflow:'hidden',
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'12px 20px', borderBottom:`1px solid ${C.borderLight}`,
        background:'linear-gradient(to right, #f8fcff, #f0f9ff)',
      }}>
        <div style={{
          width:28, height:28, borderRadius:8, background:C.blue,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <BarChart3 size={14} color="#fff" />
        </div>
        <span style={{ fontSize:13, fontWeight:600, color:C.text }}>Graphiques</span>
        <span style={{ fontSize:11, color:C.textLight }}>— Contexte du tableau de bord</span>
      </div>
      <div style={{ padding:'12px 20px', display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
        {filters?.base && (
          <Chip color={C.green} bg={C.greenA} border={C.greenB}>
            <Database size={10} /> {filters.base}
          </Chip>
        )}
        {periodeLabel() && (
          <Chip color={C.blue} bg={C.blueA} border={C.blueB}>
            <CalendarDays size={10} /> {periodeLabel()}
          </Chip>
        )}
        {filters?.fa_codefamille && (
          <Chip color={C.purple} bg={C.purpleA} border={C.purpleB}>
            <Tag size={10} /> {filters.fa_codefamille}
          </Chip>
        )}
        {filters?.cl_no1 && (
          <Chip color={C.amber} bg={C.amberA} border={C.amberB}>
            <Layers size={10} /> Cat N1 : {filters.cl_no1}
          </Chip>
        )}
        {!filters?.base && (
          <span style={{ fontSize:12, color:C.textLight, fontStyle:'italic' }}>
            Filtrez depuis le tableau de bord.
          </span>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  G1 — Évolution entrées / sorties
// ═════════════════════════════════════════════════════════════
function G1({ data }) {
  const { pts, totE, totS } = useMemo(() => {
    if (!data?.length) return { pts:[], totE:0, totS:0 };
    const find = mkFind(Object.keys(data[0]));
    const kD = find('Date','DateJour');
    const kE = find('TotalEntrees','Total Entrees','TotalEntree');
    const kS = find('TotalSorties','Total Sorties','TotalSortie');
    const map = {};
    for (const r of data) {
      const raw = r[kD]; if (!raw) continue;
      const d = typeof raw === 'string' ? raw.slice(0,10) : new Date(raw).toISOString().slice(0,10);
      if (!map[d]) map[d] = { d, e:0, s:0 };
      map[d].e += toNum(r[kE]);
      map[d].s += toNum(r[kS]);
    }
    const sorted = Object.values(map).sort((a,b) => a.d.localeCompare(b.d));
    const step = Math.max(1, Math.floor(sorted.length / 60));
    return {
      pts:  sorted.filter((_,i) => i%step===0).map(r => ({ ...r, label:fmtDate(r.d) })),
      totE: sorted.reduce((s,r) => s+r.e, 0),
      totS: sorted.reduce((s,r) => s+r.s, 0),
    };
  }, [data]);

  if (!pts.length) return <Empty />;

  return (
    <>
      <StatRow items={[
        { label:'Total entrées', value:totE, color:C.green, isShort:false },
        { label:'Total sorties', value:totS, color:C.red,   isShort:false },
      ]} />
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={pts} margin={{ top:4, right:4, left:-16, bottom:0 }}>
          <defs>
            <linearGradient id="gE1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={C.green} stopOpacity={.18} />
              <stop offset="100%" stopColor={C.green} stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="gS1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={C.red} stopOpacity={.18} />
              <stop offset="100%" stopColor={C.red} stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke={C.borderLight} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize:10, fill:C.textLight }}
            tickLine={false} axisLine={{ stroke:C.border }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize:10, fill:C.textLight }} tickLine={false}
            axisLine={false} tickFormatter={v => fmtVal(toNum(v))} />
          <Tooltip content={<Tip />} />
          <Legend iconType="circle" iconSize={7}
            formatter={v => <span style={{ fontSize:11, color:C.textMuted }}>{v}</span>} />
          <Area type="monotone" dataKey="e" name="Entrées"
            stroke={C.green} strokeWidth={2.5} fill="url(#gE1)"
            dot={false} activeDot={{ r:4, strokeWidth:0 }} />
          <Area type="monotone" dataKey="s" name="Sorties"
            stroke={C.red} strokeWidth={2.5} fill="url(#gS1)"
            dot={false} activeDot={{ r:4, strokeWidth:0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
//  G2 — Top 10 articles
//  Le graphique prend flex:1 pour remplir toute la hauteur
//  disponible quand la card est étirée par le grid
// ═════════════════════════════════════════════════════════════
function G2({ data }) {
  const [mode, setMode] = useState('entrees');

  const rows = useMemo(() => {
    if (!data?.length) return [];
    const find = mkFind(Object.keys(data[0]));
    const kA = find('Article','AR_Ref');
    const kN = find('Designation','AR_Design','Désignation');
    const kE = find('TotalEntrees','Total Entrees','TotalEntree');
    const kS = find('TotalSorties','Total Sorties','TotalSortie');
    const map = {};
    for (const r of data) {
      const code = r[kA] ?? '?';
      if (!map[code]) map[code] = { code, name:r[kN]??code, entrees:0, sorties:0 };
      map[code].entrees += toNum(r[kE]);
      map[code].sorties += toNum(r[kS]);
    }
    return Object.values(map)
      .map(a => ({ ...a, total:a.entrees+a.sorties }))
      .sort((a,b) => b[mode]-a[mode])
      .slice(0,10)
      .reverse();
  }, [data, mode]);

  if (!rows.length) return <Empty />;

  const barCol = mode==='entrees' ? C.green : mode==='sorties' ? C.red : C.blue;

  return (
    // flex:1 + display:flex + flexDirection:column pour que le
    // ResponsiveContainer grandisse jusqu'à remplir la card
    <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
      <div style={{ marginBottom:16, flexShrink:0 }}>
        <Tabs
          tabs={[{id:'entrees',label:'Entrées'},{id:'sorties',label:'Sorties'},{id:'total',label:'Total'}]}
          value={mode} onChange={setMode}
        />
      </div>
      {/* flex:1 + minHeight:0 = le chart s'étire sans déborder */}
      <div style={{ flex:1, minHeight: rows.length * 36 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical"
            margin={{ top:0, right:55, left:4, bottom:0 }} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="4 4" stroke={C.borderLight} horizontal={false} />
            <XAxis type="number" tick={{ fontSize:10, fill:C.textLight }}
              tickLine={false} axisLine={false} tickFormatter={v => fmtVal(toNum(v))} />
            <YAxis type="category" dataKey="code" width={70}
              tick={{ fontSize:10, fill:C.blue, fontWeight:600 }}
              tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill:`${barCol}10` }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = rows.find(r => r.code===label);
                return (
                  <div style={{
                    background:C.white, border:`1px solid ${C.border}`,
                    borderRadius:10, padding:'10px 14px',
                    boxShadow:'0 6px 24px rgba(0,0,0,0.10)', fontSize:12,
                  }}>
                    <p style={{ fontWeight:600, color:C.text, margin:'0 0 4px' }}>{label}</p>
                    {row?.name && row.name!==label && (
                      <p style={{ fontSize:11, color:C.textMuted, margin:'0 0 7px', maxWidth:210 }}>
                        {row.name}
                      </p>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                      <span style={{ color:C.green }}>Entrées : <b>{fmtNum(row?.entrees)}</b></span>
                      <span style={{ color:C.red   }}>Sorties : <b>{fmtNum(row?.sorties)}</b></span>
                      <span style={{ color:C.blue  }}>Total : <b>{fmtNum(row?.total)}</b></span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey={mode} name={mode} fill={barCol} radius={[0,5,5,0]}>
              {rows.map((_,i) => (
                <Cell key={i} fill={barCol}
                  fillOpacity={0.55+(i/Math.max(rows.length-1,1))*0.45} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  G3 — Répartition catalogue N1 — légende 2 colonnes
// ═════════════════════════════════════════════════════════════
function G3({ data }) {
  const [mode, setMode] = useState('stock');
  const [hov, setHov]   = useState(null);

  const rows = useMemo(() => {
    if (!data?.length) return [];
    const find = mkFind(Object.keys(data[0]));
    const kC = find('CatN1','Cat N1','CL_Intitule1','clintitule1');
    const kE = find('TotalEntrees','Total Entrees','TotalEntree');
    const kS = find('TotalSorties','Total Sorties','TotalSortie');
    const kV = find('ValeurFinalePermanente','Valeur Finale (Permanente)','ValeurFinale','valeurfinale','Solde');
    const kF = find('StockFinal','Stock Final');
    const map = {};
    for (const r of data) {
      const cat = r[kC] || 'Sans catalogue';
      if (!map[cat]) map[cat] = { name:cat, entrees:0, sorties:0, stock:0, valeur:0 };
      map[cat].entrees += toNum(r[kE]);
      map[cat].sorties += toNum(r[kS]);
      map[cat].stock   += toNum(r[kF]);
      map[cat].valeur  += toNum(r[kV]);
    }
    return Object.values(map)
      .sort((a,b) => b[mode]-a[mode])
      .filter(c => c[mode]>0);
  }, [data, mode]);

  if (!rows.length) return <Empty />;

  const total    = rows.reduce((s,r) => s+r[mode], 0);
  const hovRow   = rows.find(r => r.name===hov);
  const display8 = rows.slice(0, 8);

  return (
    <>
      <div style={{ marginBottom:16 }}>
        <Tabs
          tabs={[
            {id:'stock',   label:'Stock'},
            {id:'entrees', label:'Entrées'},
            {id:'sorties', label:'Sorties'},
            {id:'valeur',  label:'Valeur'},
          ]}
          value={mode} onChange={setMode}
        />
      </div>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        {/* Donut */}
        <div style={{ position:'relative', width:200, height:200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows} dataKey={mode} cx="50%" cy="50%"
                innerRadius={58} outerRadius={88} paddingAngle={2}
                onMouseEnter={(_,i) => setHov(rows[i].name)}
                onMouseLeave={() => setHov(null)}
              >
                {rows.map((r,i) => (
                  <Cell key={r.name}
                    fill={CAT_COLORS[i%CAT_COLORS.length]}
                    opacity={hov && hov!==r.name ? 0.25 : 1}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position:'absolute', inset:0, display:'flex',
            flexDirection:'column', alignItems:'center',
            justifyContent:'center', pointerEvents:'none',
          }}>
            <p style={{ fontSize:10, color:C.textLight, margin:0,
              maxWidth:76, overflow:'hidden', textOverflow:'ellipsis',
              whiteSpace:'nowrap', textAlign:'center' }}>
              {hovRow ? hovRow.name : 'Total'}
            </p>
            <p style={{ fontSize:18, fontWeight:700, color:C.text, margin:'2px 0 1px' }}>
              {fmtVal(toNum(hovRow ? hovRow[mode] : total))}
            </p>
            {hovRow && (
              <p style={{ fontSize:10, color:C.textLight, margin:0 }}>
                {((toNum(hovRow[mode])/total)*100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>

        {/* Légende 2 colonnes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px 16px',
          width: '100%',
          marginTop: 14,
        }}>
          {display8.map((r, i) => {
            const pct   = total > 0 ? (toNum(r[mode]) / total) * 100 : 0;
            const col   = CAT_COLORS[i % CAT_COLORS.length];
            const isHov = hov === r.name;
            return (
              <div
                key={r.name}
                onMouseEnter={() => setHov(r.name)}
                onMouseLeave={() => setHov(null)}
                style={{
                  opacity: hov && !isHov ? 0.35 : 1,
                  transition: 'opacity .15s',
                  cursor: 'default',
                }}
              >
                {/* Nom */}
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                  <span style={{
                    width:8, height:8, borderRadius:'50%',
                    background:col, flexShrink:0,
                  }} />
                  <span style={{
                    fontSize:11, color:C.text, flex:1,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }} title={r.name}>
                    {r.name}
                  </span>
                </div>
                {/* Valeur + % */}
                <div style={{
                  display:'flex', alignItems:'center',
                  justifyContent:'space-between',
                  marginBottom:4, paddingLeft:14,
                }}>
                  <span style={{ fontSize:11, fontWeight:600, color:C.text }}>
                    {fmtNum(toNum(r[mode]))}
                  </span>
                  <span style={{ fontSize:10, color:C.textMuted }}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                {/* Barre */}
                <div style={{
                  height:3, borderRadius:2,
                  background:C.borderLight, overflow:'hidden',
                }}>
                  <div style={{
                    height:'100%', width:`${pct}%`,
                    background:col, borderRadius:2,
                    transition:'width .5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {rows.length > 8 && (
          <p style={{ fontSize:10, color:C.textLight, margin:'10px 0 0', textAlign:'center' }}>
            +{rows.length - 8} autres catalogues
          </p>
        )}
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
//  G4 — Valeur permanente du stock
// ═════════════════════════════════════════════════════════════
function G4({ data }) {
  const { pts, parMois, dernierValeur, premiereValeur, dernierStock, maxValeur, minValeur } = useMemo(() => {
    if (!data?.length) return {
      pts:[], parMois:[], dernierValeur:0, premiereValeur:0,
      dernierStock:0, maxValeur:0, minValeur:0,
    };
    const find = mkFind(Object.keys(data[0]));
    const kD = find('Date','DateJour');
    const kV = find('ValeurFinalePermanente','Valeur Finale (Permanente)','ValeurFinale','valeurfinale','Solde');
    const kF = find('StockFinal','Stock Final');
    const kE = find('TotalEntrees','Total Entrees','TotalEntree');
    const kS = find('TotalSorties','Total Sorties','TotalSortie');

    const map = {};
    const moisMap = {};

    for (const r of data) {
      const raw = r[kD]; if (!raw) continue;
      const d = typeof raw === 'string' ? raw.slice(0,10) : new Date(raw).toISOString().slice(0,10);
      const mois = d.slice(0,7);
      if (!map[d]) map[d] = { d, valeur:0, stock:0 };
      map[d].valeur += toNum(r[kV]);
      map[d].stock  += toNum(r[kF]);
      if (!moisMap[mois]) moisMap[mois] = { mois, entrees:0, sorties:0, valeur:0 };
      moisMap[mois].entrees += toNum(r[kE]);
      moisMap[mois].sorties += toNum(r[kS]);
      moisMap[mois].valeur  += toNum(r[kV]);
    }

    const sorted  = Object.values(map).sort((a,b) => a.d.localeCompare(b.d));
    const step    = Math.max(1, Math.floor(sorted.length/60));
    const allVals = sorted.map(r => r.valeur).filter(v => v > 0);
    const moisSorted = Object.values(moisMap).sort((a,b) => a.mois.localeCompare(b.mois));
    const moisFmt = moisSorted.map(r => {
      const [y, m] = r.mois.split('-');
      const noms = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
      return { ...r, label:`${noms[parseInt(m,10)-1]} ${y.slice(2)}` };
    });

    return {
      pts:            sorted.filter((_,i) => i%step===0).map(r => ({ ...r, label:fmtDate(r.d) })),
      parMois:        moisFmt,
      dernierValeur:  toNum(sorted.at(-1)?.valeur ?? 0),
      premiereValeur: toNum(sorted[0]?.valeur     ?? 0),
      dernierStock:   toNum(sorted.at(-1)?.stock  ?? 0),
      maxValeur:      allVals.length ? Math.max(...allVals) : 0,
      minValeur:      allVals.length ? Math.min(...allVals) : 0,
    };
  }, [data]);

  if (!pts.length) return <Empty />;

  const diff    = dernierValeur - premiereValeur;
  const pctEvol = premiereValeur > 0 ? (diff / premiereValeur) * 100 : 0;
  const up      = diff >= 0;

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        <div style={{
          background:`linear-gradient(135deg, ${C.blue}12, ${C.blue}04)`,
          border:`1px solid ${C.blue}25`, borderRadius:12, padding:'14px 16px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', right:-10, top:-10, width:60, height:60,
            borderRadius:'50%', background:`${C.blue}10` }} />
          <p style={{ fontSize:10, color:C.textMuted, margin:'0 0 6px',
            textTransform:'uppercase', letterSpacing:'.07em' }}>Valeur actuelle</p>
          <p style={{ fontSize:20, fontWeight:700, color:C.blue, margin:'0 0 2px' }}>
            {fmtVal(dernierValeur)}
          </p>
          <p style={{ fontSize:10, color:C.textMuted, margin:0 }}>MAD — dernier jour</p>
        </div>

        <div style={{
          background:`linear-gradient(135deg, ${up?C.green:C.red}12, ${up?C.green:C.red}04)`,
          border:`1px solid ${up?C.green:C.red}25`, borderRadius:12, padding:'14px 16px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', right:-10, top:-10, width:60, height:60,
            borderRadius:'50%', background:`${up?C.green:C.red}10` }} />
          <p style={{ fontSize:10, color:C.textMuted, margin:'0 0 6px',
            textTransform:'uppercase', letterSpacing:'.07em' }}>Variation</p>
          <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:2 }}>
            {up ? <ArrowUpRight size={16} color={C.green} /> : <ArrowDownRight size={16} color={C.red} />}
            <p style={{ fontSize:20, fontWeight:700, color:up?C.green:C.red, margin:0 }}>
              {up?'+':''}{fmtVal(diff)}
            </p>
          </div>
          <p style={{ fontSize:10, color:C.textMuted, margin:0 }}>
            {up?'+':''}{pctEvol.toFixed(1)}% sur la période
          </p>
        </div>

        <div style={{
          background:`linear-gradient(135deg, ${C.amber}12, ${C.amber}04)`,
          border:`1px solid ${C.amber}25`, borderRadius:12, padding:'14px 16px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', right:-10, top:-10, width:60, height:60,
            borderRadius:'50%', background:`${C.amber}10` }} />
          <p style={{ fontSize:10, color:C.textMuted, margin:'0 0 6px',
            textTransform:'uppercase', letterSpacing:'.07em' }}>Stock dernier jour</p>
          <p style={{ fontSize:20, fontWeight:700, color:C.amber, margin:'0 0 2px' }}>
            {fmtNum(dernierStock)}
          </p>
          <p style={{ fontSize:10, color:C.textMuted, margin:0 }}>unités en stock</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ background:C.borderLight, border:`1px solid ${C.border}`,
          borderRadius:12, padding:'14px 12px 10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <Activity size={13} color={C.blue} />
            <p style={{ fontSize:12, fontWeight:600, color:C.text, margin:0 }}>
              Courbe valeur permanente
            </p>
          </div>
          <div style={{ display:'flex', gap:12, marginBottom:10 }}>
            <span style={{ fontSize:10, color:C.textLight }}>
              Min : <b style={{ color:C.text }}>{fmtVal(minValeur)} MAD</b>
            </span>
            <span style={{ fontSize:10, color:C.textLight }}>
              Max : <b style={{ color:C.text }}>{fmtVal(maxValeur)} MAD</b>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={pts} margin={{ top:4, right:4, left:-18, bottom:0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize:9, fill:C.textLight }}
                tickLine={false} axisLine={{ stroke:C.border }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize:9, fill:C.textLight }} tickLine={false}
                axisLine={false} tickFormatter={v => fmtVal(toNum(v))} />
              <Tooltip content={<Tip isValeur />} />
              {premiereValeur > 0 && (
                <ReferenceLine y={(dernierValeur+premiereValeur)/2}
                  stroke={C.blue} strokeDasharray="6 3" strokeOpacity={0.4}
                  label={{ value:'moy.', position:'insideTopRight',
                    fontSize:9, fill:C.blue, fillOpacity:.6 }} />
              )}
              <defs>
                <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue} stopOpacity={.15} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="valeur" name="Valeur"
                stroke={C.blue} strokeWidth={2.5}
                dot={false} activeDot={{ r:4, fill:C.blue, strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:C.borderLight, border:`1px solid ${C.border}`,
          borderRadius:12, padding:'14px 12px 10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
            <Wallet size={13} color={C.amber} />
            <p style={{ fontSize:12, fontWeight:600, color:C.text, margin:0 }}>
              Entrées / Sorties par mois
            </p>
          </div>
          {parMois.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={parMois} margin={{ top:4, right:4, left:-18, bottom:0 }}
                barCategoryGap="20%" barGap={2}>
                <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize:9, fill:C.textLight }}
                  tickLine={false} axisLine={{ stroke:C.border }} />
                <YAxis tick={{ fontSize:9, fill:C.textLight }} tickLine={false}
                  axisLine={false} tickFormatter={v => fmtVal(toNum(v))} />
                <Tooltip content={<Tip />} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize:10, color:C.textMuted }}>{v}</span>} />
                <Bar dataKey="entrees" name="Entrées" fill={C.green}
                  fillOpacity={0.80} radius={[3,3,0,0]} />
                <Bar dataKey="sorties" name="Sorties" fill={C.red}
                  fillOpacity={0.80} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ color:C.textLight, fontSize:12 }}>Pas assez de mois</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
//  PAGE PRINCIPALE
// ═════════════════════════════════════════════════════════════
export default function PageCharts() {
  const { tableData, currentFilters, hasFiltered } = useDashboard();
  const hasData = hasFiltered && tableData?.length > 0;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      <Banner filters={currentFilters} />

      {!hasData && (
        <div style={{
          background:C.blueA, border:`1px solid ${C.blueB}`,
          borderLeft:`3px solid ${C.blue}`,
          borderRadius:10, padding:'14px 18px',
          fontSize:13, color:'#0b7db0',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <div style={{
            width:7, height:7, borderRadius:'50%',
            background:C.blue, flexShrink:0,
          }} />
          <span>
            Rendez-vous sur le <strong>Tableau de bord</strong> pour sélectionner
            une base et une période, puis cliquez sur <strong>Filtrer</strong>.
          </span>
        </div>
      )}

      {hasData && (
        <>
          <Section color={C.green} icon={TrendingUp}
            title="Évolution des entrées et sorties"
            subtitle="Quantités journalières sur la période filtrée">
            <G1 data={tableData} />
          </Section>

          {/*
            Pas de alignItems:start → les deux cards s'étirent à la même hauteur.
            G2 utilise flex:1 en interne pour que le graphique remplisse cet espace.
          */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
            gap:20,
          }}>
            <Section color={C.blue} icon={BarChart3}
              title="Top 10 articles mouvementés"
              subtitle="Par entrées, sorties ou total"
              stretch>
              <G2 data={tableData} />
            </Section>

            <Section color={C.purple} icon={PieIcon}
              title="Répartition par catalogue N1"
              subtitle="Stock, mouvements ou valeur"
              stretch>
              <G3 data={tableData} />
            </Section>
          </div>

          <Section color={C.amber} icon={DollarSign}
            title="Valeur permanente du stock"
            subtitle="Courbe valeur MAD · Mouvements mensuels · KPIs clés">
            <G4 data={tableData} />
          </Section>
        </>
      )}
    </div>
  );
}