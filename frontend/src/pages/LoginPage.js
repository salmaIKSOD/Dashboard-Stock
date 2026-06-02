// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   LogIn,
//   Database,
//   TrendingUp,
//   PackageSearch,
//   BrainCircuit,
//   MessageCircle,
//   Shield,
//   Building2,
// } from 'lucide-react';

// function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [role, setRole] = useState('societe');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Intégration backend plus tard
//     console.log('Login attempt:', { email, password, rememberMe, role });
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
//       {/* Background decoration */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#12a6e0]/5 to-transparent rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#01d63a]/5 to-transparent rounded-full blur-3xl" />
//       </div>

//       {/* Main container - 2 colonnes */}
//       <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-2xl border border-[#e8e8e8] shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden animate-[fadeSlideIn_0.3s_ease_both]">
        
//         {/* ─── COLONNE GAUCHE : FORMULAIRE ─── */}
//         <div className="flex-1 p-8 md:p-10">
//           {/* Logo / Brand */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] shadow-lg shadow-[rgba(18,166,224,0.3)] mb-4">
//               <Database size={28} className="text-white" />
//             </div>
//             <h1 className="text-[#0d0c0c] text-[1.5rem] font-bold tracking-tight">
//               Stock<span className="text-[#12a6e0]">Analytics</span>
//             </h1>
//             <p className="text-[#888888] text-[0.8125rem] mt-1">
//               Plateforme d'analyse de mouvements de stock
//             </p>
//           </div>

//           {/* Header */}
//           <div className="mb-6">
//             <div className="flex items-center gap-2 mb-1">
//               <LogIn size={16} className="text-[#12a6e0]" />
//               <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.08em]">
//                 Connexion
//               </span>
//             </div>
//             <p className="text-[#aaaaaa] text-[0.75rem]">
//               Accédez à votre tableau de bord
//             </p>
//           </div>

//           {/* Role selector */}
//           <div className="mb-6">
//             <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0] mb-2">
//               <Shield size={11} />
//               Type de compte
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setRole('administrateur')}
//                 className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-150 ${
//                   role === 'administrateur'
//                     ? 'border-[#12a6e0] bg-[rgba(18,166,224,0.05)] text-[#12a6e0] font-semibold'
//                     : 'border-[#e0e0e0] bg-white text-[#888888] hover:border-[#12a6e0] hover:text-[#12a6e0]'
//                 }`}
//               >
//                 <Shield size={14} />
//                 <span className="text-[0.75rem]">Administrateur</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setRole('societe')}
//                 className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-150 ${
//                   role === 'societe'
//                     ? 'border-[#12a6e0] bg-[rgba(18,166,224,0.05)] text-[#12a6e0] font-semibold'
//                     : 'border-[#e0e0e0] bg-white text-[#888888] hover:border-[#12a6e0] hover:text-[#12a6e0]'
//                 }`}
//               >
//                 <Building2 size={14} />
//                 <span className="text-[0.75rem]">Société</span>
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
//                 <Mail size={11} />
//                 Email professionnel
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c5c5]">
//                   <Mail size={15} />
//                 </div>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="admin@sage.local"
//                   className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#e0e0e0] bg-white text-[0.8125rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
//                 <Lock size={11} />
//                 Mot de passe
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c5c5]">
//                   <Lock size={15} />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-[#e0e0e0] bg-white text-[0.8125rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5c5c5] hover:text-[#888888] transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//             </div>

