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
   * Récupère la tier list pour une catégorie donnée
   * Utilise localStorage temporairement en attendant que les types Supabase soient mis à jour
   */
  static async getTierListByCategory(category: ChasseurCategory): Promise<TierListChasseurEntry[]> {
    try {
      console.info(`Récupération de la tier list pour la catégorie: ${category}`);
      
      // Fallback temporaire avec localStorage
      const key = `tier_list_chasseurs_${category}`;
      const storedData = localStorage.getItem(key);
      const tierListData: TierListChasseurEntry[] = storedData ? JSON.parse(storedData) : [];
      
      console.log(`localStorage pour ${category}:`, tierListData);
      
      // Trier par tier et position
      const sortedData = tierListData.sort((a, b) => {
        if (a.tier !== b.tier) {
          return a.tier.localeCompare(b.tier);
        }
        return a.position - b.position;
      });
      
      console.log(`Données triées pour ${category}:`, sortedData);
      return sortedData;

    } catch (error) {
      console.error('Erreur dans getTierListByCategory:', error);
      return [];
    }
  }

  /**
   * Met à jour le tier d'un chasseur
   * Utilise localStorage temporairement en attendant que les types Supabase soient mis à jour
   */
  static async updateChasseurTier(
    chasseurId: number, 
    category: ChasseurCategory, 
    tier: TierRank, 
    position: number
  ): Promise<void> {
    try {
      console.info(`Mise à jour du chasseur ${chasseurId} dans ${category}/${tier} position ${position}`);
      
      // Fallback temporaire avec localStorage
      const key = `tier_list_chasseurs_${category}`;
      const existingData = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Supprimer l'ancienne entrée pour ce chasseur
      const filteredData = existingData.filter((entry: TierListChasseurEntry) => entry.chasseur_id !== chasseurId);
      
      // Ajouter la nouvelle entrée
      filteredData.push({
        chasseur_id: chasseurId,
        category,
        tier,
        position
      });
      
      localStorage.setItem(key, JSON.stringify(filteredData));
      
      console.info('Tier list mise à jour localement (temporaire)');
      
    } catch (error) {
      console.error('Erreur dans updateChasseurTier:', error);
      throw error;
    }
  }

  /**
   * Supprime un chasseur de la tier list d'une catégorie
   */
  static async removeChasseurFromTier(chasseurId: number, category: ChasseurCategory): Promise<void> {
    try {
      console.info(`Suppression du chasseur ${chasseurId} de la catégorie ${category}`);
      
      // Fallback temporaire avec localStorage
      const key = `tier_list_chasseurs_${category}`;
      const existingData = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Supprimer l'entrée pour ce chasseur
      const filteredData = existingData.filter((entry: TierListChasseurEntry) => entry.chasseur_id !== chasseurId);
      
      localStorage.setItem(key, JSON.stringify(filteredData));
      
      console.info('Chasseur supprimé de la tier list localement (temporaire)');

    } catch (error) {
      console.error('Erreur dans removeChasseurFromTier:', error);
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