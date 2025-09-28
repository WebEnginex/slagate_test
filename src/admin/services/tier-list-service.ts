import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/database_types_full";

type JinwooArme = Database['public']['Tables']['jinwoo_armes']['Row'];

export interface ArmeForTierList {
  id: number;
  nom: string;
  image: string | null;
  element: string | null;
  arme_element: string | null;  // URL vers l'image de l'élément
}

// Type temporaire pour les données de base incluant les deux colonnes
type ArmeFromDatabase = {
  id: number;
  nom: string;
  image: string | null;
  arme_element: string | null;  // URL vers Storage
  element: string | null;       // Nom de l'élément (Feu, Eau, etc.)
}

export class TierListService {
  /**
   * Récupère toutes les armes de Jinwoo pour la tier list
   */
  static async getAllWeapons(): Promise<ArmeForTierList[]> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_armes')
        .select('*')
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des armes:', error);
        throw error;
      }

      return (data || []).map((arme: ArmeFromDatabase) => ({
        id: arme.id,
        nom: arme.nom,
        image: arme.image,
        element: arme.element,  // Nom de l'élément
        arme_element: arme.arme_element  // URL vers l'image de l'élément
      }));
    } catch (error) {
      console.error('Erreur dans getAllWeapons:', error);
      throw error;
    }
  }

  /**
   * Récupère les armes filtrées par élément
   */
  static async getWeaponsByElement(element: string): Promise<ArmeForTierList[]> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_armes')
        .select('*')
        .eq('element', element)  // Filtrer par la colonne element qui contient le nom
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des armes par élément:', error);
        throw error;
      }

      return (data || []).map((arme: ArmeFromDatabase) => ({
        id: arme.id,
        nom: arme.nom,
        image: arme.image,
        element: arme.element,
        arme_element: arme.arme_element
      }));
    } catch (error) {
      console.error('Erreur dans getWeaponsByElement:', error);
      throw error;
    }
  }

  /**
   * Récupère une arme spécifique par ID
   */
  static async getWeaponById(id: number): Promise<ArmeForTierList | null> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_armes')
        .select('id, nom, image, arme_element')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Pas trouvé
        }
        console.error('Erreur lors de la récupération de l\'arme:', error);
        throw error;
      }

      return data ? {
        id: data.id,
        nom: data.nom,
        image: data.image,
        element: (data as unknown as { element: string | null }).element,
        arme_element: data.arme_element
      } : null;
    } catch (error) {
      console.error('Erreur dans getWeaponById:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde une tier list complète d'armes
   */
  static async saveTierList(tierData: { [tier: string]: number[] }): Promise<void> {
    try {
      // D'abord, supprimer toutes les entrées existantes
      const { error: deleteError } = await supabase
        .from('tier_list_armes')
        .delete()
        .neq('id', 0); // Supprimer tout

      if (deleteError) {
        console.error('Erreur lors de la suppression:', deleteError);
        throw deleteError;
      }

      // Préparer les nouvelles données
      const tierListEntries: Database['public']['Tables']['tier_list_armes']['Insert'][] = [];
      
      Object.entries(tierData).forEach(([tier, armeIds]) => {
        armeIds.forEach((armeId, index) => {
          tierListEntries.push({
            arme_id: armeId,
            tier_rank: tier,
            position: index
          });
        });
      });

      // Insérer les nouvelles données si il y en a
      if (tierListEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('tier_list_armes')
          .insert(tierListEntries);

        if (insertError) {
          console.error('Erreur lors de l\'insertion:', insertError);
          throw insertError;
        }
      }

      console.log('Tier list sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur dans saveTierList:', error);
      throw error;
    }
  }

  /**
   * Récupère la tier list sauvegardée
   */
  static async getSavedTierList(): Promise<{ [tier: string]: ArmeForTierList[] }> {
    try {
      const { data, error } = await supabase
        .from('tier_list_armes')
        .select(`
          tier_rank,
          position,
          arme_id,
          jinwoo_armes!inner (
            id,
            nom,
            image,
            arme_element
          )
        `)
        .order('tier_rank')
        .order('position');

      if (error) {
        console.error('Erreur lors de la récupération de la tier list:', error);
        throw error;
      }

      // Organiser les données par tier
      const tierList: { [tier: string]: ArmeForTierList[] } = {
        SSS: [],
        SS: [],
        S: [],
        A: [],
        B: [],
        C: [],
        D: []
      };

      data?.forEach((entry) => {
        const arme: ArmeForTierList = {
          id: entry.jinwoo_armes.id,
          nom: entry.jinwoo_armes.nom,
          image: entry.jinwoo_armes.image,
          element: (entry.jinwoo_armes as unknown as { element: string | null }).element,
          arme_element: entry.jinwoo_armes.arme_element
        };
        
        if (tierList[entry.tier_rank]) {
          tierList[entry.tier_rank].push(arme);
        }
      });

      return tierList;
    } catch (error) {
      console.error('Erreur dans getSavedTierList:', error);
      throw error;
    }
  }

  /**
   * Vérifie si une tier list est sauvegardée
   */
  static async hasSavedTierList(): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('tier_list_armes')
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Erreur lors de la vérification de la tier list:', error);
        return false;
      }

      return (count || 0) > 0;
    } catch (error) {
      console.error('Erreur dans hasSavedTierList:', error);
      return false;
    }
  }
}