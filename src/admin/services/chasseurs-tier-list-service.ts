import { supabase } from "@/integrations/supabase/client";

export interface ChasseurForTierList {
  id: number;
  nom: string;
  image: string | null;
  image_body: string | null;
  element_chasseur: string | null;
  rarete: string | null;
  last_modified: string | null;
}

export interface TierListChasseurEntry {
  chasseur_id: number;
  category: string;
  tier: string;
  position: number;
}

export type ChasseurCategory = "breakers" | "dps" | "supports" | "collab";
export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";

export class ChasseursTierListService {
  /**
   * Récupère tous les chasseurs pour la tier list
   */
  static async getAllChasseurs(): Promise<ChasseurForTierList[]> {
    try {
      const { data, error } = await supabase
        .from('chasseurs')
        .select('id, nom, image, image_body, element_chasseur, rarete, last_modified')
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des chasseurs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getAllChasseurs:', error);
      throw error;
    }
  }

  /**
   * Récupère les chasseurs filtrés par élément
   */
  static async getChasseursByElement(element: string): Promise<ChasseurForTierList[]> {
    try {
      const { data, error } = await supabase
        .from('chasseurs')
        .select('id, nom, image, image_body, element_chasseur, rarete, last_modified')
        .eq('element_chasseur', element)
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des chasseurs par élément:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getChasseursByElement:', error);
      throw error;
    }
  }

  /**
   * Récupère un chasseur spécifique par son ID
   */
  static async getChasseurById(chasseurId: number): Promise<ChasseurForTierList | null> {
    try {
      const { data, error } = await supabase
        .from('chasseurs')
        .select('id, nom, image, image_body, element_chasseur, rarete, last_modified')
        .eq('id', chasseurId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du chasseur:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur dans getChasseurById:', error);
      return null;
    }
  }

  /**
   * Récupère la tier list pour une catégorie donnée depuis Supabase
   */
  static async getTierListByCategory(category: ChasseurCategory): Promise<TierListChasseurEntry[]> {
    try {
      console.info(`[getTierListByCategory] Récupération de la tier list pour la catégorie: ${category}`);

      const { data, error } = await supabase
        .from('tier_list_chasseurs')
        .select('chasseur_id, category, tier, position')
        .eq('category', category)
        .order('tier')
        .order('position');

      if (error) {
        console.error('[getTierListByCategory] Erreur Supabase:', error);
        throw error;
      }

      console.log(`[getTierListByCategory] ${data?.length || 0} entrées récupérées pour ${category}`);
      return data || [];

    } catch (error) {
      console.error('[getTierListByCategory] Erreur:', error);
      throw error;
    }
  }

  /**
   * Met à jour le tier d'un chasseur dans Supabase
   * Utilise upsert pour créer ou mettre à jour l'entrée
   */
  static async updateChasseurTier(
    chasseurId: number,
    category: ChasseurCategory,
    tier: TierRank,
    position: number
  ): Promise<void> {
    try {
      console.info(`[updateChasseurTier] Mise à jour du chasseur ${chasseurId} dans ${category}/${tier} position ${position}`);

      // 1. Supprimer l'ancienne entrée pour ce chasseur dans cette catégorie
      const { error: deleteError } = await supabase
        .from('tier_list_chasseurs')
        .delete()
        .eq('chasseur_id', chasseurId)
        .eq('category', category);

      if (deleteError) {
        console.error('[updateChasseurTier] Erreur lors de la suppression:', deleteError);
        // On continue même si la suppression échoue (l'entrée n'existe peut-être pas)
      }

      // 2. Insérer la nouvelle entrée
      const { error: insertError } = await supabase
        .from('tier_list_chasseurs')
        .insert({
          chasseur_id: chasseurId,
          category,
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
   * Supprime un chasseur de la tier list d'une catégorie dans Supabase
   */
  static async removeChasseurFromTier(chasseurId: number, category: ChasseurCategory): Promise<void> {
    try {
      console.info(`[removeChasseurFromTier] Suppression du chasseur ${chasseurId} de la catégorie ${category}`);

      const { error } = await supabase
        .from('tier_list_chasseurs')
        .delete()
        .eq('chasseur_id', chasseurId)
        .eq('category', category);

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
   * Réorganise les positions des chasseurs dans un tier spécifique dans Supabase
   */
  static async reorderChasseurs(
    category: ChasseurCategory,
    tier: TierRank,
    chasseurIds: number[]
  ): Promise<void> {
    try {
      console.info(`[reorderChasseurs] Réorganisation des chasseurs dans ${category}/${tier}`);

      // 1. Supprimer toutes les entrées existantes pour ce tier
      const { error: deleteError } = await supabase
        .from('tier_list_chasseurs')
        .delete()
        .eq('category', category)
        .eq('tier', tier);

      if (deleteError) {
        console.error('[reorderChasseurs] Erreur lors de la suppression:', deleteError);
        throw deleteError;
      }

      // 2. Insérer les nouvelles entrées avec les positions mises à jour
      const newEntries = chasseurIds.map((chasseurId, index) => ({
        chasseur_id: chasseurId,
        category,
        tier,
        position: index
      }));

      if (newEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('tier_list_chasseurs')
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

  /**
   * Récupère toute la tier list (toutes catégories) depuis Supabase
   */
  static async getFullTierList(): Promise<TierListChasseurEntry[]> {
    try {
      console.info('[getFullTierList] Récupération de la tier list complète');

      const { data, error } = await supabase
        .from('tier_list_chasseurs')
        .select('chasseur_id, category, tier, position')
        .order('category')
        .order('tier')
        .order('position');

      if (error) {
        console.error('[getFullTierList] Erreur Supabase:', error);
        throw error;
      }

      console.log(`[getFullTierList] ${data?.length || 0} entrées récupérées`);
      return data || [];

    } catch (error) {
      console.error('[getFullTierList] Erreur:', error);
      throw error;
    }
  }
}