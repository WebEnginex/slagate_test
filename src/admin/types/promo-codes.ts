// Types pour les codes promo et leurs récompenses
// Généré automatiquement par Supabase CLI : supabase gen types typescript

export interface PromoCode {
  id: string;
  code: string;
  expires_at: string | null; // ISO timestamp ou null si permanent
  created_at: string;
  updated_at: string;
}

export interface PromoCodeReward {
  id: string;
  promo_code_id: string;
  reward_name: string;
  reward_quantity: number;
  created_at: string;
}

// Type combiné pour l'affichage avec les récompenses
export interface PromoCodeWithRewards extends PromoCode {
  rewards: PromoCodeReward[];
}

// Type pour créer un nouveau code promo
export interface CreatePromoCodeData {
  code: string;
  expires_at: string | null; // null = permanent
  rewards: {
    reward_name: string;
    reward_quantity: number;
  }[];
}

// Type pour mettre à jour un code promo
export interface UpdatePromoCodeData {
  code?: string;
  expires_at?: string | null; // null = permanent
  rewards?: {
    id?: string; // Si présent = update, sinon = create
    reward_name: string;
    reward_quantity: number;
    _toDelete?: boolean; // Pour marquer les récompenses à supprimer
  }[];
}

// Type pour l'affichage formaté (comme dans l'ancienne version)
export interface FormattedPromoCode {
  code: string;
  rewards: string[]; // Format: "Nom x Quantité"
  date: string; // Format: "25 Septembre à 16h59" ou "Permanent"
  isExpired: boolean;
  isPermanent: boolean; // true si pas d'expiration
}