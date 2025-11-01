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