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
   * Réorganise les positions des chasseurs dans un tier spécifique
   */
  static async reorderChasseurs(
    category: ChasseurCategory,
    tier: TierRank,
    chasseurIds: number[]
  ): Promise<void> {
    try {
      console.info(`Réorganisation des chasseurs dans ${category}/${tier}`);
      
      // Fallback temporaire avec localStorage
      const key = `tier_list_chasseurs_${category}`;
      const existingData: TierListChasseurEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Supprimer toutes les entrées existantes pour ce tier
      const filteredData = existingData.filter((entry: TierListChasseurEntry) => 
        !(entry.category === category && entry.tier === tier)
      );
      
      // Ajouter les nouvelles entrées avec les positions mises à jour
      chasseurIds.forEach((chasseurId, index) => {
        filteredData.push({
          chasseur_id: chasseurId,
          category,
          tier,
          position: index
        });
      });
      
      localStorage.setItem(key, JSON.stringify(filteredData));
      
      console.info('Chasseurs réorganisés localement (temporaire)');

    } catch (error) {
      console.error('Erreur dans reorderChasseurs:', error);
      throw error;
    }
  }

  /**
   * Récupère toute la tier list (toutes catégories)
   */
  static async getFullTierList(): Promise<TierListChasseurEntry[]> {
    try {
      console.info('Récupération de la tier list complète');
      
      // Fallback temporaire avec localStorage
      const categories: ChasseurCategory[] = ["breakers", "dps", "supports", "collab"];
      const allEntries: TierListChasseurEntry[] = [];
      
      categories.forEach(category => {
        const key = `tier_list_chasseurs_${category}`;
        const categoryData = JSON.parse(localStorage.getItem(key) || '[]');
        allEntries.push(...categoryData);
      });
      
      // Trier par catégorie, tier et position
      return allEntries.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        if (a.tier !== b.tier) {
          return a.tier.localeCompare(b.tier);
        }
        return a.position - b.position;
      });

    } catch (error) {
      console.error('Erreur dans getFullTierList:', error);
      return [];
    }
  }
}