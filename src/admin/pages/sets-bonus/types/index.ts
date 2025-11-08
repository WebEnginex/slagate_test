/**
 * Types pour la gestion des bonus de set
 */

export interface SetBonus {
  id: number;
  nom: string;
  description: string;
  last_modified: string;
}

export interface SetBonusInput {
  nom: string;
  description: string;
}

export interface SetBonusUpdate extends Partial<SetBonusInput> {
  id: number;
}
