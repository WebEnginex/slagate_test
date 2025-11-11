import { supabase } from "@/integrations/supabase/client";

export interface GlobalTierListEntry {
  chasseur_id: number;
  tier: string;
  position: number;
}

export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";

export class GlobalChasseursTierListService {
  /**
   * Récupère toute la tier list globale depuis Supabase
   */
  static async getTierList(): Promise<GlobalTierListEntry[]> {
    try {
      console.info('[getTierList] Récupération de la tier list globale');
      
      const { data, error } = await supabase
        .from('tier_list_global')
        .select('chasseur_id, tier, position')
        .order('tier')
        .order('position');

      if (error) {
        console.error('[getTierList] Erreur Supabase:', error);
        throw error;
      }

      console.log(`[getTierList] ${data?.length || 0} entrées récupérées`);
      return data || [];

    } catch (error) {
      console.error('[getTierList] Erreur:', error);
      throw error;
    }
  }

  /**
   * Met à jour ou ajoute un chasseur dans la tier list globale
   */
  static async updateChasseurTier(
    chasseurId: number, 
    tier: TierRank, 
    position: number
  ): Promise<void> {
    try {
      console.info(`[updateChasseurTier] Mise à jour du chasseur ${chasseurId} dans ${tier} position ${position}`);
      
      // 1. Supprimer l'ancienne entrée pour ce chasseur
      const { error: deleteError } = await supabase
        .from('tier_list_global')
        .delete()
        .eq('chasseur_id', chasseurId);

      if (deleteError) {
        console.error('[updateChasseurTier] Erreur lors de la suppression:', deleteError);
        // On continue même si la suppression échoue (l'entrée n'existe peut-être pas)
      }

      // 2. Insérer la nouvelle entrée
      const { error: insertError } = await supabase
        .from('tier_list_global')
        .insert({
          chasseur_id: chasseurId,
          tier,
          position
        });

      if (insertError) {
        console.error('[updateChasseurTier] Erreur lors de l\'insertion:', insertError);
        throw insertError;
      }

      console.info('[updateChasseurTier] Chasseur mis à jour avec succès');
      
    } catch (error) {
      console.error('[updateChasseurTier] Erreur:', error);
      throw error;
    }
  }

  /**
   * Retire un chasseur de la tier list globale
   */
  static async removeChasseurFromTier(chasseurId: number): Promise<void> {
    try {
      console.info(`[removeChasseurFromTier] Suppression du chasseur ${chasseurId}`);
      
      const { error } = await supabase
        .from('tier_list_global')
        .delete()
        .eq('chasseur_id', chasseurId);

      if (error) {
        console.error('[removeChasseurFromTier] Erreur Supabase:', error);
        throw error;
      }

      console.info('[removeChasseurFromTier] Chasseur supprimé avec succès');

    } catch (error) {
      console.error('[removeChasseurFromTier] Erreur:', error);
      throw error;
    }
  }

  /**
   * Réorganise les chasseurs dans un tier spécifique
   */
  static async reorderChasseurs(
    tier: TierRank,
    chasseurIds: number[]
  ): Promise<void> {
    try {
      console.info(`[reorderChasseurs] Réorganisation des chasseurs dans ${tier}`);
      
      // 1. Supprimer toutes les entrées existantes pour ce tier
      const { error: deleteError } = await supabase
        .from('tier_list_global')
        .delete()
        .eq('tier', tier);

      if (deleteError) {
        console.error('[reorderChasseurs] Erreur lors de la suppression:', deleteError);
        throw deleteError;
      }

      // 2. Insérer les nouvelles entrées avec les positions mises à jour
      const newEntries = chasseurIds.map((chasseurId, index) => ({
        chasseur_id: chasseurId,
        tier,
        position: index
      }));

      if (newEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('tier_list_global')
          .insert(newEntries);

        if (insertError) {
          console.error('[reorderChasseurs] Erreur lors de l\'insertion:', insertError);
          throw insertError;
        }
      }

      console.info('[reorderChasseurs] Chasseurs réorganisés avec succès');

    } catch (error) {
      console.error('[reorderChasseurs] Erreur:', error);
      throw error;
    }
  }
}

