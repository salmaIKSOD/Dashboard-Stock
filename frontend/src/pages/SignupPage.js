import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  Database,
  Building2,
  User,
  Check,
  X,
  TrendingUp,
  PackageSearch,
  BrainCircuit,
  MessageCircle,
} from 'lucide-react';

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Intégration backend plus tard
    console.log('Signup attempt:', formData);
  };

  // Validation en temps réel
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = 
    formData.firstName &&
    formData.lastName &&
    isEmailValid &&
    formData.company &&
    isPasswordValid &&
    doPasswordsMatch &&
    agreeTerms;

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#12a6e0]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#01d63a]/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main container - 2 colonnes (image gauche, formulaire droite) */}
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-2xl border border-[#e8e8e8] shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden animate-[fadeSlideIn_0.3s_ease_both]">
        
        {/* ─── COLONNE GAUCHE : IMAGE 3D + FEATURES ─── */}
        <div className="flex-1 bg-gradient-to-br from-[#f8fcff] to-[#f0f9ff] p-8 md:p-10 flex flex-col justify-center items-center border-r border-[#e8e8e8]">
          
          {/* Image 3D (remplacez par votre vraie image) */}
          <div className="relative w-full max-w-[280px] mb-8">
            {/* Placeholder 3D - Remplacez cette div par votre vraie image */}
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-[#12a6e0]/20 to-[#01d63a]/20 flex items-center justify-center overflow-hidden shadow-xl">
              {/* Effet 3D avec des formes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] rotate-12 opacity-40" />
                <div className="absolute w-24 h-24 rounded-xl bg-gradient-to-tr from-[#01d63a] to-[#01a82e] -rotate-6 opacity-40" />
                <div className="absolute w-16 h-16 rounded-lg bg-white shadow-lg flex items-center justify-center z-10">
                  <Building2 size={32} className="text-[#12a6e0]" />
                </div>
              </div>
              {/* Texte de remplacement - supprimez quand vous avez votre image */}
              <span className="absolute bottom-3 text-[0.625rem] text-[#888888] bg-white/80 px-2 py-0.5 rounded-full">
                Image 3D (remplacez)
              </span>
            </div>
            
            {/* Effet de glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#12a6e0]/20 to-[#01d63a]/20 rounded-full blur-2xl -z-10" />
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
                <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/60 border border-[#e8e8e8]">
                  <feature.icon size={14} className={`text-[${feature.color}]`} style={{ color: feature.color }} />
                  <span className="text-[0.6875rem] text-[#555555]">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info inscription */}
          <div className="mt-6 text-center">
            <p className="text-[0.5625rem] text-[#aaaaaa]">
              <Building2 size={9} className="inline mr-1" />
              Inscription réservée aux sociétés
            </p>
          </div>
        </div>

        {/* ─── COLONNE DROITE : FORMULAIRE D'INSCRIPTION ─── */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto max-h-[90vh]">
          
          {/* Logo / Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] shadow-lg shadow-[rgba(18,166,224,0.3)] mb-4">
              <Database size={28} className="text-white" />
            </div>
            <h1 className="text-[#0d0c0c] text-[1.5rem] font-bold tracking-tight">
              Stock<span className="text-[#12a6e0]">Analytics</span>
            </h1>
            <p className="text-[#888888] text-[0.8125rem] mt-1">
              Créez votre espace d'analyse
            </p>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus size={16} className="text-[#12a6e0]" />
              <span className="text-[#0d0c0c] text-[0.75rem] font-semibold uppercase tracking-[0.08em]">
                Inscription Société
              </span>
            </div>
            <p className="text-[#aaaaaa] text-[0.75rem]">
              Remplissez le formulaire pour créer votre compte société
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                  <User size={11} />
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  className="w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[0.75rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                  <User size={11} />
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[0.75rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
                  required
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@entreprise.com"
                  className={`w-full pl-9 pr-8 py-2 rounded-lg border bg-white text-[0.75rem] text-[#0d0c0c] outline-none transition-all duration-150 placeholder:text-[#c5c5c5] ${
                    formData.email && !isEmailValid
                      ? 'border-[#e53935] focus:border-[#e53935]'
                      : formData.email && isEmailValid
                      ? 'border-[#01a82e] focus:border-[#01a82e]'
                      : 'border-[#e0e0e0] focus:border-[#12a6e0]'
                  }`}
                  required
                />
                {formData.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEmailValid ? (
                      <Check size={14} className="text-[#01a82e]" />
                    ) : (
                      <X size={14} className="text-[#e53935]" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                <Building2 size={11} />
                Nom de la société
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c5c5]">
                  <Building2 size={15} />
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ma Société SAS"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[0.75rem] text-[#0d0c0c] outline-none transition-all duration-150 focus:border-[#12a6e0] focus:shadow-[0_0_0_3px_rgba(18,166,224,0.12)] placeholder:text-[#c5c5c5]"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 rounded-lg border bg-white text-[0.75rem] text-[#0d0c0c] outline-none transition-all duration-150 placeholder:text-[#c5c5c5] ${
                    formData.password && !isPasswordValid
                      ? 'border-[#e53935] focus:border-[#e53935]'
                      : formData.password && isPasswordValid
                      ? 'border-[#01a82e] focus:border-[#01a82e]'
                      : 'border-[#e0e0e0] focus:border-[#12a6e0]'
                  }`}
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
              <p className="text-[0.625rem] text-[#aaaaaa] mt-0.5">
                {formData.password ? (
                  isPasswordValid ? (
                    <span className="text-[#01a82e]">✓ Mot de passe valide (8+ caractères)</span>
                  ) : (
                    <span className="text-[#e53935]">✗ Minimum 8 caractères</span>
                  )
                ) : (
                  'Minimum 8 caractères'
                )}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#12a6e0]">
                <Lock size={11} />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c5c5]">
                  <Lock size={15} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 rounded-lg border bg-white text-[0.75rem] text-[#0d0c0c] outline-none transition-all duration-150 placeholder:text-[#c5c5c5] ${
                    formData.confirmPassword && !doPasswordsMatch
                      ? 'border-[#e53935] focus:border-[#e53935]'
                      : formData.confirmPassword && doPasswordsMatch
                      ? 'border-[#01a82e] focus:border-[#01a82e]'
                      : 'border-[#e0e0e0] focus:border-[#12a6e0]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5c5c5] hover:text-[#888888] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.confirmPassword && !doPasswordsMatch && (
                <p className="text-[0.625rem] text-[#e53935] mt-0.5">✗ Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2 cursor-pointer group pt-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded border border-[#c5c5c5] bg-white transition-all duration-150 peer-checked:bg-[#12a6e0] peer-checked:border-[#12a6e0] peer-focus:ring-2 peer-focus:ring-[rgba(18,166,224,0.25)]">
                  {agreeTerms && (
                    <svg className="w-3 h-3 text-white m-[2px]" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[0.6875rem] text-[#888888] group-hover:text-[#0d0c0c] transition-colors">
                J'accepte les{' '}
                <button type="button" className="text-[#12a6e0] hover:text-[#0d8fc4] font-medium">
                  conditions d'utilisation
                </button>
                {' '}et la{' '}
                <button type="button" className="text-[#12a6e0] hover:text-[#0d8fc4] font-medium">
                  politique de confidentialité
                </button>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.8125rem] font-semibold transition-all duration-200 ${
                isFormValid
                  ? 'bg-gradient-to-br from-[#12a6e0] to-[#0d8fc4] text-white shadow-md shadow-[rgba(18,166,224,0.35)] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-[#e8f6fd] text-[#92cfe8] cursor-not-allowed'
              }`}
            >
              <UserPlus size={15} />
              Créer mon compte société
            </button>

            {/* Login link */}
            <p className="text-center text-[0.6875rem] text-[#aaaaaa] pt-2">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-[#12a6e0] font-semibold hover:text-[#0d8fc4] transition-colors">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;