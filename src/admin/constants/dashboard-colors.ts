/**
 * Constantes pour le design du dashboard
 * Centralise les couleurs et styles pour faciliter la maintenance
 */

export const DASHBOARD_COLORS = {
  // Builds & Stratégie
  builds: {
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    iconBg: 'bg-violet-500/20',
    icon: 'text-violet-400',
    button: 'bg-violet-600 hover:bg-violet-700 text-white',
  },
  tierList: {
    gradient: 'from-purple-500 to-indigo-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    icon: 'text-purple-400',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  
  // Base de données
  chasseurs: {
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    icon: 'text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  artefacts: {
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    iconBg: 'bg-green-500/20',
    icon: 'text-green-400',
    button: 'bg-green-600 hover:bg-green-700 text-white',
  },
  noyaux: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    icon: 'text-amber-400',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  armes: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
    icon: 'text-red-400',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
  
  // Promotions
  promoCodes: {
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    iconBg: 'bg-pink-500/20',
    icon: 'text-pink-400',
    button: 'bg-pink-600 hover:bg-pink-700 text-white',
  },
} as const;

export const CATEGORY_GRADIENTS = {
  strategy: 'from-violet-500 to-purple-600',
  database: 'from-blue-500 to-cyan-600',
  promotions: 'from-pink-500 to-rose-600',
} as const;

export const ACTIVITY_COLORS = {
  created: 'text-green-400 bg-green-500/10',
  updated: 'text-blue-400 bg-blue-500/10',
  deleted: 'text-red-400 bg-red-500/10',
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,   // sm
  tablet: 768,   // md
  desktop: 1024, // lg
} as const;
