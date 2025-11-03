/**
 * Service public pour récupérer les codes promo (sans authentification admin)
 */

import { supabase } from '@/integrations/supabase/client';
import type { PromoCodeWithRewards } from '@/admin/types/promo-codes';

export class PublicPromoCodesService {
  /**
   * Supprime automatiquement les codes promo expirés
   * Retourne le nombre de codes supprimés
   */
  private static async cleanupExpiredCodes(): Promise<number> {
    try {
      // Supprimer directement les codes expirés via une requête SQL
      const { data, error } = await supabase
        .from('promo_codes')
        .delete()
        .not('expires_at', 'is', null)
        .lt('expires_at', new Date().toISOString())
        .select('id');

      if (error) {
        console.error('Erreur lors du nettoyage des codes expirés:', error);
        return 0;
      }

      const deletedCount = data?.length || 0;
      if (deletedCount > 0) {
        console.log(`${deletedCount} code(s) promo expiré(s) supprimé(s)`);
      }

      return deletedCount;
    } catch (error) {
      console.error('Erreur dans cleanupExpiredCodes:', error);
      // Ne pas faire planter l'application si le nettoyage échoue
      return 0;
    }
  }

  /**
   * Récupère tous les codes promo actifs avec leurs récompenses pour affichage public
   * Note: Nettoie automatiquement les codes expirés avant de récupérer
   */
  static async getAllPromoCodes(): Promise<PromoCodeWithRewards[]> {
    try {
      // Nettoyer les codes expirés d'abord
      await this.cleanupExpiredCodes();

      // 1. Récupérer tous les codes promo actifs (non expirés ou permanents)
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