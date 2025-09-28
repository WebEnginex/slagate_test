// Types pour les Teams Chasseurs

export type ElementType = "feu" | "vent" | "lumiere" | "eau" | "tenebres";
export type RoleType = "breaker" | "support" | "dps";

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

// Constantes utiles
export const ELEMENTS: ElementType[] = ["feu", "vent", "lumiere", "eau", "tenebres"];
export const ROLES: RoleType[] = ["breaker", "support", "dps"];

export const ELEMENT_LABELS: Record<ElementType, string> = {
  feu: "Feu",
  vent: "Vent", 
  lumiere: "Lumière",
  eau: "Eau",
  tenebres: "Ténèbres"
};

export const ROLE_LABELS: Record<RoleType, string> = {
  breaker: "Breaker",
  support: "Support",
  dps: "DPS"
};

export const ELEMENT_COLORS: Record<ElementType, string> = {
  feu: "bg-red-500/20 border-red-500/40",
  vent: "bg-green-500/20 border-green-500/40",
  lumiere: "bg-yellow-500/20 border-yellow-500/40",
  eau: "bg-blue-500/20 border-blue-500/40",
  tenebres: "bg-purple-500/20 border-purple-500/40"
};

export const ELEMENT_ACTIVE_COLORS: Record<ElementType, string> = {
  feu: "data-[state=active]:bg-red-600",
  vent: "data-[state=active]:bg-green-600", 
  lumiere: "data-[state=active]:bg-yellow-600",
  eau: "data-[state=active]:bg-blue-600",
  tenebres: "data-[state=active]:bg-purple-600"
};

export const ELEMENT_ICONS: Record<ElementType, string> = {
  feu: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Feu_element.webp",
  vent: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Vent_element.webp", 
  lumiere: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Lumiere_element.webp",
  eau: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Eau_element.webp",
  tenebres: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Tenebre_element.webp"
};

export const ROLE_ICONS: Record<RoleType, string> = {
  breaker: "⚔️",
  support: "🛡️",
  dps: "💥"
};