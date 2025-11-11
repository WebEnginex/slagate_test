/**
 * Constantes centralisées pour l'administration
 * Regroupe tous les éléments, raretés, catégories, etc.
 */

// ============================================
// ÉLÉMENTS
// ============================================

/**
 * Éléments pour les builds (minuscules)
 */
export const ELEMENTS_BUILD = [
  "feu",
  "eau",
  "vent",
  "lumiere",
  "tenebres",
  "jinwoo"
] as const;

export type ElementBuild = typeof ELEMENTS_BUILD[number];

/**
 * Éléments pour les chasseurs (majuscules avec accents)
 */
export const ELEMENTS_CHASSEUR = [
  'Feu',
  'Eau',
  'Vent',
  'Lumière',
  'Ténèbres'
] as const;

export type ElementChasseur = typeof ELEMENTS_CHASSEUR[number];

/**
 * Éléments pour les armes de Jinwoo (majuscules avec accents)
 */
export const ELEMENTS_ARME = [
  'Feu',
  'Eau',
  'Vent',
  'Lumière',
  'Ténèbres'
] as const;

export type ElementArme = typeof ELEMENTS_ARME[number];

/**
 * Éléments pour les teams chasseurs (minuscules)
 */
export const ELEMENTS_TEAM = [
  "feu",
  "vent",
  "lumiere",
  "eau",
  "tenebres"
] as const;

export type ElementTeam = typeof ELEMENTS_TEAM[number];

/**
 * Mapping des URLs d'icônes d'éléments
 */
export const ELEMENT_ICONS: Record<string, string> = {
  'Feu': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Feu_element.webp',
  'Eau': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Eau_element.webp',
  'Vent': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Vent_element.webp',
  'Lumière': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Lumiere_element.webp',
  'Ténèbres': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Tenebre_element.webp',
  // Versions minuscules pour compatibilité
  'feu': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Feu_element.webp',
  'eau': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Eau_element.webp',
  'vent': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Vent_element.webp',
  'lumiere': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Lumiere_element.webp',
  'tenebres': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Tenebre_element.webp',
};

/**
 * Labels des éléments pour affichage
 */
export const ELEMENT_LABELS: Record<ElementTeam, string> = {
  feu: "Feu",
  eau: "Eau",
  vent: "Vent",
  lumiere: "Lumière",
  tenebres: "Ténèbres"
};

/**
 * Couleurs des éléments pour la UI
 */
export const ELEMENT_COLORS: Record<ElementTeam, string> = {
  feu: "bg-red-500/20 border-red-500/40",
  vent: "bg-green-500/20 border-green-500/40",
  lumiere: "bg-yellow-500/20 border-yellow-500/40",
  eau: "bg-blue-500/20 border-blue-500/40",
  tenebres: "bg-purple-500/20 border-purple-500/40"
};

/**
 * Couleurs actives des éléments
 */
export const ELEMENT_ACTIVE_COLORS: Record<ElementTeam, string> = {
  feu: "data-[state=active]:bg-red-600",
  vent: "data-[state=active]:bg-green-600",
  lumiere: "data-[state=active]:bg-yellow-600",
  eau: "data-[state=active]:bg-blue-600",
  tenebres: "data-[state=active]:bg-purple-600"
};

// ============================================
// RARETÉS
// ============================================

/**
 * Raretés disponibles pour les chasseurs
 */
export const RARETES = ['SR', 'SSR'] as const;

export type Rarete = typeof RARETES[number];

// ============================================
// CATÉGORIES D'ARTEFACTS
// ============================================

/**
 * Catégories d'artefacts disponibles
 */
export const CATEGORIES_ARTEFACT = [
  'Casque',
  'Armure',
  'Gants',
  'Bottes',
  'Collier',
  'Bracelet',
  'Bague',
  'Boucles',
] as const;

export type CategorieArtefact = typeof CATEGORIES_ARTEFACT[number];

/**
 * IDs des artefacts de référence pour l'affichage des icônes de catégories
 */
export const CATEGORIE_ARTEFACT_ICONS: Record<string, number> = {
  'Casque': 113,
  'Armure': 114,
  'Gants': 115,
  'Bottes': 116,
  'Collier': 117,
  'Bracelet': 118,
  'Bague': 119,
  'Boucles': 120,
};

// ============================================
// SLOTS
// ============================================

/**
 * Slots d'artefacts possibles dans un build
 */
export const ARTEFACT_SLOTS = [
  "casque",
  "armure",
  "gants",
  "bottes",
  "collier",
  "bracelet",
  "bague",
  "boucles"
] as const;

export type ArtefactSlot = typeof ARTEFACT_SLOTS[number];

/**
 * Slots de noyaux possibles (1, 2, ou 3)
 */
export const SLOTS_NOYAU = [1, 2, 3] as const;

export type SlotNoyau = typeof SLOTS_NOYAU[number];

// ============================================
// RÔLES (pour les teams)
// ============================================

/**
 * Rôles disponibles pour les chasseurs dans les teams
 */
export const ROLES = ["breaker", "support", "dps"] as const;

export type Role = typeof ROLES[number];

/**
 * Labels des rôles pour affichage
 */
export const ROLE_LABELS: Record<Role, string> = {
  breaker: "Breaker",
  support: "Support",
  dps: "DPS"
};

/**
 * Icônes des rôles
 */
export const ROLE_ICONS: Record<Role, string> = {
  breaker: "⚔️",
  support: "🛡️",
  dps: "💥"
};

// ============================================
// STATISTIQUES
// ============================================

/**
 * Options de statistiques disponibles pour les builds
 */
export const STATS_OPTIONS = [
  "Force",
  "Vitalité",
  "Agilité",
  "Intelligence",
  "Perception",
  "PV supplémentaire",
  "Défense supplémentaire",
  "PM",
  "Attaque supplémentaire",
  "Taux de coup critique",
  "Dégâts de coup critique",
  "Hausse des dégâts",
  "Pénétration de défense",
  "Réduction des dégâts",
  "Hausse des soins donnés",
  "Hausse des soins reçus",
  "Hausse du taux de récupération des PM",
  "Baisse du coût de PM"
] as const;

export type StatOption = typeof STATS_OPTIONS[number];
