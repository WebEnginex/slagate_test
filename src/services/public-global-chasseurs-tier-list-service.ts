import { GlobalChasseursTierListService } from "@/admin/services/global-chasseurs-tier-list-service";
import { ChasseursTierListService } from "@/admin/services/chasseurs-tier-list-service";

export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";

export interface GlobalChasseurWithTierInfo {
  id: number;
  nom: string;
  rarete: string | null;
  element: string | null;
  imageUrl: string | null;
  tier: TierRank;
  position: number;
}

export class PublicGlobalChasseursTierListService {
  /**
   * Récupère la tier list globale des chasseurs
   */
  static async getGlobalTierList(): Promise<GlobalChasseurWithTierInfo[]> {
    try {
      const tierListData = await GlobalChasseursTierListService.getTierList();
      const chasseursData = await ChasseursTierListService.getAllChasseurs();

      // Organiser les données avec les informations de chasseurs
      const result: GlobalChasseurWithTierInfo[] = tierListData.map(item => {
        const chasseur = chasseursData.find(c => c.id === item.chasseur_id);
        return {
          id: item.chasseur_id,
          nom: chasseur?.nom || '',
          rarete: chasseur?.rarete || null,
          element: chasseur?.element_chasseur || null,
          imageUrl: chasseur?.image || null,
          tier: item.tier as TierRank,
          position: item.position
        };
      }).filter(item => item.nom); // Filtrer les chasseurs non trouvés

      return result;
    } catch (error) {
      console.error('Erreur lors du chargement de la tier list globale:', error);
      return [];
    }
  }
}

