/**
 * Service public pour récupérer les codes promo (sans authentification admin)
 */

import { supabase } from '@/integrations/supabase/client';
import type { PromoCodeWithRewards } from '@/admin/types/promo-codes';

export class PublicPromoCodesService {
  /**
   * Récupère tous les codes promo avec leurs récompenses pour affichage public
   */
  static async getAllPromoCodes(): Promise<PromoCodeWithRewards[]> {
    try {
      // 1. Récupérer tous les codes promo
      const { data: promoCodes, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (promoError) {
        console.error('Erreur lors de la récupération des codes promo:', promoError);
        throw promoError;
      }

      if (!promoCodes || promoCodes.length === 0) {
        return [];
      }

      // 2. Récupérer toutes les récompenses
      const { data: rewards, error: rewardsError } = await supabase
        .from('promo_code_rewards')
        .select('*')
        .in('promo_code_id', promoCodes.map(code => code.id));

      if (rewardsError) {
        console.error('Erreur lors de la récupération des récompenses:', rewardsError);
        throw rewardsError;
      }

      // 3. Combiner les codes avec leurs récompenses
      const promoCodesWithRewards: PromoCodeWithRewards[] = promoCodes.map(code => ({
        ...code,
        rewards: (rewards || []).filter(reward => reward.promo_code_id === code.id)
      }));

      return promoCodesWithRewards;
    } catch (error) {
      console.error('Erreur dans getAllPromoCodes:', error);
      throw error;
    }
  }
}