import { supabase } from "@/integrations/supabase/client";

export interface PublicArmeForTierList {
  id: number;
  nom: string;
  image: string | null;
  element: string | null;
  tier: string;
  position: number;
}

export class PublicArmesTierListService {
  /**
   * Récupère toutes les armes
   */
  static async getAllArmes(): Promise<PublicArmeForTierList[]> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_armes')
        .select('id, nom, image, element')
        .order('nom');

      if (error) {
        console.error('Erreur lors de la récupération des armes:', error);
        return [];
      }

      return (data || []).map(arme => ({
        id: arme.id,
        nom: arme.nom,
        image: arme.image,
        element: arme.element,  // Utiliser directement la colonne element qui contient le nom
        tier: "",
        position: 0
      }));
    } catch (error) {
      console.error('Erreur dans getAllArmes:', error);
      return [];
    }
  }

  /**
   * Récupère la tier list des armes depuis la base de données ou localStorage
   */
  static async getArmesTierList(): Promise<{ [tier: string]: PublicArmeForTierList[] }> {
    try {
      // D'abord essayer depuis la base de données avec jointure
      const { data: tierListData, error } = await supabase
        .from('tier_list_armes')
        .select(`
          *,
          jinwoo_armes (
            id,
            nom,
            image,
            element
          )
        `)
        .order('tier_rank')
        .order('position');

      if (!error && tierListData && tierListData.length > 0) {
        
        // Organiser directement par tier
        const result: { [tier: string]: PublicArmeForTierList[] } = {};
        
        tierListData.forEach(item => {
          if (item.jinwoo_armes) {
            const arme = item.jinwoo_armes as {
              id: number;
              nom: string;
              image: string | null;
              element: string | null;
            };
            
            const armeAvecTier: PublicArmeForTierList = {
              id: arme.id,
              nom: arme.nom,
              image: arme.image,
              element: arme.element,  // Utiliser la colonne element
              tier: item.tier_rank,
              position: item.position
            };

            if (!result[item.tier_rank]) {
              result[item.tier_rank] = [];
            }
            result[item.tier_rank].push(armeAvecTier);
          }
        });

        // Trier chaque tier par position
        Object.keys(result).forEach(tier => {
          result[tier].sort((a, b) => a.position - b.position);
        });

        return result;
      } else {
        // Fallback sur localStorage (comme dans l'ancien système)
        try {
          const storedTierList = localStorage.getItem('tier_list_armes');
          if (storedTierList) {
            const parsed = JSON.parse(storedTierList);
            
            // Récupérer toutes les armes
            const armes = await this.getAllArmes();
            
            // Organiser par tier
            const result: { [tier: string]: PublicArmeForTierList[] } = {};
            
            Object.entries(parsed).forEach(([tier, armeIds]: [string, number[]]) => {
              armeIds.forEach((armeId: number, index: number) => {
                const arme = armes.find(a => a.id === armeId);
                if (arme) {
                  const armeAvecTier: PublicArmeForTierList = {
                    ...arme,
                    tier,
                    position: index + 1
                  };

                  if (!result[tier]) {
                    result[tier] = [];
                  }
                  result[tier].push(armeAvecTier);
                }
              });
            });
            return result;
          }
        } catch (e) {
          console.error('Erreur lors de la lecture du localStorage:', e);
        }
        
        return {};
      }
    } catch (error) {
      console.error('Erreur générale dans getArmesTierList:', error);
      return {};
    }
  }
}