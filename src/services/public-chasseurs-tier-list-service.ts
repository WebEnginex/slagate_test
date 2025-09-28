import { ChasseursTierListService, ChasseurForTierList } from "@/admin/services/chasseurs-tier-list-service";

export type ChasseurCategory = "breakers" | "dps" | "supports" | "collab";
export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";

export interface ChasseurWithTierInfo {
  id: number;
  nom: string;
  rarete: string | null;
  element: string | null;
  imageUrl: string | null;
  tier: TierRank;
  position: number;
  category: ChasseurCategory;
}

export interface TierListData {
  breakers: ChasseurWithTierInfo[];
  dps: ChasseurWithTierInfo[];
  supports: ChasseurWithTierInfo[];
  collab: ChasseurWithTierInfo[];
}

export class PublicChasseursTierListService {
  /**
   * Récupère toutes les tier lists de chasseurs organisées par catégorie
   */
  static async getAllTierLists(): Promise<TierListData> {
    try {
      const categories: ChasseurCategory[] = ["breakers", "dps", "supports", "collab"];
      const result: TierListData = {
        breakers: [],
        dps: [],
        supports: [],
        collab: []
      };

      // Récupérer les données pour chaque catégorie
      for (const category of categories) {
        const tierListData = await ChasseursTierListService.getTierListByCategory(category);
        const chasseursData = await ChasseursTierListService.getAllChasseurs();

        // Organiser les données avec les informations de chasseurs
        const categoryData: ChasseurWithTierInfo[] = tierListData.map(item => {
          const chasseur = chasseursData.find(c => c.id === item.chasseur_id);
          return {
            id: item.chasseur_id,
            nom: chasseur?.nom || '',
            rarete: chasseur?.rarete || null,
            element: chasseur?.element_chasseur || null,
            imageUrl: chasseur?.image || null,
            tier: item.tier as TierRank,
            position: item.position,
            category: category
          };
        }).filter(item => item.nom); // Filtrer les chasseurs non trouvés

        result[category] = categoryData;
      }

      return result;
    } catch (error) {
      console.error('Erreur lors du chargement des tier lists:', error);
      return {
        breakers: [],
        dps: [],
        supports: [],
        collab: []
      };
    }
  }

  /**
   * Récupère la tier list pour une catégorie spécifique
   */
  static async getTierListByCategory(category: ChasseurCategory): Promise<ChasseurWithTierInfo[]> {
    try {
      const tierListData = await ChasseursTierListService.getTierListByCategory(category);
      const chasseursData = await ChasseursTierListService.getAllChasseurs();

      // Organiser les données avec les informations de chasseurs
      const categoryData: ChasseurWithTierInfo[] = tierListData.map(item => {
        const chasseur = chasseursData.find(c => c.id === item.chasseur_id);
        return {
          id: item.chasseur_id,
          nom: chasseur?.nom || '',
          rarete: chasseur?.rarete || null,
          element: chasseur?.element_chasseur || null,
          imageUrl: chasseur?.image || null,
          tier: item.tier as TierRank,
          position: item.position,
          category: category
        };
      }).filter(item => item.nom); // Filtrer les chasseurs non trouvés

      return categoryData;
    } catch (error) {
      console.error(`Erreur lors du chargement de la tier list ${category}:`, error);
      return [];
    }
  }
}