import React, { useState } from 'react';
import {
  Menu,
  X,
  Bell,
  UserCircle2,
  TrendingUp,
} from 'lucide-react';

export default function SidebarP({ sidebarOpen, onToggleSidebar }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-[#0f1623] border-b border-white/5 sticky top-0 z-20">

      {/* ── Gauche : hamburger + titre ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
          title={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-sky-400" />
          <span className="text-white font-semibold text-sm tracking-wide">
            Stock Dashboard
          </span>
          <span className="hidden sm:inline text-white/20 text-xs ml-2 font-light">
            {dateStr}
          </span>
        </div>
      </div>

      {/* ── Droite : notifs + user ── */}
      <div className="flex items-center gap-2 relative">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            <Bell size={17} />
            {/* Badge */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1a2235] border border-white/8 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Notifications</p>
              </div>
              <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/4 transition-colors">
                <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                <div>
                  <p className="text-white/70 text-xs">Base STE_NGDM synchronisée</p>
                  <p className="text-white/25 text-[10px] mt-0.5">Il y a 2 min</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/4 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <div>
                  <p className="text-white/70 text-xs">Nouveaux mouvements détectés (BIJOU)</p>
                  <p className="text-white/25 text-[10px] mt-0.5">Il y a 15 min</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-white/5 text-center">
                <button className="text-sky-400 text-[11px] hover:text-sky-300 transition-colors">
                  Voir tout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
              AD
            </div>
            <span className="hidden sm:inline text-white/50 text-xs">Admin</span>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1a2235] border border-white/8 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white/80 text-xs font-medium">Administrateur</p>
                <p className="text-white/30 text-[10px]">admin@sage.local</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 text-white/50 text-xs hover:text-white/80 hover:bg-white/4 transition-all flex items-center gap-2">
                <UserCircle2 size={13} />
                Mon profil
              </button>
              <button className="w-full text-left px-4 py-2.5 text-red-400/70 text-xs hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center gap-2 border-t border-white/5">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}