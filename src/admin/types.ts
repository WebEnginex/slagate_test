// Import du type existant
import type { ChasseurBuild } from '../config/builds/buildsChasseurs';

// Importer les types pour utilisation locale
import type {
  ArtefactSlot,
  ElementBuild,
  StatOption,
  ElementChasseur,
  Rarete,
  CategorieArtefact,
  SlotNoyau,
  ElementArme,
  ElementCompetence
} from './constants';

// Réexporter les constantes depuis le fichier centralisé
export {
  ARTEFACT_SLOTS,
  ELEMENTS_BUILD as ELEMENTS,
  STATS_OPTIONS,
  ELEMENTS_CHASSEUR as ELEMENT_CHASSEUR_VALUES,
  RARETES as RARETE_VALUES,
  CATEGORIES_ARTEFACT as CATEGORIE_ARTEFACT_VALUES,
  CATEGORIE_ARTEFACT_ICONS,
  SLOTS_NOYAU as SLOT_NOYAU_VALUES,
  ELEMENTS_ARME as ELEMENT_ARME_VALUES,
  ELEMENTS_COMPETENCE as ELEMENT_COMPETENCE_VALUES,
  ELEMENT_ICONS as ELEMENT_ARME_ICONS
} from './constants';

// Réexporter les types depuis le fichier centralisé
export type {
  ArtefactSlot,
  ElementBuild as Element,
  StatOption,
  ElementChasseur,
  Rarete,
  CategorieArtefact,
  SlotNoyau,
  ElementArme,
  ElementCompetence
} from './constants';

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

// Export du type existant pour réutilisation
export type { ChasseurBuild } from '../config/builds/buildsChasseurs';

// ========================================
// Types pour la gestion des chasseurs
// ========================================

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

// ========================================
// Types pour la gestion des ombres
// ========================================

// Interface complète d'une ombre
export interface Ombre {
  id: number;
  nom: string;
  image: string | null;
  description: string | null;
  created_at: string | null;
  last_modified: string | null;
}

// Données pour créer une ombre
export interface CreateOmbreData {
  nom: string;
  description?: string | null;
}

// Données pour mettre à jour une ombre (tous les champs optionnels)
export interface UpdateOmbreData {
  nom?: string;
  description?: string | null;
}

// ========================================
// Types pour la gestion des compétences de Jinwoo
// ========================================

// Interface complète d'une compétence de Jinwoo
export interface JinwooCompetence {
  id: number;
  nom: string;
  image: string | null;
  element: ElementCompetence | null;
  element2: ElementCompetence | null;
  description: string | null;
  last_modified: string | null;
}

// Données pour créer une compétence
export interface CreateCompetenceData {
  nom: string;
  element?: ElementCompetence | null;
  element2?: ElementCompetence | null;
  description?: string | null;
}

// Données pour mettre à jour une compétence (tous les champs optionnels)
export interface UpdateCompetenceData {
  nom?: string;
  element?: ElementCompetence | null;
  element2?: ElementCompetence | null;
  description?: string | null;
}
