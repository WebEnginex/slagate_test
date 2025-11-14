/**
 * Utilitaires pour formater les données des codes promo
 */

import type { PromoCodeWithRewards } from '@/admin/types/promo-codes';

// Type pour l'interface publique (compatible avec l'ancien format)
export interface PublicPromoCode {
  code: string;
  rewards: string[];
  date: string;
}

/**
 * Formate la date d'expiration pour l'affichage public
 */
export const formatExpirationDate = (expiresAt: string | null): string => {
  if (!expiresAt) {
    return 'Permanent';
  }

  const date = new Date(expiresAt);
  const now = new Date();
  
  // Vérifier si le code est expiré
  if (date < now) {
    return `Expiré le ${date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    })} à ${date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }

  // Format pour les codes actifs
  return `${date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  })} à ${date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

/**
 * Formate une récompense pour l'affichage
 */
export const formatReward = (rewardName: string, quantity: number): string => {
  // Formater les grands nombres avec des points pour les milliers
  const formattedQuantity = quantity >= 1000 
    ? quantity.toLocaleString('fr-FR').replace(/\s/g, '.')
    : quantity.toString();
  
  return `${rewardName} x${formattedQuantity}`;
};

/**
 * Convertit les données Supabase vers le format de l'interface publique
 */
export const formatPromoCodesForPublic = (promoCodesWithRewards: PromoCodeWithRewards[]): PublicPromoCode[] => {
  return promoCodesWithRewards.map(promoCode => ({
    code: promoCode.code,
    rewards: promoCode.rewards
      // Filtrer les récompenses invalides (nom vide, "Inconnu", quantité <= 0)
      .filter(reward =>
        reward.reward_name &&
        reward.reward_name.trim() !== '' &&
        reward.reward_name.trim().toLowerCase() !== 'inconnu' &&
        reward.reward_quantity > 0
      )
      .map(reward =>
        formatReward(reward.reward_name, reward.reward_quantity)
      ),
    date: formatExpirationDate(promoCode.expires_at)
  }));
};