//             {/* Remember me & Forgot password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 cursor-pointer group">
//                 <div className="relative">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     className="peer sr-only"
//                   />
//                   <div className="w-4 h-4 rounded border border-[#c5c5c5] bg-white transition-all duration-150 peer-checked:bg-[#12a6e0] peer-checked:border-[#12a6e0] peer-focus:ring-2 peer-focus:ring-[rgba(18,166,224,0.25)]">
//                     {rememberMe && (
//                       <svg className="w-3 h-3 text-white m-[2px]" viewBox="0 0 12 12" fill="none">
//                         <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-[0.6875rem] text-[#888888] group-hover:text-[#0d0c0c] transition-colors cursor-pointer">
//                   Se souvenir de moi
//                 </span>
//               </label>
//               <button
//                 type="button"
//                 className="text-[0.6875rem] text-[#12a6e0] hover:text-[#0d8fc4] transition-colors font-medium"
//               >
//                 Mot de passe oublié ?
//               </button>
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white text-[0.8125rem] font-semibold shadow-md shadow-[rgba(18,166,224,0.35)] transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
//             >
//               <LogIn size={15} />
//               Se connecter
//             </button>

//             {/* Signup link */}
//             <p className="text-center text-[0.6875rem] text-[#aaaaaa] pt-2">
//               Pas encore de compte ?{' '}
//               <Link to="/signup" className="text-[#12a6e0] font-semibold hover:text-[#0d8fc4] transition-colors">
//                 Créer un compte
//               </Link>
//             </p>
//           </form>
//         </div>

//         {/* ─── COLONNE DROITE : IMAGE 3D + FEATURES ─── */}
//         <div className="flex-1 bg-gradient-to-br from-[#f8fcff] to-[#f0f9ff] p-8 md:p-10 flex flex-col justify-center items-center border-l border-[#e8e8e8]">
          
//           {/* Image 3D (remplacez par votre vraie image) */}
//           <div className="relative w-full max-w-[280px] mb-8">
//             {/* Placeholder 3D - Remplacez cette div par votre vraie image */}
//             <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-[#12a6e0]/20 to-[#01d63a]/20 flex items-center justify-center overflow-hidden shadow-xl">
//               {/* Effet 3D avec des formes */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] rotate-12 opacity-40" />
//                 <div className="absolute w-24 h-24 rounded-xl bg-gradient-to-tr from-[#01d63a] to-[#01a82e] -rotate-6 opacity-40" />
//                 <div className="absolute w-16 h-16 rounded-lg bg-white shadow-lg flex items-center justify-center z-10">
//                   <Database size={32} className="text-[#12a6e0]" />
//                 </div>
//               </div>
//               {/* Texte de remplacement - supprimez quand vous avez votre image */}
//               <span className="absolute bottom-3 text-[0.625rem] text-[#888888] bg-white/80 px-2 py-0.5 rounded-full">
//                 Image 3D (remplacez)
//               </span>
//             </div>
            
//             {/* Effet de glow */}
//             <div className="absolute -inset-4 bg-gradient-to-r from-[#12a6e0]/20 to-[#01d63a]/20 rounded-full blur-2xl -z-10" />
//           </div>

