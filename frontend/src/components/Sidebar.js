import React from 'react';
import {
  LayoutDashboard,
  PackageSearch,
  ArrowDownUp,
  BarChart3,
  Settings,
  Building2,
  ChevronRight,
  Boxes,
  Warehouse,
  BellRing,
  BrainCircuit,
  FileText,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: 'Stock journalier',
    icon: PackageSearch,
    active: false,
  },
  {
    label: 'Mouvements',
    icon: ArrowDownUp,
    active: false,
  },
  {
    label: 'Articles',
    icon: Boxes,
    active: false,
  },
  {
    label: 'Dépôts',
    icon: Warehouse,
    active: false,
  },
  {
    label: 'Analyses',
    icon: BarChart3,
    active: false,
  },
  {
    label: 'Alertes',
    icon: BellRing,
    active: false,
  },
  {
    label: 'AI Prévisions',
    icon: BrainCircuit,
    active: false,
  },
  {
    label: 'Rapports',
    icon: FileText,
    active: false,
  },
  {
    label: 'Paramètres',
    icon: Settings,
    active: false,
  },
];

export default function Sidebar({ open }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30
        flex flex-col
        bg-[#0f1623] border-r border-white/5
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-0 overflow-hidden'}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Building2 size={18} className="text-white" />
        </div>

        <div className="leading-tight">
          <p className="text-white font-semibold text-sm tracking-wide">
            StockAnalytics
          </p>

          <p className="text-white/30 text-[10px] uppercase tracking-widest">
            SAGE Dashboard
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/20">
          Menu
        </p>

        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <li key={label}>
              <button
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-all duration-150 group
                  ${
                    active
                      ? 'bg-sky-500/10 text-sky-400 font-medium'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }
                `}
              >
                <Icon
                  size={16}
                  className={
                    active
                      ? 'text-sky-400'
                      : 'text-white/30 group-hover:text-white/60'
                  }
                />

                <span className="flex-1 text-left">{label}</span>

                {active && (
                  <ChevronRight
                    size={14}
                    className="text-sky-400/60"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Pied de page ── */}
      <div className="px-5 py-4 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>

          <div className="leading-tight min-w-0">
            <p className="text-white/70 text-xs font-medium truncate">
              Administrateur
            </p>

            <p className="text-white/25 text-[10px] truncate">
              admin@sage.local
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}