// Import du type existant
import type { ChasseurBuild } from '../config/builds/buildsChasseurs';

// Types pour l'éditeur de builds
export type BuildEditorData = ChasseurBuild;

// Interface pour les données de référence nécessaires à l'éditeur
export interface EditorReferenceData {
  chasseurs: Array<{ id: number; nom: string; element: string; image: string | null; rarete: string }>;
  artefacts: Array<{ id: number; nom: string; categorie: string | null; image: string | null }>;
  noyaux: Array<{ id: number; nom: string; image: string | null; slot: number | null }>;
  ombres: Array<{ id: number; nom: string }>;
  setsBonus: Array<{ id: number; nom: string }>;
}

// Type pour la validation des modifications
export interface BuildValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Types pour les formulaires
export interface ArtefactFormData {
  id: number;
  statPrincipale: string;
  statsSecondaires: string[]; // Requis pour compatibilité avec le format de sauvegarde
}

export interface NoyauFormData {
  id: number;
  statPrincipale: string;
}

export interface BuildFormData {
  id: number;
  nom: string;
  stats: Record<string, string>;
  artefacts: Record<string, ArtefactFormData>;
  noyaux: Record<number, NoyauFormData[]>;
  ombre?: number;
  sets_bonus: Array<{ id: number }>;
}

// Type pour les données de builds de chasseur avec index signature
export interface ChasseurBuildsData {
  builds: Record<string, BuildFormData>;
}

export interface ChasseurBuildFormData {
  chasseurId: number;
  element: "feu" | "eau" | "vent" | "lumiere" | "tenebres" | "jinwoo";
  builds: BuildFormData[];
}

// Slots d'artefacts possibles
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

// Elements possibles
export const ELEMENTS = [
  "feu",
  "eau", 
  "vent",
  "lumiere",
  "tenebres",
  "jinwoo"
] as const;

export type Element = typeof ELEMENTS[number];

// Stats possibles
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
  "Précision",
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

// Export du type existant pour réutilisation
export type { ChasseurBuild } from '../config/builds/buildsChasseurs';

// ========================================
// Types pour la gestion des chasseurs
// ========================================

// Eléments possibles pour un chasseur
export const ELEMENT_CHASSEUR_VALUES = [
  'Feu',
  'Vent',
  'Lumière',
  'Eau',
  'Ténèbres'
] as const;

export type ElementChasseur = typeof ELEMENT_CHASSEUR_VALUES[number];

// Raretés possibles pour un chasseur
export const RARETE_VALUES = ['SR', 'SSR'] as const;

export type Rarete = typeof RARETE_VALUES[number];

// Interface complète d'un chasseur
export interface Chasseur {
  id: number;
  nom: string;
  image: string | null;
  image_body: string | null;
  element: string | null;
  element_chasseur: ElementChasseur | null;
  rarete: Rarete | null;
  last_modified: string | null;
}

// Données pour créer un chasseur
export interface CreateChasseurData {
  nom: string;
  element_chasseur: ElementChasseur;
  rarete: Rarete;
  image_body?: string | null;
  element?: string | null;
}

// Données pour mettre à jour un chasseur (tous les champs optionnels)
export interface UpdateChasseurData {
  nom?: string;
  element_chasseur?: ElementChasseur;
  rarete?: Rarete;
  image_body?: string | null;
  element?: string | null;
}

// ========================================
// Types pour la gestion des artefacts
// ========================================

// Catégories possibles pour un artefact
export const CATEGORIE_ARTEFACT_VALUES = [
  'Casque',
  'Armure',
  'Gants',
  'Bottes',
  'Collier',
  'Bracelet',
  'Bague',
  'Boucles',
] as const;

// IDs des artefacts de référence pour l'affichage des icônes de catégories
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

export type CategorieArtefact = typeof CATEGORIE_ARTEFACT_VALUES[number];

// Interface complète d'un artefact
export interface Artefact {
  id: number;
  nom: string;
  image: string | null;
  categorie: CategorieArtefact | null;
  created_at: string | null;
  last_modified: string | null;
}

// Données pour créer un artefact
export interface CreateArtefactData {
  nom: string;
  categorie: CategorieArtefact;
}

// Données pour mettre à jour un artefact (tous les champs optionnels)
export interface UpdateArtefactData {
  nom?: string;
  categorie?: CategorieArtefact;
}

// ========================================
// Types pour la gestion des noyaux
// ========================================

// Slots possibles pour un noyau (1, 2, ou 3)
export const SLOT_NOYAU_VALUES = [1, 2, 3] as const;

export type SlotNoyau = typeof SLOT_NOYAU_VALUES[number];

// Interface complète d'un noyau
export interface Noyau {
  id: number;
  nom: string;
  image: string | null;
  description: string | null;
  slot: SlotNoyau | null;
  created_at: string | null;
  last_modified: string | null;
}

// Données pour créer un noyau
export interface CreateNoyauData {
  nom: string;
  slot: SlotNoyau;
  description?: string | null;
}

// Données pour mettre à jour un noyau (tous les champs optionnels)
export interface UpdateNoyauData {
  nom?: string;
  slot?: SlotNoyau;
  description?: string | null;
}

// ========================================
// Types pour la gestion des armes de Jinwoo
// ========================================

// Eléments possibles pour une arme (mêmes que les chasseurs)
export const ELEMENT_ARME_VALUES = [
  'Feu',
  'Eau',
  'Vent',
  'Lumière',
  'Ténèbres'
] as const;

export type ElementArme = typeof ELEMENT_ARME_VALUES[number];

// Mapping des éléments vers leurs URLs d'icônes
export const ELEMENT_ARME_ICONS: Record<ElementArme, string> = {
  'Feu': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Feu_element.webp',
  'Eau': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Eau_element.webp',
  'Vent': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Vent_element.webp',
  'Lumière': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Lumiere_element.webp',
  'Ténèbres': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Tenebre_element.webp',
};

// Interface complète d'une arme de Jinwoo
export interface JinwooArme {
  id: number;
  nom: string;
  image: string | null;
  element: ElementArme | null;
  arme_element: string | null; // URL de l'icône d'élément
  created_at: string | null;
  last_modified: string | null;
}

// Données pour créer une arme
export interface CreateArmeData {
  nom: string;
  element?: ElementArme | null;
}

// Données pour mettre à jour une arme (tous les champs optionnels)
export interface UpdateArmeData {
  nom?: string;
  element?: ElementArme | null;
}