//           {/* Features grid */}
//           <div className="w-full">
//             <p className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-center mb-4">
//               Fonctionnalités
//             </p>
//             <div className="grid grid-cols-1 gap-2">
//               {[
//                 { icon: TrendingUp, label: 'Analyse temps réel', color: '#12a6e0' },
//                 { icon: PackageSearch, label: 'Suivi des mouvements', color: '#01a82e' },
//                 { icon: Database, label: 'Multi-bases SAGE', color: '#12a6e0' },
//                 { icon: BrainCircuit, label: 'Prévisions IA (7j/14j/30j)', color: '#7c4dff' },
//                 { icon: MessageCircle, label: 'Assistant IA chatbot', color: '#e53935' },
//               ].map((feature, i) => (
//                 <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/60 border border-[#e8e8e8]">
//                   <feature.icon size={14} className={`text-[${feature.color}]`} style={{ color: feature.color }} />
//                   <span className="text-[0.6875rem] text-[#555555]">{feature.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Role hint */}
//           <div className="mt-6 text-center">
//             <p className="text-[0.5625rem] text-[#aaaaaa]">
//               <Shield size={9} className="inline mr-1" />
//               Administrateur : accès complet · 
//               <Building2 size={9} className="inline mx-1" />
//               Société : accès limité à sa base
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Database,
  TrendingUp,
  PackageSearch,
  BrainCircuit,
  MessageCircle,
  Shield,
  Building2,
} from 'lucide-react';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('societe');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Intégration backend plus tard
    console.log('Login attempt:', { email, password, rememberMe, role });
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ─── ANIMATIONS ET DÉCORATIONS D'ARRIÈRE-PLAN ─── */}
      
      {/* Gradient orbite animé qui suit la souris */}
      <div 
        className="fixed w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#12a6e0]/8 to-[#01d63a]/8 blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
      />
      
      {/* Particules flottantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#12a6e0] opacity-[0.03] animate-float"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Cercles concentriques animés */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] border border-[#12a6e0]/5 rounded-full animate-pulse-slow" />
        <div className="absolute w-[600px] h-[600px] border border-[#12a6e0]/8 rounded-full animate-pulse-slower" />
        <div className="absolute w-[400px] h-[400px] border border-[#01d63a]/10 rounded-full animate-pulse-slowest" />
      </div>

      {/* Lignes de grille dynamiques */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#12a6e0 1px, transparent 1px), linear-gradient(90deg, #12a6e0 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Petites étoiles/points scintillants */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-[#12a6e0] rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Vagues animées en bas */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-64" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path 
            fill="#12a6e0" 
            fillOpacity="0.3"
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,234.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,234.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,165.3C96,171,192,181,288,186.7C384,192,480,192,576,186.7C672,181,768,171,864,165.3C960,160,1056,160,1152,165.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,234.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Main container - 2 colonnes */}
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white/95 backdrop-blur-[2px] rounded-2xl border border-[#e8e8e8] shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden animate-[fadeSlideIn_0.3s_ease_both] z-10">
        
        {/* ─── COLONNE GAUCHE : FORMULAIRE ─── */}
        <div className="flex-1 p-8 md:p-10">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] shadow-lg shadow-[rgba(18,166,224,0.3)] mb-4 animate-pulse-glow">
              <Database size={28} className="text-white" />
            </div>
            <h1 className="text-[#0d0c0c] text-[1.5rem] font-bold tracking-tight">
              Stock<span className="text-[#12a6e0]">Analytics</span>
            </h1>
            <p className="text-[#888888] text-[0.8125rem] mt-1">
              Plateforme d'analyse de mouvements de stock
            </p>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <LogIn size={16} className="text-[#12a6e0]" />
              <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.08em]">
                Connexion
              </span>
            </div>
            <p className="text-[#aaaaaa] text-[0.75rem]">
              Accédez à votre tableau de bord
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0] mb-2">
              <Shield size={11} />
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('administrateur')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-150 ${
                  role === 'administrateur'
                    ? 'border-[#12a6e0] bg-[rgba(18,166,224,0.05)] text-[#12a6e0] font-semibold'
                    : 'border-[#e0e0e0] bg-white text-[#888888] hover:border-[#12a6e0] hover:text-[#12a6e0]'
                }`}
              >
                <Shield size={14} />
                <span className="text-[0.75rem]">Administrateur</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('societe')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-150 ${
                  role === 'societe'
                    ? 'border-[#12a6e0] bg-[rgba(18,166,224,0.05)] text-[#12a6e0] font-semibold'
                    : 'border-[#e0e0e0] bg-white text-[#888888] hover:border-[#12a6e0] hover:text-[#12a6e0]'
                }`}
              >
                <Building2 size={14} />
                <span className="text-[0.75rem]">Société</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                <Mail size={11} />
                Email professionnel
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c5c5]">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sage.local"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#e0e0e0] bg-white text-[0.8125rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                <Lock size={11} />
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c5c5]">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-[#e0e0e0] bg-white text-[0.8125rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5c5c5] hover:text-[#888888] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded border border-[#c5c5c5] bg-white transition-all duration-150 peer-checked:bg-[#12a6e0] peer-checked:border-[#12a6e0] peer-focus:ring-2 peer-focus:ring-[rgba(18,166,224,0.25)]">
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white m-[2px]" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[0.6875rem] text-[#888888] group-hover:text-[#0d0c0c] transition-colors cursor-pointer">
                  Se souvenir de moi
                </span>
              </label>
              <button
                type="button"
                className="text-[0.6875rem] text-[#12a6e0] hover:text-[#0d8fc4] transition-colors font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white text-[0.8125rem] font-semibold shadow-md shadow-[rgba(18,166,224,0.35)] transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn size={15} />
              Se connecter
            </button>

            {/* Signup link */}
            <p className="text-center text-[0.6875rem] text-[#aaaaaa] pt-2">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-[#12a6e0] font-semibold hover:text-[#0d8fc4] transition-colors">
                Créer un compte
              </Link>
            </p>
          </form>
        </div>

        {/* ─── COLONNE DROITE : IMAGE 3D + FEATURES ─── */}
        <div className="flex-1 bg-gradient-to-br from-[#f8fcff] to-[#f0f9ff] p-8 md:p-10 flex flex-col justify-center items-center border-l border-[#e8e8e8]">
          
          {/* Image 3D avec animation */}
          <div className="relative w-full max-w-[280px] mb-8 group">
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-[#12a6e0]/20 to-[#01d63a]/20 flex items-center justify-center overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] rotate-12 opacity-40 animate-spin-slow" />
                <div className="absolute w-24 h-24 rounded-xl bg-gradient-to-tr from-[#01d63a] to-[#01a82e] -rotate-6 opacity-40 animate-spin-reverse-slow" />
                <div className="absolute w-16 h-16 rounded-lg bg-white shadow-lg flex items-center justify-center z-10 animate-bounce-subtle">
                  <Database size={32} className="text-[#12a6e0]" />
                </div>
              </div>
              <span className="absolute bottom-3 text-[0.625rem] text-[#888888] bg-white/80 px-2 py-0.5 rounded-full">
                Analytics 3D
              </span>
            </div>
            
            {/* Effet de glow animé */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#12a6e0]/20 to-[#01d63a]/20 rounded-full blur-2xl -z-10 animate-pulse-glow" />
          </div>

          {/* Features grid */}
          <div className="w-full">
            <p className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-center mb-4">
              Fonctionnalités
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: TrendingUp, label: 'Analyse temps réel', color: '#12a6e0' },
                { icon: PackageSearch, label: 'Suivi des mouvements', color: '#01a82e' },
                { icon: Database, label: 'Multi-bases SAGE', color: '#12a6e0' },
                { icon: BrainCircuit, label: 'Prévisions IA (7j/14j/30j)', color: '#7c4dff' },
                { icon: MessageCircle, label: 'Assistant IA chatbot', color: '#e53935' },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/60 border border-[#e8e8e8] transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] hover:shadow-md"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <feature.icon size={14} className={`text-[${feature.color}]`} style={{ color: feature.color }} />
                  <span className="text-[0.6875rem] text-[#555555]">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role hint */}
          <div className="mt-6 text-center">
            <p className="text-[0.5625rem] text-[#aaaaaa]">
              <Shield size={9} className="inline mr-1" />
              Administrateur : accès complet · 
              <Building2 size={9} className="inline mx-1" />
              Société : accès limité à sa base
            </p>
          </div>
        </div>
      </div>

      {/* Ajout des animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-15px); }
          75% { transform: translateY(15px) translateX(-5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        @keyframes pulse-slower {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.08); opacity: 0.4; }
        }
        @keyframes pulse-slowest {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.12); opacity: 0.3; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        .animate-pulse-slowest {
          animation: pulse-slowest 8s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 25s linear infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;