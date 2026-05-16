import React, { useState } from 'react';
import {
  Menu,
  X,
  Bell,
  UserCircle2,
  TrendingUp,
  Moon,
  Sun,
} from 'lucide-react';

export default function SidebarP({ sidebarOpen, onToggleSidebar }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const btnStyle = {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#888888',
    transition: 'all 0.15s',
  };

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 0.5rem)',
    background: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    zIndex: 50,
    overflow: 'hidden',
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.25rem',
      background: '#ffffff',
      borderBottom: '1px solid #e8e8e8',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>

      {/* Gauche */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          style={btnStyle}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0d0c0c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888888'; }}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} style={{ color: '#12a6e0' }} />
          <span style={{ color: '#0d0c0c', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
            Stock Dashboard
          </span>
          <span style={{ color: '#c5c5c5', fontSize: '0.75rem', marginLeft: '0.5rem', fontWeight: 300 }}
            className="hidden sm:inline">
            {dateStr}
          </span>
        </div>
      </div>

      {/* Droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>

        {/* Theme toggle */}
        <button
          style={btnStyle}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0d0c0c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888888'; }}
        >
          <Moon size={17} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            style={{ ...btnStyle, position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0d0c0c'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888888'; }}
          >
            <Bell size={17} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#12a6e0',
              border: '1.5px solid #ffffff',
            }} />
          </button>

          {notifOpen && (
            <div style={{ ...dropdownStyle, width: '288px' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ color: '#0d0c0c', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                  Notifications
                </p>
              </div>

              {[
                { dot: '#12a6e0', text: 'Base STE_NGDM synchronisée',        time: 'Il y a 2 min'  },
                { dot: '#01d63a', text: 'Nouveaux mouvements détectés (BIJOU)', time: 'Il y a 15 min' },
              ].map((n, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.dot, marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: '#0d0c0c', fontSize: '0.75rem', margin: 0 }}>{n.text}</p>
                    <p style={{ color: '#c5c5c5', fontSize: '0.625rem', margin: '2px 0 0' }}>{n.time}</p>
                  </div>
                </div>
              ))}

              <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#12a6e0', fontSize: '0.6875rem', fontWeight: 500 }}>
                  Voir tout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.5rem',
              borderRadius: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #12a6e0, #01d63a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.6875rem',
              fontWeight: 700,
            }}>
              AD
            </div>
            <span className="hidden sm:inline" style={{ color: '#666666', fontSize: '0.75rem' }}>Admin</span>
          </button>

          {userOpen && (
            <div style={{ ...dropdownStyle, width: '208px' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ color: '#0d0c0c', fontSize: '0.75rem', fontWeight: 500, margin: 0 }}>Administrateur</p>
                <p style={{ color: '#c5c5c5', fontSize: '0.625rem', margin: '2px 0 0' }}>admin@sage.local</p>
              </div>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 1rem',
                color: '#555555',
                fontSize: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.1s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0d0c0c'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#555555'; }}
              >
                <UserCircle2 size={13} />
                Mon profil
              </button>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 1rem',
                color: '#e53935',
                fontSize: '0.75rem',
                background: 'none',
                border: 'none',
                borderTop: '1px solid #f0f0f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,57,53,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// import React, { useState } from 'react';
// import {
//   Menu,
//   X,
//   Bell,
//   UserCircle2,
//   TrendingUp,
//   Moon,
//   Sun,
// } from 'lucide-react';

// export default function SidebarP({ sidebarOpen, onToggleSidebar }) {
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [userOpen, setUserOpen] = useState(false);

//   const now = new Date();
//   const dateStr = now.toLocaleDateString('fr-FR', {
//     weekday: 'long',
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   });

//   return (
//     <header className="flex items-center justify-between px-5 py-3 bg-[#0f1623] border-b border-white/5 sticky top-0 z-20">
      

//       {/* ── Gauche : hamburger + titre ── */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onToggleSidebar}
//           className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
//           title={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
//         >
//           {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
//         </button>

//         <div className="flex items-center gap-2">
//           <TrendingUp size={16} className="text-sky-400" />
//           <span className="text-white font-semibold text-sm tracking-wide">
//             Stock Dashboard
//           </span>
//           <span className="hidden sm:inline text-white/20 text-xs ml-2 font-light">
//             {dateStr}
//           </span>
//         </div>
//       </div>

//       {/* ── Droite : thème + notifs + user ── */}
//       <div className="flex items-center gap-2 relative">

//         {/* Theme Icon */}
//         <button
//           className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
//         >
//           {/* Change juste l'icône selon le thème */}
//           <Moon size={17} />

//           {/* Exemple mode clair */}
//           {/* <Sun size={17} /> */}
//         </button>

//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
//             className="relative w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
//           >
//             <Bell size={17} />
//             {/* Badge */}
//             <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-72 bg-[#1a2235] border border-white/8 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
//               <div className="px-4 py-3 border-b border-white/5">
//                 <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Notifications</p>
//               </div>
//               <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/4 transition-colors">
//                 <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
//                 <div>
//                   <p className="text-white/70 text-xs">Base STE_NGDM synchronisée</p>
//                   <p className="text-white/25 text-[10px] mt-0.5">Il y a 2 min</p>
//                 </div>
//               </div>
//               <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/4 transition-colors">
//                 <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
//                 <div>
//                   <p className="text-white/70 text-xs">Nouveaux mouvements détectés (BIJOU)</p>
//                   <p className="text-white/25 text-[10px] mt-0.5">Il y a 15 min</p>
//                 </div>
//               </div>
//               <div className="px-4 py-2 border-t border-white/5 text-center">
//                 <button className="text-sky-400 text-[11px] hover:text-sky-300 transition-colors">
//                   Voir tout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* User */}
//         <div className="relative">
//           <button
//             onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
//             className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
//           >
//             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
//               AD
//             </div>
//             <span className="hidden sm:inline text-white/50 text-xs">Admin</span>
//           </button>

//           {userOpen && (
//             <div className="absolute right-0 mt-2 w-52 bg-[#1a2235] border border-white/8 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
//               <div className="px-4 py-3 border-b border-white/5">
//                 <p className="text-white/80 text-xs font-medium">Administrateur</p>
//                 <p className="text-white/30 text-[10px]">admin@sage.local</p>
//               </div>
//               <button className="w-full text-left px-4 py-2.5 text-white/50 text-xs hover:text-white/80 hover:bg-white/4 transition-all flex items-center gap-2">
//                 <UserCircle2 size={13} />
//                 Mon profil
//               </button>
//               <button className="w-full text-left px-4 py-2.5 text-red-400/70 text-xs hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center gap-2 border-t border-white/5">
//                 Déconnexion
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

