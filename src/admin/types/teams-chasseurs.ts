// Types pour les Teams Chasseurs

// Importer les constantes et types depuis le fichier centralisé
import {
  ELEMENTS_TEAM,
  ROLES,
  ELEMENT_LABELS,
  ROLE_LABELS,
  ELEMENT_COLORS,
  ELEMENT_ACTIVE_COLORS,
  ELEMENT_ICONS,
  ROLE_ICONS
} from '../constants';

import type { ElementTeam as ElementTypeImported, Role as RoleTypeImported } from '../constants';

// Ré-exporter les types avec des alias pour compatibilité
export type ElementType = ElementTypeImported;
export type RoleType = RoleTypeImported;

// Ré-exporter les constantes pour compatibilité
export { ELEMENTS_TEAM as ELEMENTS, ROLES, ELEMENT_LABELS, ROLE_LABELS, ELEMENT_COLORS, ELEMENT_ACTIVE_COLORS, ELEMENT_ICONS, ROLE_ICONS };

export interface ChasseurInfo {
  id: number;
  nom: string;
  rarete: string | null;
  element: string | null;
  imageUrl: string | null;
}

export interface TeamPosition {
  id: string;
  chasseur_id: number;
  position: number; // 1 = optimal, 2 = alt.1, 3 = alt.2, etc.
  role: RoleType;
  element: ElementType;
  chasseur?: ChasseurInfo; // Informations du chasseur (jointure)
}

export interface ElementTeam {
  element: ElementType;
  breaker_positions: TeamPosition[];
  support_positions: TeamPosition[];
  dps_positions: TeamPosition[];
}

export interface TeamsChasseurs {
  feu: ElementTeam;
  vent: ElementTeam;
  lumiere: ElementTeam;
  eau: ElementTeam;
  tenebres: ElementTeam;
}

// Types pour les formulaires d'administration
export interface TeamPositionForm {
  chasseur_id: number | null;
  position: number;
  role: RoleType;
  element: ElementType;
}

export interface ElementTeamForm {
  element: ElementType;
  breaker_positions: TeamPositionForm[];
  support_positions: TeamPositionForm[];
  dps_positions: TeamPositionForm[];
}

// Types pour les réponses API
export interface CreateTeamPositionRequest {
  chasseur_id: number;
  position: number;
  role: RoleType;
  element: ElementType;
}

export interface UpdateTeamPositionRequest extends CreateTeamPositionRequest {
  id: string;
}

export interface TeamPositionResponse extends TeamPosition {
  created_at: string;
  updated_at: string;
}
