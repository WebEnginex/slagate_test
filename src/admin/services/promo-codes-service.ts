/**
 * Service pour gérer les codes promo dans Supabase
 * Note: Ce service utilise des appels directs en attendant la mise à jour des types Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { 
  PromoCode, 
  PromoCodeReward, 
  PromoCodeWithRewards, 
  CreatePromoCodeData,
  UpdatePromoCodeData 
} from '@/admin/types/promo-codes';

export class PromoCodesService {
  /**
   * Récupère tous les codes promo avec leurs récompenses
   * Note: Nettoie automatiquement les codes expirés avant de récupérer
   */
  static async getAllPromoCodes(): Promise<PromoCodeWithRewards[]> {
    try {
      // Nettoyer les codes expirés d'abord
      await this.cleanupExpiredCodes();

      const { data: promoCodes, error: promoError } = await supabase
        .from('promo_codes')
        .select(`
          *,
          rewards:promo_code_rewards(*)
        `)
        .order('expires_at', { ascending: false });

      if (promoError) {
        throw new Error(`Erreur lors de la récupération des codes promo: ${promoError.message}`);
      }

      return promoCodes || [];
    } catch (error) {
      console.error('Erreur dans getAllPromoCodes:', error);
      throw error;
    }
  }

  /**
   * Récupère uniquement les codes promo actifs (non expirés)
   */
  static async getActivePromoCodes(): Promise<PromoCodeWithRewards[]> {
    try {
      // Supprimer d'abord les codes expirés
      await this.cleanupExpiredCodes();

      const { data: promoCodes, error: promoError } = await supabase
        .from('promo_codes')
        .select(`
          *,
          rewards:promo_code_rewards(*)
        `)
        .gte('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: true });

      if (promoError) {
        throw new Error(`Erreur lors de la récupération des codes promo actifs: ${promoError.message}`);
      }

      return promoCodes || [];
    } catch (error) {
      console.error('Erreur dans getActivePromoCodes:', error);
      throw error;
    }
  }

  /**
   * Crée un nouveau code promo avec ses récompenses
   */
  static async createPromoCode(data: CreatePromoCodeData): Promise<PromoCodeWithRewards> {
    try {
      // Validation : vérifier qu'il y a au moins une récompense valide
      const validRewards = data.rewards.filter(r => r.reward_name.trim() && r.reward_quantity > 0);
      if (validRewards.length === 0) {
        throw new Error('Au moins une récompense valide est requise');
      }

      // 1. Créer le code promo
      const { data: promoCode, error: promoError } = await supabase
        .from('promo_codes')
        .insert({
          code: data.code.toUpperCase().trim(),
          expires_at: data.expires_at
        })
        .select()
        .single();

      if (promoError) {
        throw new Error(`Erreur lors de la création du code promo: ${promoError.message}`);
      }

      // 2. Créer les récompenses (uniquement les valides)
      const rewardsToInsert = validRewards.map(reward => ({
        promo_code_id: promoCode.id,
        reward_name: reward.reward_name.trim(),
        reward_quantity: reward.reward_quantity
      }));

      const { data: rewards, error: rewardsError } = await supabase
        .from('promo_code_rewards')
        .insert(rewardsToInsert)
        .select();

      if (rewardsError) {
        // Supprimer le code promo créé en cas d'erreur sur les récompenses
        await supabase.from('promo_codes').delete().eq('id', promoCode.id);
        throw new Error(`Erreur lors de la création des récompenses: ${rewardsError.message}`);
      }

      return {
        ...promoCode,
        rewards: rewards || []
      };
    } catch (error) {
      console.error('Erreur dans createPromoCode:', error);
      throw error;
    }
  }

  /**
   * Met à jour un code promo et ses récompenses
   */
  static async updatePromoCode(id: string, data: UpdatePromoCodeData): Promise<PromoCodeWithRewards> {
    try {
      // 1. Mettre à jour le code promo de base (seulement si des champs sont fournis)
      const updateData: Database['public']['Tables']['promo_codes']['Update'] = {};
      if (data.code !== undefined) updateData.code = data.code.toUpperCase().trim();
      if (data.expires_at !== undefined) updateData.expires_at = data.expires_at;

      // Ne faire l'UPDATE que si on a des données à mettre à jour
      if (Object.keys(updateData).length > 0) {
        const { error: promoError } = await supabase
          .from('promo_codes')
          .update(updateData)
          .eq('id', id);

        if (promoError) {
          throw new Error(`Erreur lors de la mise à jour du code promo: ${promoError.message}`);
        }
      }

      // 2. Gérer les récompenses si fournies
      if (data.rewards) {
        // Filtrer les récompenses valides (nom non vide et quantité > 0)
        const validRewards = data.rewards.filter(r => r.reward_name.trim() && r.reward_quantity > 0);

        // Supprimer les récompenses marquées pour suppression
        const rewardsToDelete = validRewards.filter(r => r._toDelete && r.id);
        if (rewardsToDelete.length > 0) {
          const deleteIds = rewardsToDelete.map(r => r.id!);
          await supabase.from('promo_code_rewards').delete().in('id', deleteIds);
        }

        // Mettre à jour les récompenses existantes (avec nom valide)
        const rewardsToUpdate = validRewards.filter(r => r.id && !r._toDelete);
        for (const reward of rewardsToUpdate) {
          await supabase
            .from('promo_code_rewards')
            .update({
              reward_name: reward.reward_name.trim(),
              reward_quantity: reward.reward_quantity
            })
            .eq('id', reward.id!);
        }

        // Créer les nouvelles récompenses (uniquement celles sans ID et valides)
        const newRewards = validRewards.filter(r => !r.id && !r._toDelete);
        if (newRewards.length > 0) {
          const rewardsToInsert = newRewards.map(reward => ({
            promo_code_id: id,
            reward_name: reward.reward_name.trim(),
            reward_quantity: reward.reward_quantity
          }));

          await supabase.from('promo_code_rewards').insert(rewardsToInsert);
        }
      }

      // 3. Récupérer le code promo mis à jour avec ses récompenses
      const { data: updatedPromoCode, error: fetchError } = await supabase
        .from('promo_codes')
        .select(`
          *,
          rewards:promo_code_rewards(*)
        `)
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(`Erreur lors de la récupération du code promo mis à jour: ${fetchError.message}`);
      }

      return updatedPromoCode;
    } catch (error) {
      console.error('Erreur dans updatePromoCode:', error);
      throw error;
    }
  }

  /**
   * Supprime un code promo (et ses récompenses via CASCADE)
   */
  static async deletePromoCode(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression du code promo: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur dans deletePromoCode:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un code promo existe déjà
   */
  static async codeExists(code: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('promo_codes')
        .select('id')
        .eq('code', code.toUpperCase().trim());

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erreur lors de la vérification du code: ${error.message}`);
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Erreur dans codeExists:', error);
      throw error;
    }
  }

  /**
   * Supprime automatiquement les codes promo expirés
   * Retourne le nombre de codes supprimés
   */
  static async cleanupExpiredCodes(): Promise<number> {
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
}